/* eslint-disable @typescript-eslint/no-require-imports -- Standalone Node.js CommonJS audit harness. */
const { chromium } = require('C:/Users/aplin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs/promises');const path=require('node:path');
const root=path.resolve(__dirname,'..');const base='http://localhost:3100';
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 const report={base,browser:browser.version(),checks:[],performance:[],assets:[],http:[]};
 try{
 for(const width of [320,390,768,1024]){
  const context=await browser.newContext({viewport:{width,height:844},reducedMotion:'reduce'});await context.addInitScript(()=>localStorage.setItem('atd-cookie-consent','rejected'));const page=await context.newPage();
  await page.goto(base,{waitUntil:'networkidle'});await page.waitForTimeout(800);
  report.checks.push(await page.evaluate(()=>{
   const box=e=>{const b=e.getBoundingClientRect();return{x:b.x,y:b.y,w:b.width,h:b.height,text:e.innerText?.slice(0,110)}};
   const h=document.querySelector('h1').parentElement;const section=document.querySelector('main section');const strip=[...section.querySelectorAll('div')].find(e=>e.className.includes('overflow-x-auto'));
   return{width:innerWidth,overflow:document.scrollingElement.scrollWidth>innerWidth,h1Group:box(h),strip:box(strip),fixed:[...document.querySelectorAll('body *')].filter(e=>getComputedStyle(e).position==='fixed').map(e=>({...box(e),z:getComputedStyle(e).zIndex})),effectiveH1Opacity:getComputedStyle(h).opacity};
  }));
  if(width===390){
   await page.getByRole('button',{name:'Vejos įrengimas',exact:true}).focus();await page.keyboard.press('Enter');await page.waitForTimeout(400);
   report.checks.push({type:'popup',width,dialogCount:await page.getByRole('dialog').count(),focus:await page.evaluate(()=>document.activeElement?.outerHTML.slice(0,180)),overflow:await page.evaluate(()=>document.body.style.overflow)});
   await page.screenshot({path:path.join(__dirname,'screenshots','service-popup-mobile.png')});await page.keyboard.press('Escape');
  }
  await context.close();
 }
 // One cold-context lab sample per route, explicit emulated slow-4G + 4x CPU.
 for(const route of ['/','/paslaugos/veja']){
  const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true});const page=await context.newPage();const client=await context.newCDPSession(page);
  await client.send('Network.enable');await client.send('Network.setCacheDisabled',{cacheDisabled:true});
  await client.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:200000,uploadThroughput:93750});await client.send('Emulation.setCPUThrottlingRate',{rate:4});
  await page.addInitScript(()=>{localStorage.setItem('atd-cookie-consent','rejected');window.__lab={lcp:[],cls:[],longtasks:[]};for(const type of ['largest-contentful-paint','layout-shift','longtask'])new PerformanceObserver(list=>{for(const e of list.getEntries()){if(type==='largest-contentful-paint')window.__lab.lcp.push({t:e.startTime,size:e.size,tag:e.element?.tagName,url:e.url});if(type==='layout-shift'&&!e.hadRecentInput)window.__lab.cls.push(e.value);if(type==='longtask')window.__lab.longtasks.push(e.duration)}}).observe({type,buffered:true})});
  await page.goto(base+route,{waitUntil:'load',timeout:60000});await page.waitForTimeout(14000);
  report.performance.push(await page.evaluate(route=>({route,mode:'single local production cold-context sample; slow4G 1.6Mbps/150ms, CPU4x',...window.__lab,nav:performance.getEntriesByType('navigation').map(e=>({ttfb:e.responseStart,dcl:e.domContentLoadedEventEnd,load:e.loadEventEnd})),paint:performance.getEntriesByType('paint').map(e=>({name:e.name,t:e.startTime})),resources:performance.getEntriesByType('resource').map(e=>({url:e.name,type:e.initiatorType,bytes:e.transferSize,duration:e.duration})),heroVisible:document.querySelector('h1')&&getComputedStyle(document.querySelector('h1').parentElement).opacity}),route));
  await context.close();console.log('LAB',route);
 }
 for(const route of ['/robots.txt','/sitemap.xml','/llms.txt','/lt/gallery/test','/lt/pages/2187/test','/en','/audit-missing-page']){
  const res=await fetch(base+route,{redirect:'manual'});report.http.push({route,status:res.status,location:res.headers.get('location'),contentType:res.headers.get('content-type'),headers:Object.fromEntries(res.headers),body:route.endsWith('.xml')||route.endsWith('.txt')?await res.text():undefined});
 }
 for(const dir of ['src/components','src/lib']){
  async function walk(d){for(const f of await fs.readdir(path.join(root,d),{withFileTypes:true})){const n=path.join(d,f.name);if(f.isDirectory())await walk(n);else if(/\.(tsx?|css)$/.test(n)){const t=await fs.readFile(path.join(root,n),'utf8');for(const m of t.matchAll(/["'](\/images\/[^"']+)["']/g)){try{await fs.access(path.join(root,'public',m[1]));}catch{report.assets.push({file:n,missing:m[1]})}}}}}await walk(dir);
 }
 await fs.writeFile(path.join(__dirname,'production-checks.json'),JSON.stringify(report,null,2));console.log('SAVED production-checks.json');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
