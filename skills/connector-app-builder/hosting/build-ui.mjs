import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
const app=path.resolve('app'),pkg=JSON.parse(fs.readFileSync(path.join(app,'connector-package.json'),'utf8'));
if(fs.existsSync(path.join(app,'package.json'))){
 const source=JSON.parse(fs.readFileSync(path.join(app,'package.json'),'utf8')),npm=process.platform==='win32'?'npm.cmd':'npm';
 if(source.scripts?.build){
  if(!fs.existsSync(path.join(app,'node_modules'))&&(source.dependencies||source.devDependencies))execFileSync(npm,[fs.existsSync(path.join(app,'package-lock.json'))?'ci':'install','--ignore-scripts','--no-audit','--no-fund'],{cwd:app,stdio:'inherit'});
  execFileSync(npm,['run','build'],{cwd:app,stdio:'inherit'});
 }
}
pkg.manifest=JSON.parse(fs.readFileSync(path.join(app,'app-config.json'),'utf8'));
for(const name of Object.keys(pkg.files)){if(!/^[a-zA-Z0-9_.\/-]+$/.test(name)||name.split('/').some(x=>!x||x==='..'))throw new Error('Unsafe app file.');const file=path.join(app,name);if(fs.lstatSync(file).isSymbolicLink())throw new Error('App symlinks are not allowed.');pkg.files[name]=fs.readFileSync(file,'utf8');}
if(pkg.manifest.ui.kind!=='bundle')throw new Error('Export a bundled UI.');
let html=pkg.files[pkg.manifest.ui.entrypoint];
html=html.replace(/<script\b([^>]*?)\bsrc=["']([^"']+)["']([^>]*)>\s*<\/script>/gi,(_,a,name,b)=>{if(!pkg.files[name])throw new Error('Missing script '+name);return `<script ${a}${b}>${pkg.files[name].replace(/<\/script/gi,'<\\/script')}</script>`;}).replace(/<link\b[^>]*href=["']([^"']+)["'][^>]*>/gi,(_,name)=>{if(!pkg.files[name]||!name.endsWith('.css'))throw new Error('Missing style '+name);return `<style>${pkg.files[name].replace(/<\/style/gi,'<\\/style')}</style>`;});
const ui=pkg.manifest.ui,policy=`default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data: ${(ui.imageOrigins||[]).join(' ')}; media-src data: blob: ${(ui.mediaOrigins||[]).join(' ')}; font-src data:; connect-src 'none'; frame-src 'none'; form-action 'none'; base-uri 'none'`;
fs.mkdirSync('public',{recursive:true});fs.writeFileSync('public/app.html',`<!doctype html><html><head><meta http-equiv="Content-Security-Policy" content="${policy}"><meta name="referrer" content="no-referrer"></head><body>${html}</body></html>`);
console.log('Built UI. Agent, connector and data requests still use Gabriel.');
