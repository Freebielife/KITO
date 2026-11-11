const {test}=require('node:test');
const assert=require('node:assert/strict');
const {marketCapSeries}=require('../web/market-cap.js');
const row=(time,kito,ton=1)=>({time,kito:String(kito),ton:String(ton),tx:String(time),kind:'buy'});
const snapshot=rows=>({holders:{totalSupply:'1000000'},trades:{asOf:200,since:1,rows}});
test('fewer tokens per TON raises valuation; baseline uses the last earlier trade',()=>{
 const d=marketCapSeries(snapshot([row(190,50),row(90,100)]),100);
 assert.equal(d.latestCap,20000);assert.equal(d.change,100);assert.equal(d.points[0].time,100);assert.equal(d.points[0].row.time,90);assert.equal(d.partial,false);
});
test('missing supply does not fabricate a market cap',()=>{
 const s=snapshot([row(190,50)]);delete s.holders;
 assert.equal(marketCapSeries(s,100).latestCap,null);assert.deepEqual(marketCapSeries(s,100).points,[]);
});
test('same bucket retains a spike followed by a return to the initial level',()=>{
 const d=marketCapSeries(snapshot([row(110,100),row(111,10),row(112,200),row(113,100)]),100,1);
 assert.equal(d.high,100000);assert.equal(d.low,5000);assert.equal(d.points.length,4);
});
test('no recent trades carries last observed value and reports zero new trades',()=>{
 const d=marketCapSeries(snapshot([row(90,100)]),100);
 assert.equal(d.latestCap,10000);assert.equal(d.tradeCount,0);assert.equal(d.change,0);assert.equal(d.points[0].time,100);
});
test('incomplete history is marked partial and invalid/future rows are excluded',()=>{
 const d=marketCapSeries(snapshot([row(120,100),row(190,50),row(195,0),row(210,1)]),100);
 assert.equal(d.partial,true);assert.equal(d.tradeCount,2);assert.equal(d.latest.time,190);assert.equal(d.change,100);
});
test('historical estimate deliberately uses the supplied current total supply',()=>{
 const s=snapshot([row(90,100),row(190,50)]);const a=marketCapSeries(s,100);s.holders.totalSupply='500000';const b=marketCapSeries(s,100);
 assert.equal(b.latestCap,a.latestCap/2);assert.equal(b.change,a.change);
});
