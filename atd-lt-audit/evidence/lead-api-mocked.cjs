/* eslint-disable @typescript-eslint/no-require-imports -- Standalone Node.js CommonJS audit harness. */
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('C:/CURSOR/ATD_Remake/atd-lt/node_modules/typescript');
const source = fs.readFileSync('src/app/api/lead/route.ts', 'utf8');
const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
function load(fetchImpl = async () => new Response('{}', {status: 200})) {
  const saved = [], errors = [];
  const auditModule = { exports: {} };
  const context = { exports: auditModule.exports, module: auditModule, require: () => ({saveLead: async data => {saved.push(data)}}), process: {env: {RESEND_API_KEY: 'MOCK_ONLY'}}, Response, fetch: fetchImpl, console: {error: (...args) => errors.push(args.map(String).join(' '))} };
  vm.runInNewContext(js, context);
  return { POST: auditModule.exports.POST, saved, errors };
}
const request = data => ({json: async () => data});
(async () => {
 const results = [];
 for (const [name, body] of [
  ['honeypot', {vardas:'Test',telefonas:'123',company:'Bot'}],
  ['missing-phone', {vardas:'Test'}],
  ['invalid-email', {vardas:'Test',telefonas:'x',email:'not-an-email'}],
  ['unbounded-service', {vardas:'Test',telefonas:'123',paslauga:'x'.repeat(100000)}],
  ['negative-area', {vardas:'Test',telefonas:'123',plotas:'-100'}],
 ]) { const route=load(); const res=await route.POST(request(body)); results.push({name,status:res.status,saved:route.saved.length,serviceLength:route.saved[0]?.paslauga?.length}); }
 const repeated=load(); const statuses=[]; for(let i=0;i<5;i++)statuses.push((await repeated.POST(request({vardas:'Test',telefonas:'123'}))).status); results.push({name:'identical-repeat',statuses,saved:repeated.saved.length});
 const rejected=load(async()=>new Response('{"message":"rate limited"}',{status:429})); const rejectionResponse=await rejected.POST(request({vardas:'Test',telefonas:'123'})); await new Promise(resolve=>setTimeout(resolve,0)); results.push({name:'email-http-429',status:rejectionResponse.status,loggedErrors:rejected.errors.length});
 let releaseEmail; let emailFinished=false; const detached=load(()=>new Promise(resolve=>{releaseEmail=()=>{emailFinished=true;resolve(new Response('{}',{status:200}))}})); const detachedResponse=await detached.POST(request({vardas:'Test',telefonas:'123'})); results.push({name:'email-pending-at-response',status:detachedResponse.status,emailFinished}); releaseEmail();
 console.log(JSON.stringify(results,null,2));
})().catch(error=>{console.error(error);process.exitCode=1});
