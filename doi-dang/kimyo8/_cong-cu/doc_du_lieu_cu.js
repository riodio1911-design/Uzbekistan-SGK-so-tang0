// Nạp dữ liệu bản cũ (PG, TP, AUDIO, RUTXT) trong node để thống kê.
const fs=require('fs'),vm=require('vm');
const html=fs.readFileSync(process.env.CU_HTML||process.argv[2],'utf8');
const sc=[...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
const ctx={window:{}};vm.createContext(ctx);vm.runInContext(sc[1],ctx);
const W=ctx.window; module.exports=W;
if(require.main===module){
 const PG=W.PG,TP=W.TP;
 for(const n of (process.argv[3]||'5,21,22,37,64').split(',')){const P=PG[n];console.log(n,'tr',P.tr.length,'ex',P.ex.length,'fig',(P.fig||[]).length,'pins',JSON.stringify(P.pin.map(p=>p.k+':'+(p.t||p.i))));}
 const kinds={};let sc2=0;for(const id in TP){for(const s of TP[id].video||[]){kinds[s.v.k]=(kinds[s.v.k]||0)+1;sc2++}}
 console.log('scenes',sc2,JSON.stringify(kinds));
 console.log('TP keys sample',Object.keys(TP).slice(0,5), 'tp has TP?', !!TP);
}
