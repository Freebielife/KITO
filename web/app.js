"use strict";
const MASTER="EQCSLLVQ8qdhEqZUKaiKU7F6sVfnNPmQ4FsCpCo8olo795LP";
const texts={
ru:{intro:"Ончейн-аналитика токена KITO в сети TON",swap:"Обменять ↗",price:"Цена сделки",summary:"KITO за 24 часа",activity:"Последние операции",wallets:"Кошельки",domain:"Свой .socool.ton",domainText:"Этот сайт живёт на freebie.socool.ton. Выбери свой субдомен в Resistance Tools.",domainLink:"Открыть Resistance Tools ↗",project:"Сайт проекта ↗",method:"Источники и методика",methodText:"График строится по успешным сделкам пула KITO / TON на DeDust. Цена — количество TON за один KITO. Линия соединяет последние сделки каждого интервала. Сжигания подтверждаются контрактом KITO. Доля держателя считается от общего предложения. Сумма продаж — все проданные кошельком KITO за период. Данные обновляются раз в два часа.",buy:"Покупка",sell:"Продажа",burn:"Сжигание",holders:"Холдеры",sellers:"Продавцы",more:"Ещё 30",less:"Свернуть",copy:"Копировать адрес",copied:"Скопировано",no:"Нет данных",noTrades:"За этот период в проверенной истории нет сделок.",partial:"Частичная история",since:"История с",updated:"Данные на",h:"ч",d:"д",quarter:"Покупки / продажи",volume:"Объём покупок / продаж",users:"Покупатели / продавцы",burned:"Сожжено KITO",none:"За период записей нет",sold:"Продано KITO",balance:"Баланс KITO",periods:["1ч","1д","1н","1м","6м","1г"],total:"Адресов",all:"Показать все",delayed:"Обновление задерживается",chart:"История цены",tx:"Транзакция",deals:"сделок",burnCount:"Сжигания",tradeSource:"Сделки",stale:"Последний сбор неполный",buySell:"куплено / продано"},
en:{intro:"On-chain analytics for KITO on TON",swap:"Swap ↗",price:"Trade price",summary:"KITO in 24 hours",activity:"Latest activity",wallets:"Wallets",domain:"Your .socool.ton",domainText:"This site lives at freebie.socool.ton. Explore subdomains in Resistance Tools.",domainLink:"Open Resistance Tools ↗",project:"Project website ↗",method:"Sources and methodology",methodText:"Prices use successful trades in the KITO / TON DeDust pool. Price is TON per KITO. The line connects the last trade in each interval. Burns are confirmed by the KITO contract. Holder shares use total token supply. Seller rankings sum the amount of KITO sold per wallet over the selected window. Data refreshes every two hours.",buy:"Buy",sell:"Sell",burn:"Burn",holders:"Holders",sellers:"Sellers",more:"30 more",less:"Collapse",copy:"Copy address",copied:"Copied",no:"No data",noTrades:"No trades in the verified history for this period.",partial:"Partial history",since:"History from",updated:"Data as of",h:"h",d:"d",quarter:"Buys / sells",volume:"Buy / sell volume",users:"Buyers / sellers",burned:"KITO burned",none:"No records for this period",sold:"KITO sold",balance:"KITO balance",periods:["1H","1D","1W","1M","6M","1Y"],total:"Addresses",all:"Show all",delayed:"Update overdue",chart:"Price history",tx:"Transaction",deals:"trades",burnCount:"Burns",tradeSource:"Trades",stale:"Last collection incomplete",buySell:"bought / sold"}};
const $=id=>document.getElementById(id);
let snapshot=JSON.parse($("snapshot").textContent), lang="ru", period=1, ranking="holders", sellerDays=1, expanded=false;
try{lang=localStorage.getItem("kito-lang")==="en"?"en":"ru"}catch{}
const t=key=>texts[lang][key], day=86400, ranges=[3600,day,7*day,30*day,182*day,365*day];
function el(tag,txt,cls){const e=document.createElement(tag);if(txt!==undefined)e.textContent=txt;if(cls)e.className=cls;return e}
function link(href,txt){const a=el("a",txt);a.href=href;a.target="_blank";a.rel="noopener noreferrer";return a}
function format(n,d=2){return Number(n).toLocaleString(lang,{maximumFractionDigits:d})}
function stamp(s){return s?new Date(s*1000).toLocaleString(lang,{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit",year:"numeric"}):"—"}
function short(w){return w?w.slice(0,6)+"…"+w.slice(-5):"—"}
function addr(w,name){return link("https://gram.org/address/"+encodeURIComponent(w),name||short(w))}
function tx(row){return link("https://gram.org/tx/"+row.tx,t("tx")+" ↗")}
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
 const series=new Map();for(const r of [...rows].reverse()){if(r.time>=start&&r.time<=end)series.set(Math.floor((r.time-start)/ranges[period]*180),r)}
 const prices=[...series.values()], vals=prices.map(bucketPrice);
 const burns=(snapshot.burns?.rows||[]).filter(r=>r.time>=start&&r.time<=end);
 const x=time=>7+(time-start)/ranges[period]*w;
 for(const v of [24,60,96,132])box.append(svg("path",{d:"M7 "+v+"h"+w,stroke:"#e4e5dc","stroke-dasharray":"3 4"}));
 if(vals.length){let min=Math.min(...vals),max=Math.max(...vals);const pad=(max-min)*.08||Math.max(min*.01,1e-12);min-=pad;max+=pad;
 const y=val=>136-(val-min)/(max-min)*100;
 const pts=prices.map(r=>[x(r.time),y(bucketPrice(r))]);if(pts.length>1){box.append(svg("polygon",{points:[...pts,[pts.at(-1)[0],138],[pts[0][0],138]].join(" "),fill:"#cbed9f",opacity:".65"}));box.append(svg("polyline",{points:pts.join(" "),fill:"none",stroke:"#4e7428","stroke-width":2.4}))}
 pts.forEach(([cx,cy],i)=>{const dot=svg("circle",{cx,cy,r:pts.length>60?1.2:2.6,fill:"#466625"});const title=svg("title",{});title.textContent=stamp(prices[i].time)+" · "+format(bucketPrice(prices[i]),10)+" TON";dot.append(title);box.append(dot)});
 const label=svg("text",{x:7,y:13});label.textContent=format(Math.max(...vals),10)+" TON";box.append(label)
 }else{const label=svg("text",{x:8,y:82});label.textContent=t("noTrades");box.append(label)}
 for(const r of burns){const g=svg("a",{href:"https://gram.org/tx/"+r.tx,target:"_blank",class:"marker","aria-label":t("burn")+" "+format(r.kito)+" KITO"});const icon=svg("text",{x:Math.max(2,Math.min(w-9,x(r.time)-6)),y:157,style:"font-size:15px"});icon.textContent="🔥";g.append(icon);const desc=()=>{$("chartInfo").replaceChildren(document.createTextNode(stamp(r.time)+" · "+t("burn")+" "+format(r.kito)+" KITO · "),tx(r))};g.addEventListener("click",e=>{e.preventDefault();desc()});g.addEventListener("focus",desc);box.append(g)}
 for(const [pos,time,anchor] of [[7,start,"start"],[w+6,end,"end"]]){const label=svg("text",{x:pos,y:181,"text-anchor":anchor});label.textContent=stamp(time);box.append(label)}plot.append(box);
 $("chartInfo").textContent=[freshness(section),coverage(section,start)].filter(Boolean).join(" · ")
}
function stats(){
 const trades=snapshot.trades,burns=snapshot.burns;const windowRows=s=>(s?.rows||[]).filter(r=>r.time>s.asOf-day&&r.time<=s.asOf);
 const a=windowRows(trades), buys=a.filter(r=>r.kind==="buy"),sells=a.filter(r=>r.kind==="sell");const sum=(items,key)=>items.reduce((v,r)=>v+Number(r[key]),0);
 const count=s=>new Set(s.map(r=>r.wallet)).size;
 const complete=s=>s&&s.since<=s.asOf-day;
 const values=[[t("quarter"),buys.length+" / "+sells.length,trades],[t("volume"),format(sum(buys,"ton"))+" / "+format(sum(sells,"ton"))+" TON",trades],[t("users"),count(buys)+" / "+count(sells),trades],[t("burned"),format(sum(windowRows(burns),"kito")),burns]];
 $("stats").replaceChildren(...values.map(([label,value,s])=>{const d=el("div",undefined,"stat");d.append(el("b",complete(s)?value:"—"),el("small",label));if(!complete(s))d.append(el("small",s?t("partial"):t("no")));return d}))
}
function row(first,sub,value,last){const a=el("div"),b=el("div"),d=el("div",undefined,"row");a.append(first,sub);b.append(value,last);d.append(a,b);return d}
function list(){
 const combined=[...(snapshot.trades?.rows||[]),...(snapshot.burns?.rows||[])].sort((a,b)=>b.time-a.time||a.tx.localeCompare(b.tx)).slice(0,50);
 $("feedNote").textContent=[t("tradeSource")+" · "+freshness(snapshot.trades),t("burnCount")+" · "+freshness(snapshot.burns)].join(" / ");
 $("feed").replaceChildren(...combined.slice(0,expanded?50:20).map(r=>{const who=el("small");who.append(addr(r.wallet,r.name));const top=el("b",t(r.kind)+" · "+format(r.kito,4)+" KITO",r.kind);
 const time=el("small");time.append(tx(r));return row(top,who,el("small",(r.ton?format(r.ton,4)+" TON · ":"")+stamp(r.time)),time)}));
 if(!combined.length)$("feed").append(el("p",t("none"),"empty"));$("more").hidden=combined.length<=20;$("more").textContent=expanded?t("less"):t("more").replace("30",String(Math.min(30,combined.length-20)))
}
function ranks(){
 const isHolder=ranking==="holders",source=isHolder?snapshot.holders:snapshot.trades;
 select("views",[t("holders"),t("sellers")],isHolder?0:1,i=>{ranking=i?"sellers":"holders";ranks()});
 $("sellerPeriods").replaceChildren();if(!isHolder)select("sellerPeriods",[1,7,30].map(n=>n+t("d")),[1,7,30].indexOf(sellerDays),i=>{sellerDays=[1,7,30][i];ranks()});
 let data;if(isHolder){data=source?.holders||[];$("rankNote").textContent=freshness(source)+(source?" · "+t("total")+": "+format(source.holderCount,0):"")}
 else{const groups=new Map(),cut=(source?.asOf||0)-sellerDays*day;for(const r of source?.rows||[]){if(r.kind!=="sell"||r.time<=cut||r.time>source.asOf)continue;const g=groups.get(r.wallet)||{...r,kito:0,count:0};g.kito+=Number(r.kito);g.count++;groups.set(r.wallet,g)}data=[...groups.values()].sort((a,b)=>b.kito-a.kito).slice(0,20);$("rankNote").textContent=[freshness(source),coverage(source,cut)].filter(Boolean).join(" · ")}
 $("rank").replaceChildren(...data.map((r,i)=>{const title=el("b");title.append(document.createTextNode(String(i+1).padStart(2,"0")+"  "),addr(r.wallet,r.name));return row(title,el("small",isHolder?t("balance"):t("sold")),el("b",format(r.kito)+" KITO"),el("small",isHolder?format(r.share,4)+"%":r.count+" "+t("deals")))}));if(!data.length)$("rank").append(el("p",source?t("none"):t("no"),"empty"))
}
function render(){document.documentElement.lang=lang;document.querySelectorAll("[data-t]").forEach(n=>n.textContent=t(n.dataset.t));for(const l of ["ru","en"]){$(l).classList.toggle("on",l===lang);$(l).setAttribute("aria-pressed",l===lang);$(l).onclick=()=>{lang=l;try{localStorage.setItem("kito-lang",l)}catch{}render()}}
 select("periods",t("periods"),period,i=>{period=i;render()});$("copy").textContent=t("copy");$("contract").href="https://gram.org/jetton/"+MASTER;$("contract").textContent=MASTER;chart();stats();list();ranks()}
$("copy").onclick=async()=>{try{await navigator.clipboard.writeText(MASTER);$("copy").textContent=t("copied")}catch{window.prompt(t("copy"),MASTER)}};
$("more").onclick=()=>{expanded=!expanded;list()};window.addEventListener("resize",chart);render();
const sources=["https://raw.githubusercontent.com/Freebielife/KITO/main/data/snapshot.json","https://freebielife.github.io/KITO/data/snapshot.json"];
async function refresh(){for(const url of sources){try{const res=await fetch(url+"?v="+Math.floor(Date.now()/600000),{signal:AbortSignal.timeout(7000)});if(!res.ok)continue;const s=await res.json();if(s.schema!==1||!Number.isFinite(s.updated))continue;if(s.updated>=(snapshot.updated||0)){snapshot=s;render();return}}catch{}}}
refresh();setInterval(refresh,600000);window.addEventListener("online",refresh);document.addEventListener("visibilitychange",()=>{if(!document.hidden)refresh()});
