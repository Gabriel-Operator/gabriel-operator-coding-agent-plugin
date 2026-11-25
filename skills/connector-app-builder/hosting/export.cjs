const fs=require('node:fs'),path=require('node:path');
const {createHash}=require('node:crypto');
const templateFiles=['runtime.mjs','server.mjs','worker.mjs','build-ui.mjs'];
const publicFiles=['index.html','host.js','host.css','gabriel-host-runtime.js','gabriel-host-runtime.css'];
function createExport(pkg,config){
 const base=new URL(config.backendUrl);
 if(base.username||base.password||base.search||base.hash||base.pathname!=='/'||base.protocol!=='https:'&&!['localhost','127.0.0.1'].includes(base.hostname))throw new Error('Choose a Gabriel HTTPS backend origin.');
 if(!/^[a-zA-Z0-9_-]{1,160}$/.test(config.installationId)||!Number.isSafeInteger(config.appRevision)||config.appRevision<1)throw new Error('Choose an installed app and revision.');
 if(pkg.manifest.ui.kind!=='bundle')throw new Error('Only bundled app interfaces can be exported.');
 const out={};
 for(const name of templateFiles)out[name]=fs.readFileSync(path.join(__dirname,name),'utf8');
 for(const name of publicFiles)out['public/'+name]=fs.readFileSync(path.join(__dirname,name),'utf8');
 for(const [name,content] of Object.entries(pkg.files)){if(!/^[a-zA-Z0-9_.\/-]+$/.test(name)||name.split('/').some(x=>!x||x==='..'))throw new Error('Unsafe package file.');out['app/'+name]=content;}
 out['app/app-config.json']=JSON.stringify(pkg.manifest,null,2);out['app/connector-package.json']=JSON.stringify({manifest:pkg.manifest,files:pkg.files,fixtures:pkg.fixtures||{}},null,2);
 out['gabriel-host.json']=JSON.stringify({installationId:config.installationId,appRevision:config.appRevision,backendUrl:base.origin},null,2);
 const escape=value=>String(value).replace(/[<>&"']/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&apos;'}[c]));
 const icon=pkg.manifest.icon;
 if(icon?.paths?.length)out['public/app-icon.svg']=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${escape(icon.viewBox||'0 0 24 24')}" fill="${icon.style==='solid'?'currentColor':'none'}" stroke="currentColor" stroke-width="1.5" color="${escape(icon.color||'#344837')}">${icon.paths.map(d=>`<path d="${escape(d)}"/>`).join('')}</svg>`;
 out['public/manifest.webmanifest']=JSON.stringify({name:pkg.manifest.name,short_name:(pkg.manifest.name||'Studio app').slice(0,24),start_url:'/',scope:'/',display:'standalone',background_color:'#f8faf2',theme_color:'#f8faf2',...(icon?.paths?.length?{icons:[{src:'/app-icon.svg',sizes:'any',type:'image/svg+xml',purpose:'any'}]}:{})},null,2);
 out['package.json']=JSON.stringify({name:'gabriel-studio-ui',private:true,type:'module',engines:{node:'>=22'},scripts:{build:'node build-ui.mjs',start:'node server.mjs',dev:'NODE_ENV=development node server.mjs'}},null,2);
 out['api/app/[operation].mjs']="import config from '../../gabriel-host.json' with {type:'json'};\nimport {createAppBridge} from '../../runtime.mjs';\nexport default createAppBridge(config);\n";
 out['api/health.mjs']="import config from '../gabriel-host.json' with {type:'json'};\nimport {createAppBridge} from '../runtime.mjs';\nexport default createAppBridge(config);\n";
 out['vercel.json']=JSON.stringify({buildCommand:'npm run build',outputDirectory:'public',functions:{'api/**/*.mjs':{includeFiles:'gabriel-host.json',maxDuration:180}}},null,2);
 out['railway.json']=JSON.stringify({$schema:'https://railway.com/railway.schema.json',build:{builder:'DOCKERFILE'},deploy:{startCommand:'node server.mjs',healthcheckPath:'/api/health',restartPolicyType:'ON_FAILURE',restartPolicyMaxRetries:3}},null,2);
 const workerId=createHash('sha256').update(config.installationId).digest('hex').slice(0,16);
 out['wrangler.jsonc']=JSON.stringify({
  name:`gabriel-studio-${workerId}`,
  main:'./worker.mjs',
  compatibility_date:'2025-04-01',
  workers_dev:true,
  build:{command:'npm run build'},
  assets:{directory:'./public',binding:'ASSETS',run_worker_first:['/api/*']},
 },null,2);
 out['Dockerfile']='FROM node:22-alpine\nWORKDIR /app\nCOPY . .\nRUN npm run build\nENV NODE_ENV=production\nEXPOSE 8080\nCMD ["node","server.mjs"]\n';
 out['.dockerignore']='.git\nnode_modules\n.env*\n.dev.vars*\n.wrangler\napp/node_modules\n';out['.gitignore']='node_modules/\n.env*\n.dev.vars*\n.wrangler/\n.vercel/\napp/node_modules/\n';
 out['README.md']=fs.readFileSync(path.join(__dirname,'README.md'),'utf8');
 return out;
}
function sourceFiles(directory){
 const result={};
 function walk(sub){for(const e of fs.readdirSync(path.join(directory,sub),{withFileTypes:true})){
  const rel=path.posix.join(sub,e.name);if(e.isSymbolicLink())throw new Error('Source export does not follow symlinks.');
  if(e.name.startsWith('.')||['node_modules','dist','coverage'].includes(e.name)||/(?:secret|credential|token|password)/i.test(e.name))continue;
  if(e.isDirectory()){if(sub||e.name==='src'||e.name==='fixtures')walk(rel);}
  else if(/\.(?:js|jsx|ts|tsx|css|html|svg|json|md|txt)$/.test(e.name)&&e.name!=='connector-package.json'&&(sub||!e.name.endsWith('.json')||['package.json','package-lock.json','app-config.json'].includes(e.name)))result['app/'+rel]=fs.readFileSync(path.join(directory,rel),'utf8');
 }}walk('');return result;
}
module.exports={createExport,sourceFiles};
