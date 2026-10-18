const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('fs'),path=require('path'),ts=require('typescript'),Module=require('module');
function load(file,overrides={}){const absolute=path.resolve(file),m=new Module(absolute,module);m.paths=module.paths;m.require=id=>id in overrides?overrides[id]:require(id);m._compile(ts.transpileModule(fs.readFileSync(absolute,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,absolute);return m.exports;}
const validation=load('src/lib/review-validation.ts'),store=load('src/lib/reviews.ts');
const valid={name:'Test author',email:'private@example.test',text:'A clearly marked test review, only in memory.',rating:4,lang:'lt',consent:true,company:''};
process.env.AIRTABLE_API_KEY='test-key-not-a-real-credential';process.env.AIRTABLE_BASE_ID='appTestOnly';process.env.RESEND_API_KEY='test-mail-key';process.env.REVIEWS_MODERATION_SECRET='a-separate-test-signing-secret';
const records=new Map(),mails=[],jobs=[],writes=[];let nextId=1;
global.fetch=async(input,init={})=>{const u=new URL(input);if(u.hostname==='api.resend.com'){mails.push(JSON.parse(init.body));return Response.json({id:'test-only'})}assert.equal(u.hostname,'api.airtable.com');const body=init.body?JSON.parse(init.body):null;const id=u.pathname.split('/').at(-1);
 if(init.method==='POST'){const rec={id:'rec'+String(nextId++).padStart(14,'0'),fields:body.fields};records.set(rec.id,rec);writes.push({method:'POST',body});return Response.json(rec)}
 if(init.method==='PATCH'){assert(records.has(id));writes.push({method:'PATCH',body});const rec=records.get(id);Object.assign(rec.fields,body.fields);return Response.json(rec)}
 if(id.startsWith('rec'))return Response.json(records.get(id));
 assert(u.searchParams.get('filterByFormula').includes(store.REVIEW_SOURCE),'reads must be restricted to review source');assert(!u.searchParams.getAll('fields[]').includes('Email'),'private email must not be fetched by public list');return Response.json({records:[...records.values()]});
};
const overrides={'@/lib/reviews':store,'@/lib/review-validation':validation,'@/lib/lead-rate-limit':{limitLead:async()=>({allowed:true})},'@/lib/contact':{CONTACT_EMAIL:'owner@example.test'},'@/lib/site-metadata':{SITE_INDEXABLE:false,SITE_URL:'https://atd.lt',SOCIAL_MEDIA_URL:'https://new.atd.lt'},'next/server':{after:fn=>jobs.push(fn)}};
const api=load('src/app/api/reviews/route.ts',overrides),moderate=load('src/app/api/reviews/moderate/route.ts',overrides);
const request=(url,data,extra={})=>new Request(url,{method:'POST',headers:{'content-type':'application/json',origin:'https://new.atd.lt',...extra},body:JSON.stringify(data)});

test('validation requires intentional rating, consent, bounded plain strings',()=>{
 assert('data'in validation.validateReview(valid));
 for(const rating of [0,6,2.5,'5',null])assert('error'in validation.validateReview({...valid,rating}));
 for(const change of [{consent:false},{name:'x'},{text:'short'},{text:'a'.repeat(3001)},{email:'bad'},{lang:'xx'},{name:{toString:'bad'}},{text:'a\u0000'.repeat(20)}])assert('error'in validation.validateReview({...valid,...change}));
 assert('honeypot'in validation.validateReview({...valid,company:'spam'}));
});
test('bounded parser rejects oversized JSON, origin rejects cross-site writes',async()=>{
 await assert.rejects(()=>validation.readReviewJson(request('https://new.atd.lt/api/reviews',{text:'x'.repeat(17000)})),/payload_too_large/);
 assert.equal(validation.reviewOriginAllowed(request('https://new.atd.lt/api/reviews',{}, {origin:'https://attacker.test'})),false);
});
test('new review remains pending, private email never enters public API, approval link uses fragment',async()=>{
 const response=await api.POST(request('https://new.atd.lt/api/reviews',valid));assert.equal(response.status,200);assert.deepEqual(await response.json(),{success:true});assert.equal(records.size,1);
 const rec=[...records.values()][0],doc=JSON.parse(rec.fields['Žinutė']);assert.equal(doc.moderation,'pending');assert.equal(doc.rating,4);assert.equal(rec.fields.Email,valid.email);
 const before=await api.GET();assert.deepEqual((await before.json()).reviews,[]);
 await jobs.shift()();assert.equal(mails.length,1);assert.deepEqual(mails[0].to,['owner@example.test']);assert(mails[0].text.includes('/atsiliepimai/patvirtinti#token='));assert(!mails[0].text.includes('/patvirtinti?token='));
});
test('invalid, expired or altered tokens cannot read or approve; GET never writes',async()=>{
 const id=[...records.keys()][0],token=store.moderationToken(id),before=writes.length;
 assert.equal(store.verifyModerationToken(token),id);assert.equal(store.verifyModerationToken(token.slice(0,-2)+'xx'),null);assert.equal(store.verifyModerationToken(store.moderationToken(id,Date.now()-31*86400000)),null);
 const invalid=await moderate.POST(request('https://new.atd.lt/api/reviews/moderate',{token:'bad',action:'approve'}));assert.equal(invalid.status,403);
 const inspected=await moderate.GET(new Request('https://new.atd.lt/api/reviews/moderate',{headers:{Authorization:'Bearer '+token}}));assert.equal(inspected.status,200);assert.equal(writes.length,before);assert.equal(inspected.headers.get('cache-control'),'private, no-store');
});
test('approval preserves original rating/text, publishes only safe fields, replay cannot change decision',async()=>{
 const id=[...records.keys()][0],token=store.moderationToken(id);
 const approved=await moderate.POST(request('https://new.atd.lt/api/reviews/moderate',{token,action:'approve'}));assert.equal((await approved.json()).state,'approved');
 const doc=JSON.parse(records.get(id).fields['Žinutė']);assert.equal(doc.name,valid.name);assert.equal(doc.text,valid.text);assert.equal(doc.rating,valid.rating);
 const result=await(await api.GET()).json();assert.equal(result.reviews.length,1);assert.deepEqual(Object.keys(result.reviews[0]).sort(),['id','name','rating','text','createdAt'].sort());assert(!JSON.stringify(result).includes(valid.email));
 const before=writes.length;await moderate.POST(request('https://new.atd.lt/api/reviews/moderate',{token,action:'reject'}));assert.equal(writes.length,before);
});
test('rejected and malformed rows stay private, including a forged non-review source',async()=>{
 const id=await store.saveReview({...valid,rating:1});await store.moderateReview(id,'reject');
 records.set('rec00000000009999',{id:'rec00000000009999',fields:{'Šaltinis':'an unrelated client lead','Žinutė':JSON.stringify({version:1,name:'Never public',rating:5,text:valid.text,consent:true,moderation:'approved',createdAt:new Date().toISOString()})}});
 assert.equal((await store.getPublicReviews()).reviews.length,1);assert.equal(await store.getModerationReview('rec00000000009999'),null);
});
test('invalid API submissions never store or notify; separate limiter scope and failure are respected',async()=>{
 const before=writes.length;
 assert.equal((await api.POST(request('https://new.atd.lt/api/reviews',{...valid,rating:0}))).status,400);
 assert.equal((await api.POST(request('https://new.atd.lt/api/reviews',valid,{origin:'https://attacker.test'}))).status,403);
 const limited=load('src/app/api/reviews/route.ts',{...overrides,'@/lib/lead-rate-limit':{limitLead:async(req,scope)=>{assert.equal(scope,'review');return{allowed:false,retryAfter:60}}}});
 const res=await limited.POST(request('https://new.atd.lt/api/reviews',valid));assert.equal(res.status,429);assert.equal(res.headers.get('retry-after'),'60');assert.equal(writes.length,before);
});
