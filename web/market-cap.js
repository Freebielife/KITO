/* Estimated valuation in the pool's native currency, with no external chart library. */
(function(root){
  function marketCapSeries(snapshot, duration, buckets=60){
    const supply=Number(snapshot.holders?.totalSupply), end=Number(snapshot.trades?.asOf), start=end-duration;
    const validSupply=Number.isFinite(supply)&&supply>0;
    const rows=(snapshot.trades?.rows||[]).filter(r=>Number.isFinite(r.time)&&r.time<=end&&
      Number.isFinite(Number(r.kito))&&Number(r.kito)>0&&Number.isFinite(Number(r.ton))&&Number(r.ton)>0)
      .slice().sort((a,b)=>a.time-b.time||a.tx.localeCompare(b.tx));
    const value=r=>Number(r.ton)/Number(r.kito)*supply;
    const latest=rows.at(-1);
    const result={supply,end,start,latest,latestCap:validSupply&&latest?value(latest):null,points:[],change:null,partial:true,tradeCount:0};
    if(!validSupply||!Number.isFinite(end)||!Number.isFinite(duration)||duration<=0) return result;
    const before=rows.filter(r=>r.time<=start).at(-1);
    const within=rows.filter(r=>r.time>=start);
    const points=within.map(row=>({time:row.time,cap:value(row),row}));
    result.tradeCount=within.length;
    if(before&&before.time<start) points.unshift({time:start,cap:value(before),row:before});
    if(!points.length)return result;
    result.partial=!before || snapshot.trades.since>start;
    result.low=Math.min(...points.map(p=>p.cap)); result.high=Math.max(...points.map(p=>p.cap));
    const first=points[0], last=points.at(-1);
    if(points.length>1||(!result.partial&&before)) result.change=(last.cap/first.cap-1)*100;
    // Keep each interval's first, last, low and high so a large trade cannot disappear.
    const groups=new Map();
    for(const p of points){
      const key=Math.floor((p.time-start)/duration*buckets);
      if(!groups.has(key))groups.set(key,[]);
      groups.get(key).push(p);
    }
    for(const group of groups.values()){
      const picked=new Set([group[0],group.at(-1),group.reduce((a,b)=>a.cap<b.cap?a:b),group.reduce((a,b)=>a.cap>b.cap?a:b)]);
      result.points.push(...group.filter(p=>picked.has(p)));
    }
    return result;
  }
  if(typeof module!=='undefined'&&module.exports)module.exports={marketCapSeries};
  else root.marketCapSeries=marketCapSeries;
})(globalThis);
