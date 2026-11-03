"use strict";
const MASTER="EQCSLLVQ8qdhEqZUKaiKU7F6sVfnNPmQ4FsCpCo8olo795LP";
const texts={
ru:{intro:"Ончейн-аналитика токена KITO в сети TON",swap:"Обменять ↗",price:"Цена сделки",summary:"KITO за 24 часа",activity:"Последние операции",wallets:"Кошельки",domain:"Свой .socool.ton",domainText:"Этот сайт живёт на freebie.socool.ton. Выбери свой субдомен в Resistance Tools.",domainLink:"Открыть Resistance Tools ↗",project:"Сайт проекта ↗",method:"Источники и методика",methodText:"График строится по успешным сделкам пула KITO / TON на DeDust. Цена — количество TON за один KITO. Линия соединяет последние сделки каждого интервала. Сжигания подтверждаются контрактом KITO. Доля держателя считается от общего предложения. Сумма продаж — все проданные кошельком KITO за период. Данные обновляются раз в два часа.",buy:"Покупка",sell:"Продажа",burn:"Сжигание",holders:"Холдеры",sellers:"Продавцы",more:"Ещё 30",less:"Свернуть",copy:"Копировать адрес",copied:"Скопировано",no:"Нет данных",noTrades:"За этот период в проверенной истории нет сделок.",partial:"Частичная история",since:"История с",updated:"Данные на",h:"ч",d:"д",quarter:"Покупки / продажи",volume:"Объём покупок / продаж",users:"Покупатели / продавцы",burned:"Сожжено KITO",none:"За период записей нет",sold:"Продано KITO",balance:"Баланс KITO",periods:["1ч","1д","1н","1м","6м","1г"],total:"Адресов",all:"Показать все",delayed:"Обновление задерживается",chart:"История цены",tx:"Транзакция",deals:"сделок",burnCount:"Сжигания",tradeSource:"Сделки",stale:"Последний сбор неполный",buySell:"куплено / продано"},
en:{intro:"On-chain analytics for KITO on TON",swap:"Swap ↗",price:"Trade price",summary:"KITO in 24 hours",activity:"Latest activity",wallets:"Wallets",domain:"Your .socool.ton",domainText:"This site lives at freebie.socool.ton. Explore subdomains in Resistance Tools.",domainLink:"Open Resistance Tools ↗",project:"Project website ↗",method:"Sources and methodology",methodText:"Prices use successful trades in the KITO / TON DeDust pool. Price is TON per KITO. The line connects the last trade in each interval. Burns are confirmed by the KITO contract. Holder shares use total token supply. Seller rankings sum the amount of KITO sold per wallet over the selected window. Data refreshes every two hours.",buy:"Buy",sell:"Sell",burn:"Burn",holders:"Holders",sellers:"Sellers",more:"30 more",less:"Collapse",copy:"Copy address",copied:"Copied",no:"No data",noTrades:"No trades in the verified history for this period.",partial:"Partial history",since:"History from",updated:"Data as of",h:"h",d:"d",quarter:"Buys / sells",volume:"Buy / sell volume",users:"Buyers / sellers",burned:"KITO burned",none:"No records for this period",sold:"KITO sold",balance:"KITO balance",periods:["1H","1D","1W","1M","6M","1Y"],total:"Addresses",all:"Show all",delayed:"Update overdue",chart:"Price history",tx:"Transaction",deals:"trades",burnCount:"Burns",tradeSource:"Trades",stale:"Last collection incomplete",buySell:"bought / sold"}};
Object.assign(texts.ru, {
  projectDirectory:"Все ресурсы KITO ↗", navMarket:"Рынок", links:"Ссылки", toMarket:"К графику ↓", up:"Наверх ↑", swap:"Обмен на DeDust ↗",
  price:"Последняя цена за 1 KITO", intro:"Цена, сделки и держатели KITO в сети TON.",
  chartKey:"Цена сделки", burnKey:"🔥 Сжигание", pointHint:"Коснись графика или выбери точку стрелками ← →.",
  activity:"Операции", activityHint:"Покупки и продажи из пула DeDust и сжигания токена.",
  wallets:"Рейтинги", holders:"Держатели", sellers:"Продавцы", filterAll:"Все", buys:"Покупки", sells:"Продажи",
  people:"Кошельки", buyers:"покупатели", sellersLabel:"продавцы", volumeUnit:"Объём", burnLabel:"Сжигания",
  burnedTotal:"Сожжено", events:"Операций", openTx:"На gram.org ↗", allHolders:"Всего адресов",
  holderHint:"Крупнейшие остатки KITO и доля от общего предложения.", sellerHint:"Кошельки по сумме проданных KITO за выбранный период.",
  projectResources:"Сообщество и рынок",projectHint:"Каналы проекта, обмен и график пары.",
  contractLabel:"Контракт KITO",domainText:"Открой коллекцию субдоменов socool.ton в Resistance Tools.",
  feedTime:"Сделки", periodNames:["1 час","День","Неделя","Месяц","6 мес.","Год"], dayLabels:["24 часа","7 дней","30 дней"]
});
Object.assign(texts.en, {
  projectDirectory:"KITO link directory ↗", navMarket:"Market", links:"Links", toMarket:"View chart ↓", up:"Back to top ↑", swap:"Swap on DeDust ↗",
  price:"Last price per KITO", intro:"Price, trades and KITO holders on TON.",
  chartKey:"Trade price", burnKey:"🔥 Burn", pointHint:"Tap the chart or use the ← → arrow keys to inspect a trade.",
  activity:"Activity", activityHint:"Buys and sells from the DeDust pool and confirmed token burns.",
  wallets:"Rankings", holders:"Holders", sellers:"Sellers", filterAll:"All", buys:"Buys", sells:"Sells",
  people:"Wallets", buyers:"buyers", sellersLabel:"sellers", volumeUnit:"Volume", burnLabel:"Burns",
  burnedTotal:"Burned", events:"Transactions", openTx:"View on gram.org ↗", allHolders:"Total addresses",
  holderHint:"Largest KITO balances and their share of the total supply.", sellerHint:"Wallets ranked by total KITO sold during the selected period.",
  projectResources:"Community and market",projectHint:"Project channels, token swap and pool chart.",
  contractLabel:"KITO contract",domainText:"Explore names like name.socool.ton in Resistance Tools.",
  feedTime:"Trades", periodNames:["1 hour","Day","Week","Month","6 mo.","Year"], dayLabels:["24 hours","7 days","30 days"]
});
let feedKind="all";
const $=id=>document.getElementById(id);
let snapshot=JSON.parse($("snapshot").textContent), lang="ru", period=1, ranking="holders", sellerDays=1, expanded=false;
try{lang=localStorage.getItem("kito-lang")==="en"?"en":"ru"}catch{}
const t=key=>texts[lang][key], day=86400, ranges=[3600,day,7*day,30*day,182*day,365*day];
function el(tag,txt,cls){const e=document.createElement(tag);if(txt!==undefined)e.textContent=txt;if(cls)e.className=cls;return e}
function link(href,txt){const a=el("a",txt);a.href=href;a.target="_blank";a.rel="noopener noreferrer";return a}
function format(n,d=2){return Number(n).toLocaleString(lang,{maximumFractionDigits:d})}
function stamp(s){return s?new Date(s*1000).toLocaleString(lang,{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit",year:"numeric"}):"—"}
function short(w){return w?w.slice(0,6)+"…"+w.slice(-5):"—"}
// Use a user-friendly TON address for explorer links and the visible short label.
function explorerAddress(raw) {
  if (!/^(-1|0):[0-9a-f]{64}$/i.test(raw)) return raw;
  const [chain, hex] = raw.split(":");
  const bytes = [0x51, Number(chain) & 255, ...hex.match(/../g).map(byte => parseInt(byte,16))];
  let crc = 0;
  for (const byte of bytes) {
    crc ^= byte << 8;
    for (let bit=0; bit<8; bit++) crc = ((crc << 1) ^ ((crc & 0x8000) ? 0x1021 : 0)) & 65535;
  }
  return btoa(String.fromCharCode(...bytes, crc >> 8, crc & 255)).replaceAll("+","-").replaceAll("/","_");
}
function addr(raw,name) {
  const wallet=explorerAddress(raw);
  const a=link("https://gram.org/address/"+encodeURIComponent(wallet),name||short(wallet));
  a.title=wallet+" · gram.org";
  return a;
}
function tx(row){const a=link("https://gram.org/tx/"+row.tx,t("openTx"));a.title=row.tx;return a}
function select(id,labels,selected,onClick){const node=$(id);node.replaceChildren();labels.forEach((name,i)=>{const b=el("button",name);b.classList.toggle("on",i===selected);b.setAttribute("aria-pressed",i===selected);b.onclick=()=>onClick(i);node.append(b)})}
function freshness(s){if(!s?.asOf)return t("no");return t("updated")+" "+stamp(s.asOf)+(Date.now()/1000-s.asOf>4*3600?" · "+t("delayed"):"")}
function coverage(section,cut){return section&&section.since>cut?t("partial")+" · "+t("since")+" "+stamp(section.since):""}
function bucketPrice(r){return Number(r.ton)/Number(r.kito)}
function svg(tag,attrs){const n=document.createElementNS("http://www.w3.org/2000/svg",tag);for(const [k,v] of Object.entries(attrs))n.setAttribute(k,v);return n}
function chart(){
 const section=snapshot.trades, rows=section?.rows||[], end=section?.asOf||snapshot.updated||Date.now()/1000, start=end-ranges[period];
 $("lastPrice").textContent=rows.length?format(bucketPrice(rows[0]),10)+" TON":"—";
 const plot=$("plot");plot.replaceChildren();const box=svg("svg",{viewBox:"0 0 900 185",preserveAspectRatio:"none",role:"group","aria-label":t("chart")});
 const width=Math.max(240,plot.clientWidth||800);box.setAttribute("viewBox","0 0 "+width+" 185");const w=width-14;
 const series=new Map();
 for(const r of [...rows].reverse())if(r.time>=start&&r.time<=end)series.set(Math.floor((r.time-start)/ranges[period]*180),r);
 const prices=[...series.values()], vals=prices.map(bucketPrice);
 const burns=(snapshot.burns?.rows||[]).filter(r=>r.time>=start&&r.time<=end);
 const left=7, right=w-69, x=time=>left+(time-start)/ranges[period]*(right-left);
 const info=$("readout");
 info.textContent=prices.length?t("pointHint"):"";
 if(vals.length){
   const low=Math.min(...vals), high=Math.max(...vals);
   const pad=(high-low)*.10 || Math.max(low*.015,1e-12), min=low-pad, max=high+pad;
   const y=val=>138-(val-min)/(max-min)*114;
   for(const p of [max,(max+min)/2,min]){
     const height=y(p);
     box.append(svg("path",{d:"M"+left+" "+height+"H"+right,stroke:"#dce4da","stroke-dasharray":"3 5"}));
     const label=svg("text",{x:right+5,y:height+4});
     label.textContent=format(p,8);box.append(label);
   }
   const pts=prices.map(r=>[x(r.time),y(bucketPrice(r))]);
   if(pts.length>1){
     box.append(svg("polygon",{points:[...pts,[pts.at(-1)[0],141],[pts[0][0],141]].join(" "),fill:"#daf0df"}));
     box.append(svg("polyline",{points:pts.join(" "),fill:"none",stroke:"#207457","stroke-width":2.5,"stroke-linejoin":"round"}));
   }
   const last=pts.at(-1);
   box.append(svg("circle",{cx:last[0],cy:last[1],r:4,fill:"#216d52",stroke:"#fff","stroke-width":1.5}));
   const cursor=svg("circle",{r:5,fill:"#294d3a",stroke:"#d7fa88","stroke-width":3,visibility:"hidden"});
   box.append(cursor);
   let active=pts.length-1;
   function inspect(i){
     active=i;cursor.setAttribute("cx",pts[i][0]);cursor.setAttribute("cy",pts[i][1]);cursor.setAttribute("visibility","visible");
     const r=prices[i];info.replaceChildren(document.createTextNode(stamp(r.time)+" · "+format(bucketPrice(r),10)+" TON · "),tx(r));
   }
   box.setAttribute("tabindex","0");
   box.addEventListener("pointerdown",e=>{
     if(e.target.closest(".marker"))return;
     const at=(e.clientX-box.getBoundingClientRect().left)*width/box.getBoundingClientRect().width;
     inspect(pts.reduce((best,p,i)=>Math.abs(p[0]-at)<Math.abs(pts[best][0]-at)?i:best,0));
   });
   box.addEventListener("keydown",e=>{
     if(e.target!==box||!["ArrowLeft","ArrowRight"].includes(e.key))return;
     e.preventDefault();inspect(Math.max(0,Math.min(active+(e.key==="ArrowLeft"?-1:1),pts.length-1)));
   });
 }else{const label=svg("text",{x:8,y:80});label.textContent=t("noTrades");box.append(label)}
 for(const r of burns){
   const g=svg("a",{href:"https://gram.org/tx/"+r.tx,class:"marker","aria-label":t("burn")+" "+format(r.kito)+" KITO"});
   const cx=Math.max(12,Math.min(right,x(r.time)));
   g.append(svg("rect",{x:cx-11,y:139,width:25,height:25,rx:6,fill:"#ffedd9"}));
   const icon=svg("text",{x:cx-7,y:157,style:"font-size:15px"});icon.textContent="🔥";g.append(icon);
   const show=()=>info.replaceChildren(document.createTextNode(stamp(r.time)+" · "+t("burn")+" "+format(r.kito)+" KITO · "),tx(r));
   g.addEventListener("click",e=>{e.preventDefault();show()});g.addEventListener("focus",show);box.append(g);
 }
 for(const [pos,time,anchor] of [[left,start,"start"],[width-3,end,"end"]]){
   const label=svg("text",{x:pos,y:181,"text-anchor":anchor});label.textContent=stamp(time);box.append(label)
 }
 plot.append(box);
 $("chartInfo").textContent=[freshness(section),coverage(section,start)].filter(Boolean).join(" · ");
}
function stats(){
 const trades=snapshot.trades,burns=snapshot.burns;
 const within=s=>(s?.rows||[]).filter(r=>r.time>s.asOf-day&&r.time<=s.asOf);
 const rows=within(trades), buys=rows.filter(r=>r.kind==="buy"), sells=rows.filter(r=>r.kind==="sell");
 const sum=(items,key)=>items.reduce((v,r)=>v+Number(r[key]),0);
 const count=s=>new Set(s.map(r=>r.wallet)).size;
 const values=[
   [t("buys"),buys.length,t("volumeUnit")+" · "+format(sum(buys,"ton"))+" TON",trades,"buy"],
   [t("sells"),sells.length,t("volumeUnit")+" · "+format(sum(sells,"ton"))+" TON",trades,"sell"],
   [t("people"),count(buys)+" / "+count(sells),t("buyers")+" / "+t("sellersLabel"),trades,""],
   [t("burnedTotal")+" KITO",format(sum(within(burns),"kito")),t("events")+" · "+within(burns).length,burns,"burn"]];
 $("stats").replaceChildren(...values.map(([label,value,detail,source,cls])=>{
   const complete=source&&source.since<=source.asOf-day, item=el("div",undefined,"stat");
   item.append(el("span",label,cls),el("b",complete?value:"—"),el("small",complete?detail:source?t("partial"):t("no")));return item;
 }));
}
function row(first,sub,value,last){const a=el("div"),b=el("div"),d=el("div",undefined,"row");a.append(first,sub);b.append(value,last);d.append(a,b);return d}
function list(){
 const kinds=["all","buy","sell","burn"];
 select("filters",[t("filterAll"),t("buys"),t("sells"),t("burnCount")],kinds.indexOf(feedKind),i=>{feedKind=kinds[i];expanded=false;list()});
 const combined=[...(snapshot.trades?.rows||[]),...(snapshot.burns?.rows||[])]
   .filter(r=>feedKind==="all"||r.kind===feedKind).sort((a,b)=>b.time-a.time||a.tx.localeCompare(b.tx)).slice(0,50);
 const clock=feedKind==="burn"?snapshot.burns:snapshot.trades;
 $("feedNote").textContent=(feedKind==="all"?t("feedTime")+" · ":"")+freshness(clock);
 $("feed").replaceChildren(...combined.slice(0,expanded?50:20).map(r=>{
   const who=el("small");who.append(addr(r.wallet,r.name));
   const top=el("b");top.append(el("span",t(r.kind),"badge "+r.kind),document.createTextNode(format(r.kito,4)+" KITO"));
   const details=el("small");details.append(tx(r));
   const right=el("small");if(r.ton)right.append(el("b",format(r.ton,4)+" TON"));
   right.append(document.createTextNode(stamp(r.time)));return row(top,who,right,details)
 }));
 if(!combined.length)$("feed").append(el("p",t("none"),"empty"));
 $("more").hidden=combined.length<=20;$("more").textContent=expanded?t("less"):t("more").replace("30",String(Math.min(30,combined.length-20)));
}
function ranks(){
 const isHolder=ranking==="holders",source=isHolder?snapshot.holders:snapshot.trades;
 $("rankDescription").textContent=t(isHolder?"holderHint":"sellerHint");
 select("views",[t("holders"),t("sellers")],isHolder?0:1,i=>{ranking=i?"sellers":"holders";ranks()});
 $("sellerPeriods").replaceChildren();if(!isHolder)select("sellerPeriods",t("dayLabels"),[1,7,30].indexOf(sellerDays),i=>{sellerDays=[1,7,30][i];ranks()});
 let data;if(isHolder){data=source?.holders||[];$("rankNote").textContent=freshness(source)+(source?" · "+t("allHolders")+" "+format(source.holderCount,0):"")}
 else{const groups=new Map(),cut=(source?.asOf||0)-sellerDays*day;for(const r of source?.rows||[]){if(r.kind!=="sell"||r.time<=cut||r.time>source.asOf)continue;const g=groups.get(r.wallet)||{...r,kito:0,count:0};g.kito+=Number(r.kito);g.count++;groups.set(r.wallet,g)}data=[...groups.values()].sort((a,b)=>b.kito-a.kito).slice(0,20);$("rankNote").textContent=[freshness(source),coverage(source,cut)].filter(Boolean).join(" · ")}
 $("rank").replaceChildren(...data.map((r,i)=>{const title=el("b");title.append(el("span",String(i+1).padStart(2,"0"),"position"),addr(r.wallet,r.name));return row(title,el("small",isHolder?t("balance"):t("sold")),el("b",format(r.kito)+" KITO"),el("small",isHolder?format(r.share,4)+"%":(lang==="ru"?"Сделок: ":"Trades: ")+format(r.count,0)))}));if(!data.length)$("rank").append(el("p",source?t("none"):t("no"),"empty"))
}
function render(){document.documentElement.lang=lang;document.querySelectorAll("[data-t]").forEach(n=>n.textContent=t(n.dataset.t));for(const l of ["ru","en"]){$(l).classList.toggle("on",l===lang);$(l).setAttribute("aria-pressed",l===lang);$(l).onclick=()=>{lang=l;try{localStorage.setItem("kito-lang",l)}catch{}render()}}
 select("periods",t("periodNames"),period,i=>{period=i;render()});$("copy").textContent=t("copy");$("contract").href="https://gram.org/jetton/"+MASTER;$("contract").textContent=MASTER;chart();stats();list();ranks()}
$("copy").onclick=async()=>{try{await navigator.clipboard.writeText(MASTER);$("copy").textContent=t("copied")}catch{window.prompt(t("copy"),MASTER)}};
$("more").onclick=()=>{expanded=!expanded;list()};window.addEventListener("resize",chart);render();
const sources=["https://raw.githubusercontent.com/Freebielife/KITO/main/data/snapshot.json","https://freebielife.github.io/KITO/data/snapshot.json"];
async function refresh(){for(const url of sources){try{const res=await fetch(url+"?v="+Math.floor(Date.now()/600000),{signal:AbortSignal.timeout(7000)});if(!res.ok)continue;const s=await res.json();if(s.schema!==1||!Number.isFinite(s.updated))continue;if(s.updated>=(snapshot.updated||0)){snapshot=s;render();return}}catch{}}}
refresh();setInterval(refresh,600000);window.addEventListener("online",refresh);document.addEventListener("visibilitychange",()=>{if(!document.hidden)refresh()});

const jumps=Array.from(document.querySelectorAll("#nav a"));
function activeSection(){
 const y=window.scrollY+Math.min(window.innerHeight*.35,220);
 const narrow=window.matchMedia("(max-width:800px)").matches;
 const hash=window.location.hash;
 let target=jumps[0];
 for(const jump of jumps){
   const section=document.querySelector(jump.hash);
   if(section.offsetTop>y)continue;
   if(!narrow&&jump.hash==="#wallets"&&hash!=="#wallets")continue;
   target=jump;
 }
 for(const jump of jumps){
   jump.classList.toggle("on",jump===target);
   if(jump===target)jump.setAttribute("aria-current","location");else jump.removeAttribute("aria-current");
 }
}
window.addEventListener("scroll",activeSection,{passive:true});
window.addEventListener("hashchange",activeSection);
activeSection();
