/* eslint-disable @typescript-eslint/no-require-imports -- Standalone Node.js CommonJS audit harness. */
const { chromium } = require('C:/Users/aplin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('node:fs/promises');
const path = require('node:path');
const out = __dirname;
const routes = ['/', '/paslaugos/veja', '/paslaugos/apzeldinimas', '/paslaugos/trinkeles', '/paslaugos/laistymas', '/paslaugos/tvenkiniai', '/kontaktai', '/darbai'];
const slug = r => r === '/' ? 'home' : r.replaceAll('/', '-').slice(1);
async function measure(page) {
  return page.evaluate(() => {
    const style = el => { const s = getComputedStyle(el); const r = el.getBoundingClientRect(); return { text: el.innerText?.slice(0, 140), x:r.x,y:r.y,w:r.width,h:r.height,font:s.fontFamily,size:s.fontSize,color:s.color,bg:s.backgroundColor,opacity:s.opacity,transform:s.transform }; };
    const visible = e => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e);return r.width>0 && r.height>0 && s.visibility !== 'hidden' && s.display !== 'none'; };
    return {
      title:document.title,lang:document.documentElement.lang,width:innerWidth,scrollWidth:document.scrollingElement.scrollWidth,
      canonical:document.querySelector('link[rel=canonical]')?.href || null,
      description:document.querySelector('meta[name=description]')?.content,
      ogImage:document.querySelector('meta[property="og:image"]')?.content || null,
      h1:[...document.querySelectorAll('h1')].map(style), h2:[...document.querySelectorAll('h2')].map(e=>e.innerText),
      header:style(document.querySelector('header')),headerLinks:[...document.querySelectorAll('header a,header button')].filter(visible).map(style),
      bodyFont:getComputedStyle(document.body).fontFamily,
      images:[...document.images].map(e=>({src:e.getAttribute('src'),alt:e.alt,loaded:e.complete&&e.naturalWidth>0})),
      schemas:[...document.querySelectorAll('script[type="application/ld+json"]')].map(s=>JSON.parse(s.textContent)),
      smallTargets:[...document.querySelectorAll('button,a,input,select')].filter(visible).map(e=>({...style(e),label:e.getAttribute('aria-label'),href:e.getAttribute('href')})).filter(e=>e.w<24 || e.h<24),
      links:[...document.querySelectorAll('a[href]')].map(e=>e.getAttribute('href')),
      mainText:document.querySelector('main')?.innerText?.slice(0,2400)
    };
  });
}
(async () => {
  await fs.mkdir(path.join(out,'screenshots'),{recursive:true});
  const browser = await chromium.launch({channel:'msedge',headless:true});
  const report = {browser:browser.version(),base:'http://localhost:3100',date:'2026-10-17',pages:[],interactions:{},errors:[]};
  for (const viewport of [{width:1440,height:900},{width:390,height:844}]) {
    const context = await browser.newContext({viewport,deviceScaleFactor:1});
    await context.addInitScript(()=>localStorage.setItem('atd-cookie-consent','rejected'));
    const page=await context.newPage();
    page.on('pageerror',e=>report.errors.push(e.message));
    for (const route of routes) {
      const response = await page.goto(report.base+route,{waitUntil:'networkidle',timeout:60000});
      await page.waitForTimeout(route==='/'?1800:700);
      if(route==='/' && await page.getByRole('button',{name:'Praleisti'}).count()) await page.getByRole('button',{name:'Praleisti'}).click();
      // Scroll once to expose all scroll-triggered sections, then capture at top.
      await page.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=500){window.scrollTo({top:y,behavior:'instant'});await new Promise(r=>setTimeout(r,150));}window.scrollTo({top:0,behavior:'instant'});});
      await page.waitForTimeout(900);
      const data=await measure(page);
      data.route=route;data.status=response.status();data.viewport=viewport;
      const filename=`${slug(route)}-${viewport.width}.png`;
      await page.screenshot({path:path.join(out,'screenshots',filename),fullPage:true});
      data.screenshot=filename;report.pages.push(data);
      console.log(viewport.width,route,response.status(),'overflow',data.scrollWidth>viewport.width,'h1',data.h1.length,'font',data.bodyFont);
    }
    if(viewport.width===1440){
      await page.goto(report.base+'/darbai',{waitUntil:'networkidle'});
      const menu=page.locator('header').getByRole('button',{name:'Paslaugos',exact:true});
      await page.mouse.move(1400,850);await menu.focus();await page.keyboard.press('Enter');await page.waitForTimeout(250);
      report.interactions.keyboardDropdown={opened:await page.locator('header a[href="/paslaugos/veja"]').count()};
      await menu.hover();await page.waitForTimeout(250);const box=await menu.boundingBox();
      await page.mouse.move(box.x+box.width/2,box.y+box.height+6);await page.waitForTimeout(250);
      report.interactions.dropdownGap={openAfterGap:await page.locator('header a[href="/paslaugos/veja"]').count()};
      await page.mouse.move(1400,850);
      await page.getByRole('button',{name:'Ruloninė veja su dryžiais',exact:true}).click();await page.waitForTimeout(300);
      await page.screenshot({path:path.join(out,'screenshots','gallery-lightbox.png')});
      await page.keyboard.press('Escape');await page.waitForTimeout(300);
      report.interactions.lightbox={openAfterEscape:await page.getByRole('button',{name:'Uždaryti',exact:true}).count(),bodyOverflow:await page.evaluate(()=>getComputedStyle(document.body).overflow),dialogs:await page.getByRole('dialog').count(),focus:await page.evaluate(()=>document.activeElement?.outerHTML.slice(0,200))};
      await page.getByRole('button',{name:'Uždaryti',exact:true}).click();
      for(const name of ['Veja','Apželdinimas','Trinkelės','Laistymas','Visos'])await page.getByRole('button',{name,exact:true}).click();
      await page.waitForTimeout(600);report.interactions.filterFinalCount=await page.locator('main button.group').count();
      await page.getByRole('button',{name:'Switch to English',exact:true}).first().click();
      report.interactions.english={lang:await page.locator('html').getAttribute('lang'),title:await page.title(),h1:await page.locator('h1').innerText()};
      await page.getByRole('button',{name:'Striped roll-on lawn',exact:true}).click();
      report.interactions.english.lightboxCloseLT=await page.getByRole('button',{name:'Uždaryti',exact:true}).count();
    }else{
      await page.goto(report.base+'/',{waitUntil:'networkidle'});
      await page.getByRole('button',{name:'Atidaryti meniu',exact:true}).click();
      await page.keyboard.press('Escape');await page.waitForTimeout(350);
      report.interactions.mobileMenu={openAfterEscape:await page.getByRole('button',{name:'Uždaryti meniu',exact:true}).count(),bodyOverflow:await page.evaluate(()=>getComputedStyle(document.body).overflow)};
      await page.screenshot({path:path.join(out,'screenshots','mobile-menu.png')});
    }
    await context.close();
  }
  // Fresh visitor overlay evidence.
  const fresh = await browser.newContext({viewport:{width:390,height:844}});const fp=await fresh.newPage();
  await fp.goto(report.base+'/darbai',{waitUntil:'networkidle'});await fp.waitForTimeout(500);
  await fp.screenshot({path:path.join(out,'screenshots','fresh-mobile-cookie.png')});
  report.interactions.freshOverlay=await fp.evaluate(()=>[...document.querySelectorAll('body *')].filter(e=>getComputedStyle(e).position==='fixed').map(e=>({text:e.innerText?.slice(0,90),z:getComputedStyle(e).zIndex,y:e.getBoundingClientRect().y,h:e.getBoundingClientRect().height})));await fresh.close();
  const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:1440,height:900}});const np=await nojs.newPage();
  await np.goto(report.base,{waitUntil:'networkidle'});report.interactions.noJS=await measure(np);await np.screenshot({path:path.join(out,'screenshots','home-no-js.png'),fullPage:true});await nojs.close();
  const reduced=await browser.newContext({reducedMotion:'reduce',viewport:{width:1440,height:900}});const rp=await reduced.newPage();
  await rp.goto(report.base,{waitUntil:'networkidle'});await rp.waitForTimeout(1000);
  report.interactions.reducedMotion=await rp.evaluate(()=>({video:!!document.querySelector('video'),runningAnimations:document.getAnimations().filter(a=>a.playState==='running').length}));await reduced.close();
  await fs.writeFile(path.join(out,'browser-data.json'),JSON.stringify(report,null,2));
  await browser.close();console.log('SAVED browser-data.json');
})().catch(e=>{console.error(e);process.exitCode=1});
