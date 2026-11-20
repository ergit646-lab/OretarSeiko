(()=>{'use strict';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const rm=matchMedia('(prefers-reduced-motion:reduce)').matches,root=document.documentElement,t0=performance.now();
/* loader */
let on=false;const ready=()=>{if(on)return;on=true;$('.ld').classList.add('done');root.classList.add('ready')};
addEventListener('load',()=>setTimeout(ready,Math.max(0,(rm?0:1500)-(performance.now()-t0))));setTimeout(ready,4500);
/* header, parallax */
const hd=$('.hd'),bg=$('.bg'),dial=$('.dial');let tk=false;
const onScroll=()=>{tk=false;const y=scrollY;hd.classList.toggle('s',y>60);
if(!rm&&y<innerHeight*1.3){bg.style.transform=`translate3d(0,${y*.25}px,0)`;dial.style.translate=`0 calc(-50% + ${y*.12}px)`}};
addEventListener('scroll',()=>{if(!tk){tk=true;requestAnimationFrame(onScroll)}},{passive:true});onScroll();
/* active section */
const links=$$('.menu a[href^="#"]');
const so=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;
links.forEach(a=>{const h=a.hash==='#'+e.target.id;a.classList.toggle('on',h);h?a.setAttribute('aria-current','true'):a.removeAttribute('aria-current')})}),{rootMargin:'-45% 0px -50% 0px'});
$$('main section[id]').forEach(s=>so.observe(s));
/* mobile menu */
const mb=$('.burger'),mn=$('.menu');
const tog=o=>{mn.classList.toggle('open',o);mb.setAttribute('aria-expanded',o);mb.setAttribute('aria-label',o?'Mbyll menunë':'Hap menunë');document.body.style.overflow=o?'hidden':''};
$$('.menu li').forEach((l,i)=>l.style.setProperty('--i',i));
mb.addEventListener('click',()=>tog(!mn.classList.contains('open')));
mn.addEventListener('click',e=>{if(e.target.closest('a'))tog(false)});
addEventListener('keydown',e=>{if(e.key==='Escape')tog(false)});
matchMedia('(min-width:900px)').addEventListener('change',()=>tog(false));
/* scroll reveal, staggered */
$$('[data-st]').forEach(p=>$$('.rv',p).forEach((el,i)=>el.style.setProperty('--d',i*.09+'s')));
const ro=new IntersectionObserver((es,o)=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');o.unobserve(e.target)}}),{threshold:.12});
$$('.rv').forEach(el=>ro.observe(el));
/* animated stats */
$$('.stats b').forEach(b=>{if(!rm)b.textContent=0});
const co=new IntersectionObserver((es,o)=>es.forEach(e=>{if(!e.isIntersecting)return;o.unobserve(e.target);
$$('b',e.target).forEach(b=>{const n=+b.dataset.n;if(rm){b.textContent=n;return}const s=performance.now();
(function f(t){const p=Math.min(1,(t-s)/1800);b.textContent=Math.round(n*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(f)})(s)})}),{threshold:.4});
$$('.stats').forEach(s=>co.observe(s));
/* contact form (FormSubmit) -> ergit646@gmail.com */
const MAIL_ENDPOINT='https://formsubmit.co/ajax/ergit646@gmail.com';
const f=$('#cf'),st=$('#st'),btn=$('button[type=submit]',f);
const say=(m,s='')=>{st.textContent=m;st.dataset.state=s};
const rules={
name:v=>v.trim().length>=2||'Shkruani emrin tuaj (të paktën 2 shkronja).',
email:v=>/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())||'Shkruani një adresë email të vlefshme, p.sh. emri@gmail.com.',
message:v=>v.trim().length>=10||'Mesazhi duhet të ketë të paktën 10 karaktere.'};
const chk=el=>{const r=rules[el.name](el.value),ok=r===true;el.setAttribute('aria-invalid',!ok);$('#e-'+el.name).textContent=ok?'':r;return ok};
const fields=$$('[required]',f);
fields.forEach(el=>{el.addEventListener('blur',()=>chk(el));el.addEventListener('input',()=>{if(el.getAttribute('aria-invalid')==='true')chk(el)})});
f.addEventListener('submit',async e=>{
e.preventDefault();
const bad=fields.filter(el=>!chk(el));
if(bad.length){bad[0].focus();say('Ju lutemi korrigjoni fushat e shënuara.','err');return}
const data=Object.fromEntries(new FormData(f));
if(data._honey)return;
/* FormSubmit nuk punon kur faqja hapet direkt si file (file://) */
if(location.protocol==='file:'){say('Formulari punon vetëm kur faqja hapet nga serveri (Live Server ose hosting), jo si file lokal.','err');return}
data._replyto=data.email;
const label=btn.textContent;btn.disabled=true;btn.textContent='Po dërgohet…';say('');
try{
const r=await fetch(MAIL_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(data)});
const d=await r.json().catch(()=>({}));
if(!r.ok||String(d.success)!=='true')throw new Error(d.message||r.status);
say('Faleminderit! Mesazhi u dërgua me sukses. Do t’ju përgjigjemi sa më shpejt.','ok');
f.reset();fields.forEach(el=>el.removeAttribute('aria-invalid'));
}catch(err){console.error('Formulari i kontaktit:',err);say('Mesazhi nuk u dërgua. Ju lutemi provoni përsëri ose na telefononi në +383 44 437 136.','err')}
finally{btn.disabled=false;btn.textContent=label}});
$('#yr').textContent=new Date().getFullYear();
})();
