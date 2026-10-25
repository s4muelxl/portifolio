import {chromium,webkit} from 'playwright';
import pixelmatch from 'pixelmatch';
import {PNG} from 'pngjs';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';

const CURRENT='http://127.0.0.1:4173';
const BASELINE='http://127.0.0.1:4174';
const OUT='artifacts/visual';
const allowVisualChange=process.env.ALLOW_VISUAL_CHANGE==='1';
const maxDiffRatio=0.008;

const viewports=[
  ['mobile-320',320,800],
  ['mobile-390',390,844],
  ['tablet-768',768,1024],
  ['tablet-1024',1024,768],
  ['breakpoint-1080',1080,810],
  ['breakpoint-1081',1081,810],
  ['desktop-1440',1440,900],
  ['desktop-1920',1920,1080],
  ['ultrawide-2560',2560,1440],
];

const routes=[
  {name:'home',url:'/',focus:'#projetos',critical:['.site-header','.hero-grid','.profile-line','.featured-projects','.contact-panel']},
  {name:'cases',url:'/projetos.html',focus:'#nexo',critical:['.site-header','.projects-title-grid','.project-detail-section','.case-proof-summary']},
];

const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));

async function waitForServer(url){
  for(let i=0;i<50;i++){
    try{const response=await fetch(url);if(response.ok)return;}catch{}
    await sleep(200);
  }
  throw new Error('Servidor local indisponível: '+url);
}

async function stabilize(page){
  await page.addStyleTag({content:`
    *,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}
    .case-detail,.cert-grid{content-visibility:visible!important}
    [data-premium-inview]{opacity:1!important;transform:none!important}
  `});
  await page.evaluate(async()=>{if(document.fonts?.ready)await document.fonts.ready;});
  await sleep(120);
}

async function auditLayout(page,route,viewportName){
  const result=await page.evaluate(selectors=>{
    const width=window.innerWidth;
    const doc=document.documentElement;
    const boxes=selectors.flatMap(selector=>[...document.querySelectorAll(selector)]).filter(el=>{
      const style=getComputedStyle(el);
      return style.display!=='none'&&style.visibility!=='hidden';
    }).map(el=>{
      const r=el.getBoundingClientRect();
      return {selector:el.className||el.tagName,left:r.left,right:r.right,width:r.width};
    });
    const bad=boxes.filter(r=>r.width>0&&(r.left < -1||r.right > width+1));
    return {viewport:width,scrollWidth:doc.scrollWidth,overflow:doc.scrollWidth-width,bad};
  },route.critical);

  if(result.overflow>1)throw new Error(`${route.name}/${viewportName}: overflow horizontal de ${result.overflow}px`);
  if(result.bad.length)throw new Error(`${route.name}/${viewportName}: elementos críticos fora do viewport: ${JSON.stringify(result.bad)}`);
}

async function capture(page,file,focusSelector){
  if(focusSelector){
    const locator=page.locator(focusSelector).first();
    await locator.scrollIntoViewIfNeeded();
    await page.evaluate(()=>window.scrollBy(0,-80));
    await sleep(80);
  }else{
    await page.evaluate(()=>scrollTo(0,0));
    await sleep(80);
  }
  await page.screenshot({path:file,fullPage:false,animations:'disabled'});
}

async function compareImages(baseFile,currentFile,diffFile,label){
  const a=PNG.sync.read(await readFile(baseFile));
  const b=PNG.sync.read(await readFile(currentFile));
  if(a.width!==b.width||a.height!==b.height)throw new Error(`${label}: dimensões divergentes ${a.width}x${a.height} vs ${b.width}x${b.height}`);
  const diff=new PNG({width:a.width,height:a.height});
  const changed=pixelmatch(a.data,b.data,diff.data,a.width,a.height,{threshold:.12,includeAA:false});
  const ratio=changed/(a.width*a.height);
  if(changed)await writeFile(diffFile,PNG.sync.write(diff));
  console.log(`${label}: ${(ratio*100).toFixed(3)}% pixels diferentes`);
  if(ratio>maxDiffRatio&&!allowVisualChange)throw new Error(`${label}: regressão visual acima de ${maxDiffRatio*100}%`);
}

await Promise.all([waitForServer(CURRENT),waitForServer(BASELINE)]);
for(const folder of ['baseline','current','diff'])await mkdir(path.join(OUT,folder),{recursive:true});

const browser=await chromium.launch({headless:true});
const failures=[];

try{
  for(const [viewportName,width,height] of viewports){
    const context=await browser.newContext({viewport:{width,height},colorScheme:'dark',reducedMotion:'reduce'});
    for(const route of routes){
      const baseline=await context.newPage();
      const current=await context.newPage();
      try{
        await Promise.all([
          baseline.goto(BASELINE+route.url,{waitUntil:'networkidle',timeout:30000}),
          current.goto(CURRENT+route.url,{waitUntil:'networkidle',timeout:30000}),
        ]);
        await Promise.all([stabilize(baseline),stabilize(current)]);
        await auditLayout(current,route,viewportName);

        for(const state of ['top','focus']){
          const focus=state==='focus'?route.focus:null;
          const stem=`${route.name}-${viewportName}-${state}`;
          const baseFile=path.join(OUT,'baseline',stem+'.png');
          const currentFile=path.join(OUT,'current',stem+'.png');
          const diffFile=path.join(OUT,'diff',stem+'.png');
          await capture(baseline,baseFile,focus);
          await capture(current,currentFile,focus);
          await compareImages(baseFile,currentFile,diffFile,stem);
        }

        if(width<=1080){
          for(const [page,label] of [[baseline,'baseline'],[current,'current']]){
            await page.evaluate(()=>scrollTo(0,0));
            await page.locator('#navToggle').click();
            await sleep(80);
            const menu=await page.locator('#navMenu').boundingBox();
            if(!menu||menu.x < -1||menu.x+menu.width > width+1)throw new Error(`${route.name}/${viewportName}: menu mobile fora do viewport`);
            await page.screenshot({path:path.join(OUT,label,`${route.name}-${viewportName}-menu.png`),animations:'disabled'});
          }
          await current.keyboard.press('Escape');
          const menuState=await current.locator('#navToggle').getAttribute('aria-expanded');
          const restoredFocus=await current.evaluate(()=>document.activeElement?.id);
          if(menuState!=='false'||restoredFocus!=='navToggle')throw new Error(`${route.name}/${viewportName}: Escape não fechou o menu com restauração de foco`);
          await compareImages(
            path.join(OUT,'baseline',`${route.name}-${viewportName}-menu.png`),
            path.join(OUT,'current',`${route.name}-${viewportName}-menu.png`),
            path.join(OUT,'diff',`${route.name}-${viewportName}-menu.png`),
            `${route.name}-${viewportName}-menu`
          );
        }
      }catch(error){
        failures.push(error instanceof Error?error.message:String(error));
      }finally{
        await baseline.close();
        await current.close();
      }
    }
    await context.close();
  }
}finally{
  await browser.close();
}

async function smokeBrowser(engine,name,contextOptions,expectInApp=false){
  const browser=await engine.launch({headless:true});
  try{
    const context=await browser.newContext({...contextOptions,reducedMotion:'reduce',colorScheme:'dark'});
    for(const route of routes){
      const page=await context.newPage();
      try{
        await page.goto(CURRENT+route.url,{waitUntil:'networkidle',timeout:30000});
        await stabilize(page);
        await auditLayout(page,route,name);
        if(expectInApp){
          const detected=await page.evaluate(()=>document.documentElement.classList.contains('in-app-browser'));
          if(!detected)throw new Error(`${route.name}/${name}: navegador interno não detectado`);
        }
        await page.evaluate(()=>scrollTo(0,0));
        await page.locator('#navToggle').click();
        const menu=await page.locator('#navMenu').boundingBox();
        if(!menu||menu.x < -1||menu.x+menu.width > contextOptions.viewport.width+1)throw new Error(`${route.name}/${name}: menu fora do viewport`);
      }catch(error){
        failures.push(error instanceof Error?error.message:String(error));
      }finally{
        await page.close();
      }
    }
    await context.close();
  }finally{
    await browser.close();
  }
}

await smokeBrowser(webkit,'iphone-webkit',{
  viewport:{width:390,height:844},
  userAgent:'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1',
  isMobile:true,
  hasTouch:true,
  deviceScaleFactor:3,
});

await smokeBrowser(chromium,'instagram-in-app',{
  viewport:{width:390,height:844},
  userAgent:'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Instagram 402.0.0.0.0',
  isMobile:true,
  hasTouch:true,
  deviceScaleFactor:3,
},true);

if(failures.length){
  console.error('\nVisual QA falhou:\n- '+failures.join('\n- '));
  process.exit(1);
}
console.log('\nVisual QA: 9 viewports + iPhone/WebKit + Instagram in-app aprovados.');
