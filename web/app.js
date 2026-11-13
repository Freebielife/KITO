"use strict";
const MASTER="EQCSLLVQ8qdhEqZUKaiKU7F6sVfnNPmQ4FsCpCo8olo795LP";
const texts = {
  "ru": {
    "intro": "Цена, сделки и держатели KITO в сети TON.",
    "swap": "Обмен на DeDust",
    "price": "Капитализация KITO",
    "summary": "KITO за 24 часа",
    "activity": "Операции",
    "wallets": "Рейтинги",
    "domain": "Свой .socool.ton",
    "domainText": "Получить свой субдомен из коллекции socool.ton в @KitoSoCoolBot",
    "domainLink": "Получить свой субдомен",
    "buy": "Покупка",
    "sell": "Продажа",
    "burn": "Сжигание",
    "holders": "Держатели",
    "sellers": "Продавцы",
    "more": "Ещё 30",
    "less": "Свернуть",
    "copy": "Копировать адрес",
    "copied": "Скопировано",
    "no": "Нет данных",
    "noTrades": "За этот период в проверенной истории нет сделок.",
    "partial": "Частичная история",
    "since": "История с",
    "updated": "Данные на",
    "none": "За период записей нет",
    "sold": "Продано KITO",
    "balance": "Баланс KITO",
    "all": "Показать все",
    "delayed": "Обновление задерживается",
    "chart": "Оценка капитализации в TON",
    "burnCount": "Сжигания",
    "projectDirectory": "Все ресурсы KITO",
    "navMarket": "Рынок",
    "links": "Полезные ссылки",
    "exploreContract": "Контракт на gram.org",
    "toMarket": "К графику ↓",
    "up": "Наверх ↑",
    "chartKey": "Оценка · TON",
    "capMethod": "Цена сделки × текущее общее предложение KITO. История оценочная; заблокированные токены не исключены.",
    "capPartial": "Изменение по доступной истории",
    "capNoTrades": "Новых сделок за период нет · последний известный уровень",
    "capLow": "Минимум", "capHigh": "Максимум",
    "burnKey": "🔥 Сжигание",
    "pointHint": "Коснись графика или выбери точку стрелками ← →.",
    "activityHint": "Покупки и продажи из пула DeDust и сжигания токена.",
    "filterAll": "Все",
    "buys": "Покупки",
    "sells": "Продажи",
    "people": "Кошельки",
    "buyers": "покупатели",
    "sellersLabel": "продавцы",
    "volumeUnit": "Объём",
    "burnedTotal": "Сожжено",
    "events": "Операций",
    "openTx": "На gram.org",
    "allHolders": "Всего адресов",
    "holderHint": "Крупнейшие остатки KITO и доля от общего предложения.",
    "sellerHint": "Кошельки по сумме проданных KITO за выбранный период.",
    "projectResources": "Сообщество и рынок",
    "contractLabel": "Контракт KITO",
    "feedTime": "Сделки",
    "periodNames": [
      "1 час",
      "24 часа",
      "Неделя",
      "Месяц",
      "6 мес.",
      "Год"
    ],
    "dayLabels": [
      "24 часа",
      "7 дней",
      "30 дней"
    ],
    "withBadges": "Только адреса с доменной меткой",
    "noneTagged": "Среди проверенных адресов для этого фильтра записей нет."
  },
  "en": {
    "intro": "Price, trades and KITO holders on TON.",
    "swap": "Swap on DeDust",
    "price": "KITO market cap",
    "summary": "KITO in 24 hours",
    "activity": "Activity",
    "wallets": "Rankings",
    "domain": "Your .socool.ton",
    "domainText": "Get your subdomain from the socool.ton collection in @KitoSoCoolBot.",
    "domainLink": "Get your subdomain",
    "buy": "Buy",
    "sell": "Sell",
    "burn": "Burn",
    "holders": "Holders",
    "sellers": "Sellers",
    "more": "30 more",
    "less": "Collapse",
    "copy": "Copy address",
    "copied": "Copied",
    "no": "No data",
    "noTrades": "No trades in the verified history for this period.",
    "partial": "Partial history",
    "since": "History from",
    "updated": "Data as of",
    "none": "No records for this period",
    "sold": "KITO sold",
    "balance": "KITO balance",
    "all": "Show all",
    "delayed": "Update overdue",
    "chart": "Estimated market cap in TON",
    "burnCount": "Burns",
    "projectDirectory": "KITO link directory",
    "navMarket": "Market",
    "links": "Useful links",
    "exploreContract": "Contract on gram.org",
    "toMarket": "View chart ↓",
    "up": "Back to top ↑",
    "chartKey": "Estimate · TON",
    "capMethod": "Trade price × current total KITO supply. Historical values are estimates; locked tokens are included.",
    "capPartial": "Change over available history",
    "capNoTrades": "No new trades in this period · last known level",
    "capLow": "Low", "capHigh": "High",
    "burnKey": "🔥 Burn",
    "pointHint": "Tap the chart or use the ← → arrow keys to inspect a trade.",
    "activityHint": "Buys and sells from the DeDust pool and confirmed token burns.",
    "filterAll": "All",
    "buys": "Buys",
    "sells": "Sells",
    "people": "Wallets",
    "buyers": "buyers",
    "sellersLabel": "sellers",
    "volumeUnit": "Volume",
    "burnedTotal": "Burned",
    "events": "Transactions",
    "openTx": "View on gram.org",
    "allHolders": "Total addresses",
    "holderHint": "Largest KITO balances and their share of the total supply.",
    "sellerHint": "Wallets ranked by total KITO sold during the selected period.",
    "projectResources": "Community and market",
    "contractLabel": "KITO contract",
    "feedTime": "Trades",
    "periodNames": [
      "1 hour",
      "24 hours",
      "Week",
      "Month",
      "6 mo.",
      "Year"
    ],
    "dayLabels": [
      "24 hours",
      "7 days",
      "30 days"
    ],
    "withBadges": "Only wallets with a domain badge",
    "noneTagged": "No records from verified domain holders match this filter."
  }
};
let feedKind="all";
const $=id=>document.getElementById(id);
let snapshot=JSON.parse($("snapshot").textContent), lang="ru", period=1, ranking="holders", sellerDays=1, expanded=false;
let syncState={phase:"idle",checkedAt:0};
try{lang=localStorage.getItem("kito-lang")==="en"?"en":"ru"}catch{}
const t=key=>texts[lang][key], day=86400, ranges=[3600,day,7*day,30*day,182*day,365*day];
function el(tag,txt,cls){const e=document.createElement(tag);if(txt!==undefined)e.textContent=txt;if(cls)e.className=cls;return e}
function link(href,txt){const a=el("a",txt);a.href=href;a.target="_blank";a.rel="noopener noreferrer";return a}
function format(n,d=2){return Number(n).toLocaleString(lang,{maximumFractionDigits:d})}
function stamp(s){return s?new Date(s*1000).toLocaleString(lang,{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit",year:"numeric"}):"—"}
function short(w){return w?w.slice(0,6)+"…"+w.slice(-5):"—"}
// Use a user-friendly TON address for explorer links and the visible short label.
function explorerAddress(raw,bounceable=false) {
  if (!/^(-1|0):[0-9a-f]{64}$/i.test(raw)) return raw;
  const [chain, hex] = raw.split(":");
  const bytes = [bounceable?0x11:0x51, Number(chain) & 255, ...hex.match(/../g).map(byte => parseInt(byte,16))];
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
const walletLabels = {
  ru:{buy:"Покупатель",sell:"Продавец",burn:"Сжигание",activeBuy:"Посл. покупка",activeSell:"Посл. продажа",
      digits:"4 цифры",sub:"Субдомен",checked:"Проверено владение",moreNames:"Ещё домены",
      key:"Цвет адреса показывает роль кошелька в этой операции.", holderKey:"Цвет адреса — по последней сделке в истории пула. Серый — сделка не найдена."},
  en:{buy:"Buyer",sell:"Seller",burn:"Burn",activeBuy:"Last trade: buy",activeSell:"Last trade: sell",
      digits:"4 digits",sub:"Subdomain",checked:"Ownership checked",moreNames:"More domains",
      key:"The address colour identifies the wallet’s role in this transaction.",holderKey:"Address colours show the last observed pool trade. Grey means no trade was found in the archive."}
};
const wl=key=>walletLabels[lang][key];
function hasDomainBadge(wallet){
  const record=snapshot.domains?.byWallet?.[wallet];
  return Boolean(record?.digits?.length||record?.sub?.length);
}

const authorCollection="EQAhaFPX9zIBVYe_vfy3dudCkxJDjSoMjj59KndtHKcqo3iy";
const projectBadgeDefs=[
  ["staking","","https://jvault.xyz/staking/v2/stake/LUDOMAN"],
  ["author","author NFT",""],
  ["vnuk","VNUK","https://t.me/mRvnukICHlife"],
  ["joystick","Joystick","https://t.me/joystickpro"],
  ["phoenix","Phoenix","https://t.me/PHXPW"]
];
function appendProjectBadges(wrapper,wallet){
  const data=snapshot.badges?.sources;
  if(!data)return;
  const badges=el("span",undefined,"projectBadges");
  function match(key){
    const source=data[key];
    return source?.asOf>=Date.now()/1000-24*3600 && source.wallets?.[wallet];
  }
  for(const [key,label,url] of projectBadgeDefs){
    const value=match(key)||((key==="vnuk"||key==="joystick")&&match(key+"Nft"));
    if(!value)continue;
    const target=key==="author"
      ?"https://getgems.io/collection/"+authorCollection+"/"+explorerAddress(value,true)
      :url;
    const badge=link(target,"");
    badge.className="projectBadge "+key;
    if(key!=="author"){
      const icon=$("badge-icon-"+key).content.firstElementChild.cloneNode();
      badge.append(icon);
    }
    if(label)badge.append(el("span",label));
    if(key==="staking"){
      badge.title=lang==="ru"?"JVault · от 500 000 LUDOMAN":"JVault · 500,000+ LUDOMAN";
      badge.setAttribute("aria-label",badge.title);
    }
    badges.append(badge);
  }
  if(badges.childElementCount)wrapper.append(badges);
}

function walletIdentity(raw,name,kind,latest=false){
  const wrapper=el("span",undefined,"walletIdentity");
  const address=addr(raw,name);
  address.className="walletAddress "+(kind||"neutral");
  if(kind){
    const key=latest?(kind==="buy"?"activeBuy":"activeSell"):kind;
    wrapper.append(el("span",wl(key),"walletRole "+kind));
  }
  wrapper.append(address);
  const record=snapshot.domains?.byWallet?.[raw];
  for(const type of ["digits","sub"]){
    const names=record?.[type]||[];
    if(!names.length)continue;
    wrapper.classList.add(type==="digits"?"hasDigits":"hasSub");
    const badge=el("span",names[0],"domainBadge "+type);
    badge.title=wl(type)+" · "+wl("checked")+" · "+stamp(type==="digits"?record.digitsAt:record.subAt);
    wrapper.append(badge);
    if(names.length>1){
      const rest=el("details",undefined,"domainDetails");
      rest.append(el("summary",wl("moreNames")+" (+"+(names.length-1)+")"),
        el("span",names.slice(1).join(" · ")));
      wrapper.append(rest);
    }
  }
  appendProjectBadges(wrapper,raw);
  return wrapper;
}
function lastTradeByWallet(){
  const latest=new Map();
  for(const r of snapshot.trades?.rows||[]){
    if(!latest.has(r.wallet))latest.set(r.wallet,r.kind);
  }
  return latest;
}
function tx(row){const a=link("https://gram.org/tx/"+row.tx,t("openTx"));a.title=row.tx;return a}
function select(id,labels,selected,onClick){const node=$(id);node.replaceChildren();labels.forEach((name,i)=>{const b=el("button",name);b.classList.toggle("on",i===selected);b.setAttribute("aria-pressed",i===selected);b.onclick=()=>onClick(i);node.append(b)})}
function freshness(s){if(!s?.asOf)return t("no");return t("updated")+" "+stamp(s.asOf)+(Date.now()/1000-s.asOf>4*3600?" · "+t("delayed"):"")}
function coverage(section,cut){return section&&section.since>cut?t("partial")+" · "+t("since")+" "+stamp(section.since):""}
function capFormat(n,compact=false){
 return Number(n).toLocaleString(lang,{maximumFractionDigits:compact?1:0,...(compact?{notation:'compact'}:{})});
}
function svg(tag,attrs){const n=document.createElementNS('http://www.w3.org/2000/svg',tag);for(const [k,v] of Object.entries(attrs))n.setAttribute(k,v);return n}
function chart(){
 const section=snapshot.trades, model=marketCapSeries(snapshot,ranges[period]), {start,end,points}=model;
 $('lastPrice').textContent=model.latestCap!==null?capFormat(model.latestCap)+' TON':'—';
 const change=$('capChange');change.textContent=model.change===null?'':(model.change>=0?'+':'')+format(model.change,2)+'%';
 change.className='capChange '+(model.change===null?'':model.change>=0?'capPositive':'capNegative');
 $('capPeriod').textContent=model.partial?t('capPartial'):t('periodNames')[period];
 $('capLow').textContent=model.low===undefined?'':t('capLow')+' · '+capFormat(model.low)+' TON';
 $('capHigh').textContent=model.high===undefined?'':t('capHigh')+' · '+capFormat(model.high)+' TON';
 const plot=$('plot');plot.replaceChildren();
 const width=Math.max(240,plot.clientWidth||800),left=8,right=width-76,top=20,bottom=184;
 const box=svg('svg',{viewBox:`0 0 ${width} 238`,preserveAspectRatio:'none',role:'group','aria-label':t('chart')});
 const x=time=>left+(time-start)/ranges[period]*(right-left);
 const info=$('readout');info.replaceChildren();
 const colour=model.change===null||model.change>=0?'#38dda0':'#ff2020';
 $('market').style.setProperty('--chart-colour',colour);
 if(points.length){
   const pad=(model.high-model.low)*.12||Math.max(model.low*.015,1e-12);
   const min=Math.max(0,model.low-pad),max=model.high+pad;
   const y=value=>bottom-(value-min)/(max-min)*(bottom-top);
   for(let i=0;i<4;i++){
     const value=max-(max-min)*i/3, height=y(value);
     box.append(svg('path',{d:`M${left} ${height}H${right}`,stroke:'#344b5b','stroke-dasharray':'2 6'}));
     const label=svg('text',{x:right+9,y:height+4});label.textContent=capFormat(value,true);box.append(label);
   }
   const defs=svg('defs',{}),gradient=svg('linearGradient',{id:'capFill',x1:0,y1:0,x2:0,y2:1});
   gradient.append(svg('stop',{offset:'0%', 'stop-color':colour,'stop-opacity':'.26'}),svg('stop',{offset:'100%','stop-color':colour,'stop-opacity':'.015'}));defs.append(gradient);box.append(defs);
   const coords=points.map(p=>[x(p.time),y(p.cap)]),last=coords.at(-1),first=coords[0];
   box.append(svg('path',{d:`M${left} ${first[1]}H${right}`,stroke:'#7290a2','stroke-opacity':'.45','stroke-dasharray':'5 6'}));
   const line=coords.map((p,i)=>(i?'L':'M')+p.join(' ')).join(' ');
   box.append(svg('path',{d:line+`L${right} ${last[1]}L${right} ${bottom+2}L${first[0]} ${bottom+2}Z`,fill:'url(#capFill)'}));
   if(coords.length>1)box.append(svg('path',{d:line,fill:'none',stroke:colour,'stroke-width':2.7,'stroke-linejoin':'round','stroke-linecap':'round'}));
   if(last[0]<right)box.append(svg('path',{d:`M${last[0]} ${last[1]}H${right}`,stroke:colour,'stroke-width':1.5,'stroke-dasharray':'4 5',opacity:'.7'}));
   box.append(svg('circle',{cx:last[0],cy:last[1],r:4,fill:colour,stroke:'#e6fff5','stroke-width':1.5}));
   const cursorLine=svg('path',{stroke:'#c0d6e1','stroke-dasharray':'3 4',visibility:'hidden'});
   const cursor=svg('circle',{r:5,fill:'#10151c',stroke:colour,'stroke-width':3,visibility:'hidden'});box.append(cursorLine,cursor);
   let active=points.length-1;
   function inspect(i){
     active=i;const p=points[i],pos=coords[i];
     cursor.setAttribute('cx',pos[0]);cursor.setAttribute('cy',pos[1]);cursor.setAttribute('visibility','visible');
     cursorLine.setAttribute('d',`M${pos[0]} ${top}V${bottom}`);cursorLine.setAttribute('visibility','visible');
     info.replaceChildren(document.createTextNode(stamp(p.row.time)+' · '+capFormat(p.cap)+' TON · '),tx(p.row));
   }
   inspect(active);
   box.setAttribute('tabindex','0');box.setAttribute('aria-description',t('pointHint'));
   function pointer(e){
     if(e.target.closest('.marker'))return;
     const rect=box.getBoundingClientRect(),at=(e.clientX-rect.left)*width/rect.width;
     inspect(coords.reduce((best,p,i)=>Math.abs(p[0]-at)<Math.abs(coords[best][0]-at)?i:best,0));
   }
   box.addEventListener('pointerdown',pointer);
   box.addEventListener('pointermove',e=>{if(e.pointerType==='mouse'||e.buttons)pointer(e)});
   box.addEventListener('keydown',e=>{
     if(e.target!==box||!['ArrowLeft','ArrowRight'].includes(e.key))return;
     e.preventDefault();inspect(Math.max(0,Math.min(active+(e.key==='ArrowLeft'?-1:1),points.length-1)));
   });
 }else{const label=svg('text',{x:left,y:100});label.textContent=t('no');box.append(label)}
 for(const r of (snapshot.burns?.rows||[]).filter(r=>r.time>=start&&r.time<=end)){
   const g=svg('a',{href:'https://gram.org/tx/'+r.tx,class:'marker','aria-label':t('burn')+' '+format(r.kito)+' KITO'});
   const cx=Math.max(12,Math.min(right,x(r.time)));
   g.append(svg('rect',{x:cx-11,y:191,width:25,height:25,rx:6,fill:'#ffedd9'}));
   const icon=svg('text',{x:cx-7,y:209,style:'font-size:15px'});icon.textContent='🔥';g.append(icon);
   const show=()=>info.replaceChildren(document.createTextNode(stamp(r.time)+' · '+t('burn')+' '+format(r.kito)+' KITO · '),tx(r));
   g.addEventListener('click',e=>{e.preventDefault();show()});g.addEventListener('focus',show);box.append(g);
 }
 const axisTime=seconds=>new Date(seconds*1000).toLocaleString(lang,period===0?{hour:'2-digit',minute:'2-digit'}:period===1?{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'}:{day:'numeric',month:'short',year:'2-digit'});
 for(const [pos,time,anchor] of [[left,start,'start'],[width-3,end,'end']]){
   const label=svg('text',{x:pos,y:234,'text-anchor':anchor});label.textContent=axisTime(time);box.append(label);
 }
 plot.append(box);
 $('chartInfo').textContent=[freshness(section),coverage(section,start),!model.tradeCount&&points.length?t('capNoTrades'):'',snapshot.holders?.asOf<section?.asOf?(lang==='ru'?'Предложение на ':'Supply as of ')+stamp(snapshot.holders.asOf):''].filter(Boolean).join(' · ');
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
   .filter(r=>(feedKind==="all"||r.kind===feedKind)&&(!$("feedDomains").checked||hasDomainBadge(r.wallet))).sort((a,b)=>b.time-a.time||a.tx.localeCompare(b.tx)).slice(0,50);
 const clock=feedKind==="burn"?snapshot.burns:snapshot.trades;
 $("feedNote").textContent=(feedKind==="all"?t("feedTime")+" · ":"")+freshness(clock);
 $("feed").replaceChildren(...combined.slice(0,expanded?50:20).map(r=>{
   const who=el("small");who.append(walletIdentity(r.wallet,r.name,r.kind));
   const top=el("b");top.append(el("span",t(r.kind),"badge "+r.kind),document.createTextNode(format(r.kito,4)+" KITO"));
   const details=el("small");details.append(tx(r));
   const right=el("small");if(r.ton)right.append(el("b",format(r.ton,4)+" TON"));
   right.append(document.createTextNode(stamp(r.time)));return row(top,who,right,details)
 }));
 if(!combined.length)$("feed").append(el("p",t($("feedDomains").checked?"noneTagged":"none"),"empty"));
 $("more").hidden=combined.length<=20;$("more").textContent=expanded?t("less"):t("more").replace("30",String(Math.min(30,combined.length-20)));
}
function ranks(){
 const lastActivity=lastTradeByWallet();
 const isHolder=ranking==="holders",source=isHolder?snapshot.holders:snapshot.trades;
 $("rankDescription").textContent=t(isHolder?"holderHint":"sellerHint")+(isHolder?" "+wl("holderKey"):"");
 select("views",[t("holders"),t("sellers")],isHolder?0:1,i=>{ranking=i?"sellers":"holders";ranks()});
 $("sellerPeriods").replaceChildren();if(!isHolder)select("sellerPeriods",t("dayLabels"),[1,7,30].indexOf(sellerDays),i=>{sellerDays=[1,7,30][i];ranks()});
 let data;if(isHolder){data=source?.holders||[];$("rankNote").textContent=freshness(source)+(source?" · "+t("allHolders")+" "+format(source.holderCount,0):"")}
 else{const groups=new Map(),cut=(source?.asOf||0)-sellerDays*day;for(const r of source?.rows||[]){if(r.kind!=="sell"||r.time<=cut||r.time>source.asOf)continue;const g=groups.get(r.wallet)||{...r,kito:0,count:0};g.kito+=Number(r.kito);g.count++;groups.set(r.wallet,g)}data=[...groups.values()].sort((a,b)=>b.kito-a.kito).slice(0,20);$("rankNote").textContent=[freshness(source),coverage(source,cut)].filter(Boolean).join(" · ")}
 $("rank").replaceChildren(...data.map((r,i)=>{const title=el("b");title.append(el("span",String(i+1).padStart(2,"0"),"position"),walletIdentity(r.wallet,r.name,isHolder?lastActivity.get(r.wallet):"sell",isHolder));return row(title,el("small",isHolder?t("balance"):t("sold")),el("b",format(r.kito)+" KITO"),el("small",isHolder?format(r.share,4)+"%":(lang==="ru"?"Сделок: ":"Trades: ")+format(r.count,0)))}));if(!data.length)$("rank").append(el("p",source?t("none"):t("no"),"empty"))
}
function render(){document.documentElement.lang=lang;document.querySelectorAll("[data-t]").forEach(n=>n.textContent=t(n.dataset.t));for(const l of ["ru","en"]){$(l).classList.toggle("on",l===lang);$(l).setAttribute("aria-pressed",l===lang);$(l).onclick=()=>{lang=l;try{localStorage.setItem("kito-lang",l)}catch{}render()}}
 $("walletLegend").textContent=wl("key");
 select("periods",t("periodNames"),period,i=>{period=i;render()});$("copy").textContent=t("copy");$("contract").href="https://gram.org/jetton/"+MASTER;$("contractAddress").textContent=MASTER;chart();stats();list();ranks();renderSyncStatus()}
$("copy").onclick=async()=>{try{await navigator.clipboard.writeText(MASTER);$("copy").textContent=t("copied")}catch{window.prompt(t("copy"),MASTER)}};
$("feedDomains").onchange=()=>{expanded=false;list()};
$("more").onclick=()=>{expanded=!expanded;list()};window.addEventListener("resize",chart);render();
function renderSyncStatus(){
 const ru=lang==='ru', now=Date.now()/1000;
 const times=['trades','burns','holders'].map(k=>snapshot[k]?.asOf||0);
 const asOf=Math.min(...times), minutes=Math.max(0,Math.floor((now-asOf)/60));
 let age=minutes<1?(ru?'только что':'just now'):minutes<60?(ru?`${minutes} мин. назад`:`${minutes} min ago`):(ru?`${Math.floor(minutes/60)} ч ${minutes%60} мин. назад`:`${Math.floor(minutes/60)}h ${minutes%60}m ago`);
 const fresh=asOf?(ru?'Данные обновлены '+age:'Data updated '+age):(ru?'Нет полного снимка данных':'Complete snapshot unavailable');
 const loading=syncState.phase==='loading', failed=syncState.phase==='error';
 $('syncStatus').textContent=loading?(ru?'Проверяем обновления…':'Checking for updates…'):failed?(ru?'Не удалось загрузить свежие данные':'Could not load fresh data'):fresh;
 const warning=!asOf || minutes>=90 || (snapshot.errors||[]).length>0;
 $('syncStatus').className=failed||warning?'syncWarning':'';
 let detail=loading||failed?fresh:warning?(ru?'Часть данных устарела. Ожидаем новый снимок.':'Some data is old. Waiting for a new snapshot.'):(ru?'Автопроверка каждые 5 минут':'Checks every 5 minutes');
 if(failed) detail+=' · '+(ru?'Показана сохранённая копия. Повторим проверку автоматически.':'Showing the saved copy. We will retry automatically.');
 if(syncState.checkedAt&&!loading&&!failed) detail+=' · '+(ru?'Проверено в ':'Checked at ')+new Date(syncState.checkedAt).toLocaleTimeString(lang,{hour:'2-digit',minute:'2-digit'});
 $('syncDetail').textContent=detail;
 $('syncStatus').title=asOf?stamp(asOf):'';
 $('refreshData').textContent=loading?(ru?'Загрузка…':'Loading…'):(ru?'Обновить':'Refresh');
 $('refreshData').disabled=loading;
}
const refresh=createSnapshotLoader({
 getSnapshot:()=>snapshot,
 applySnapshot:next=>{snapshot=next;render()},
 onState:state=>{syncState={...syncState,...state};renderSyncStatus()}
});
$('refreshData').onclick=()=>refresh();
refresh();
setInterval(()=>{if(!document.hidden)refresh()},300000);
setInterval(renderSyncStatus,60000);
window.addEventListener('online',refresh);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh()});

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
