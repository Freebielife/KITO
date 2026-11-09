/* Shared by the standalone page and the network-failure tests. No dependencies. */
(function(root){
  function validSnapshot(s, current){
    if(!s || s.schema!==1 || !Number.isFinite(s.updated) || s.updated<=0 || s.updated>Date.now()/1000+300 || s.updated<(current.updated||0)) return false;
    for(const key of ['trades','burns','holders','domains']){
      const part=s[key];
      if(!part || !Number.isFinite(part.asOf) || part.asOf<=0 || part.asOf>s.updated+300 || part.asOf<(current[key]?.asOf||0)) return false;
      if(key==='domains'){if(!part.byWallet || typeof part.byWallet!=='object') return false;}
      else if(key==='holders'){if(!Array.isArray(part.holders) || !Number.isFinite(Number(part.totalSupply)) || Number(part.totalSupply)<=0) return false;}
      else if(!Array.isArray(part.rows)) return false;
    }
    return true;
  }
  function createSnapshotLoader({getSnapshot,applySnapshot,onState,fetchImpl=globalThis.fetch,timeoutMs=20000,retryDelayMs=1500}){
    const sources=[
      {url:'https://raw.githubusercontent.com/Freebielife/KITO/main/data/snapshot.json'},
      {url:'https://api.github.com/repos/Freebielife/KITO/contents/data/snapshot.json?ref=main',headers:{Accept:'application/vnd.github.raw+json'}}
    ];
    let pending=null;
    async function request(source){
      const controller=new AbortController();
      const timeout=setTimeout(()=>controller.abort(),timeoutMs);
      try{
        const url=source.url+(source.url.includes('?')?'&':'?')+'v='+Date.now();
        const res=await fetchImpl(url,{signal:controller.signal,cache:'no-store',headers:source.headers});
        if(!res.ok) throw new Error('HTTP '+res.status);
        const next=await res.json();
        if(!validSnapshot(next,getSnapshot())) throw new Error('Invalid or older snapshot');
        return next;
      }finally{clearTimeout(timeout);}
    }
    async function run(){
      onState({phase:'loading'});
      // Retry the primary once, then use the API only as a fallback to conserve its quota.
      for(const [i,source] of [sources[0],sources[0],sources[1]].entries()){
        if(i===1) await new Promise(resolve=>setTimeout(resolve,retryDelayMs));
        try{
          const next=await request(source);
          applySnapshot(next);
          onState({phase:'success',checkedAt:Date.now()});
          return true;
        }catch{}
      }
      onState({phase:'error'});
      return false;
    }
    return function refresh(){
      if(pending) return pending;
      pending=run().finally(()=>{pending=null;});
      return pending;
    };
  }
  if(typeof module!=='undefined' && module.exports) module.exports={createSnapshotLoader,validSnapshot};
  else root.createSnapshotLoader=createSnapshotLoader;
})(globalThis);
