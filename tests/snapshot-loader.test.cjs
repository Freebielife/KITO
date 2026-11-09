const {test}=require('node:test');
const assert=require('node:assert/strict');
const {createSnapshotLoader}=require('../web/snapshot-loader.js');
const base={schema:1,updated:1000,trades:{asOf:1000,rows:[]},burns:{asOf:1000,rows:[]},holders:{asOf:1000,holders:[],totalSupply:'100'},domains:{asOf:1000,byWallet:{}}};
function fixture(fetchImpl,options={}){
 let data=structuredClone(base),states=[];
 const refresh=createSnapshotLoader({fetchImpl,getSnapshot:()=>data,applySnapshot:s=>{data=s},onState:s=>states.push(s),retryDelayMs:0,timeoutMs:30,...options});
 return {refresh,states,get data(){return data}};
}
const ok=data=>({ok:true,json:async()=>data});
test('primary succeeds without a fallback; concurrent calls share a request',async()=>{
 let count=0;const f=fixture(async()=>{count++;return ok({...base,updated:1100})});
 const first=f.refresh();assert.equal(first,f.refresh());assert.equal(await first,true);assert.equal(count,1);assert.equal(f.data.updated,1100);assert.equal(f.states.at(-1).phase,'success');
});
test('temporary primary failure is retried',async()=>{
 let count=0;const f=fixture(async()=>{if(++count===1)throw Error('offline');return ok(base)});
 assert.equal(await f.refresh(),true);assert.equal(count,2);
});
test('two primary failures use the API raw response without credentials',async()=>{
 const calls=[];const f=fixture(async(url,options)=>{calls.push([url,options]);if(calls.length<3)return {ok:false,status:503};return ok(base)});
 assert.equal(await f.refresh(),true);assert.equal(calls.length,3);assert.match(calls[2][0],/^https:\/\/api.github.com/);assert.equal(calls[2][1].headers.Accept,'application/vnd.github.raw+json');assert.equal(calls[2][1].headers.Authorization,undefined);
});
test('network failures preserve the snapshot and allow a later recovery',async()=>{
 let offline=true;const f=fixture(async()=>{if(offline)throw Error('offline');return ok({...base,updated:1200})});
 assert.equal(await f.refresh(),false);assert.equal(f.data.updated,1000);assert.equal(f.states.at(-1).phase,'error');offline=false;assert.equal(await f.refresh(),true);assert.equal(f.data.updated,1200);
});
test('timeouts abort requests including slow response bodies',async()=>{
 let aborts=0;const f=fixture(async(url,{signal})=>({ok:true,json:()=>new Promise((resolve,reject)=>signal.addEventListener('abort',()=>{aborts++;reject(Error('timeout'))}))}),{timeoutMs:5});
 assert.equal(await f.refresh(),false);assert.equal(aborts,3);assert.equal(f.data.updated,1000);
});
test('older, incomplete and malformed data never replace a good snapshot',async()=>{
 for(const invalid of [{...base,updated:900},{...base,trades:{asOf:900,rows:[]}},{schema:1,updated:1200},{...base,updated:Date.now()/1000+3600},{...base,holders:{asOf:1000,holders:[],totalSupply:'bad'}}]){
  const f=fixture(async()=>ok(invalid));assert.equal(await f.refresh(),false);assert.deepEqual(f.data,base);
 }
});
test('older primary responses still try the fresher fallback',async()=>{
 let count=0;const f=fixture(async()=>ok(++count<3?{...base,updated:900}:{...base,updated:1100}));assert.equal(await f.refresh(),true);assert.equal(count,3);assert.equal(f.data.updated,1100);
});
