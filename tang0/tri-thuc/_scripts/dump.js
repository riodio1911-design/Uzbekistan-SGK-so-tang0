// node dump.js <index.html> <out.json> name1 name2 ...  : chạy các <script> trong vm với DOM giả, xuất biến
const fs=require('fs'),vm=require('vm');
const [,,src,out,...names]=process.argv;
let s=fs.readFileSync(src,'utf8').replace(/data:[\w\/+.-]+;base64,[A-Za-z0-9+\/=]+/g,'DATA');
const scripts=[];const re=/<script(\s[^>]*)?>([\s\S]*?)<\/script>/g;let m;
while((m=re.exec(s))){ if(m[1]&&/src=|type="module"|application\/json/.test(m[1])&&!/text\/javascript/.test(m[1])) { if(/application\/json/.test(m[1]||'')) scripts.push({json:true,attr:m[1],code:m[2]}); continue;} scripts.push({code:m[2]}); }
function P(){ const f=function(){}; return new Proxy(f,{get(t,k){ if(k===Symbol.toPrimitive) return ()=>''; if(k===Symbol.iterator) return function*(){}; if(k==='length') return 0; if(k==='then') return undefined; return P();}, set(){return true}, apply(){return P()}, construct(){return P()}, has(){return true}});}
const noop=()=>{};
const store={};
const win={console:{log:noop,warn:noop,error:noop,info:noop},setTimeout:()=>0,setInterval:()=>0,clearTimeout:noop,clearInterval:noop,requestAnimationFrame:()=>0,
 document:P(),navigator:P(),location:{hash:'',search:'',href:'',pathname:'/'},localStorage:{getItem:()=>null,setItem:noop,removeItem:noop},sessionStorage:{getItem:()=>null,setItem:noop},
 addEventListener:noop,removeEventListener:noop,matchMedia:()=>({matches:false,addEventListener:noop,addListener:noop}),getComputedStyle:()=>P(),
 Audio:function(){return P()},Image:function(){return P()},AudioContext:function(){return P()},speechSynthesis:P(),SpeechSynthesisUtterance:function(){return P()},
 fetch:()=>new Promise(()=>{}),ResizeObserver:function(){return P()},IntersectionObserver:function(){return P()},MutationObserver:function(){return P()},
 claude:undefined,innerWidth:1200,innerHeight:800,devicePixelRatio:1,history:P(),CSS:P(),HTMLElement:function(){},Element:function(){},Node:function(){},
 performance:{now:()=>0},URL:URL,URLSearchParams:URLSearchParams,Blob:function(){},FileReader:function(){return P()},alert:noop,confirm:()=>false,prompt:()=>null,scrollTo:noop,open:noop,
};
win.window=win;win.self=win;win.globalThis=win;win.top=win;win.parent=win;
const ctx=vm.createContext(win);
let err=[];
scripts.forEach((sc,i)=>{ if(sc.json) return; try{ new vm.Script(sc.code,{filename:'s'+i}).runInContext(ctx,{timeout:3000}); }catch(e){ err.push(i+': '+String(e&&e.message||e).slice(0,120)); } });
const res={};
for(const n of names){ try{ res[n]=vm.runInContext('(()=>{try{return JSON.parse(JSON.stringify('+n+',(()=>{const st=[];return function(k,v){if(typeof v==="function")return undefined;if(k==="ch"&&v&&typeof v==="object"&&v.lessons)return v.no;return v}})()))}catch(e){return "ERR "+e.message}})()',ctx,{timeout:5000}); }catch(e){res[n]='ERR '+e.message;} }
res.__errors=err;
fs.writeFileSync(out,JSON.stringify(res));
console.log('scripts',scripts.length,'errors',err.length); err.slice(0,15).forEach(e=>console.log(' ',e));
for(const n of names) console.log(n, typeof res[n]==='string'?res[n].slice(0,100):(Array.isArray(res[n])?'array '+res[n].length:'obj keys '+Object.keys(res[n]||{}).length));
