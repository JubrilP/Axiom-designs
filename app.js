// ── CURSOR — desktop only ──
const cur=document.getElementById('cur'),ring=document.getElementById('cur-ring');
const isTouch=('ontouchstart' in window)||window.matchMedia('(pointer:coarse)').matches;
if(!isTouch){
  let mx=0,my=0,rx=0,ry=0;
  document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY});
  (function tick(){rx+=(mx-rx)*.1;ry+=(my-ry)*.1;cur.style.left=mx+'px';cur.style.top=my+'px';ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(tick)})();
  document.querySelectorAll('a,button,.fc,.mi,.dr,.sc,.svr,.trw,.wbtn,.rdot').forEach(el=>{
    el.addEventListener('mouseenter',()=>document.body.classList.add('cx'));
    el.addEventListener('mouseleave',()=>document.body.classList.remove('cx'));
  });
}

// ── HUD ──
const hud=document.getElementById('hud');

// ── BIZ ──
function openBiz(){document.getElementById('bpanel').classList.add('open');document.getElementById('bveil').classList.add('on');document.body.style.overflow='hidden'}
function closeBiz(){document.getElementById('bpanel').classList.remove('open');document.getElementById('bveil').classList.remove('on');document.body.style.overflow=''}
function bpTab(btn,id){document.querySelectorAll('.bptb').forEach(t=>t.classList.remove('on'));document.querySelectorAll('.bppn').forEach(p=>p.classList.remove('on'));btn.classList.add('on');document.getElementById(id).classList.add('on')}
async function subBiz(e){
  e.preventDefault();
  const b=document.getElementById('bsub');
  b.textContent='Sending...';b.disabled=true;
  const form=document.getElementById('biz-form');
  const data=new FormData(form);
  try{
    const res=await fetch('https://formspree.io/f/xojbglqw',{method:'POST',body:data,headers:{'Accept':'application/json'}});
    if(res.ok){
      b.textContent="Request Received — We'll Be In Touch";
      b.classList.add('sent');
      form.reset();
      setTimeout(()=>{b.textContent='Send Project Inquiry →';b.classList.remove('sent');b.disabled=false;},5000);
    }else{
      b.textContent='Something went wrong — please try again';
      b.disabled=false;
    }
  }catch(err){
    b.textContent='Something went wrong — please try again';
    b.disabled=false;
  }
}

// ROOM NAVIGATION — pure CSS snap handles scrolling
// JS only tracks which room is visible for dots + animations
const rooms=['r-entry','r-kitchen','r-living','r-master','r-pool','r-process','r-stories','r-services'];
let currentRoom=0;
const site=document.getElementById('site');
const dots=document.querySelectorAll('.rdot');

function goToRoom(idx){
  if(idx<0||idx>=rooms.length)return;
  currentRoom=idx;
  document.getElementById(rooms[idx]).scrollIntoView({behavior:'smooth'});
}

// Touch support for mobile
let touchY=0;
site.addEventListener('touchstart',e=>{touchY=e.touches[0].clientY},{passive:true});
site.addEventListener('touchend',e=>{
  const diff=touchY-e.changedTouches[0].clientY;
  if(Math.abs(diff)>50)goToRoom(diff>0?currentRoom+1:currentRoom-1);
},{passive:true});

// ENTER SITE
function enterSite(){
  gsap.to('#intro',{opacity:0,scale:1.04,duration:1.5,ease:'power2.inOut',onComplete:()=>{
    document.getElementById('intro').style.display='none';
    site.classList.add('on');
    hud.classList.add('on');
    hud.classList.add('solid');
    document.getElementById('room-dots').classList.add('on');
    // IntersectionObserver tracks which room is visible
    const roomObs=new IntersectionObserver(entries=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          const idx=rooms.indexOf(e.target.id);
          if(idx>=0){
            currentRoom=idx;
            dots.forEach((d,i)=>d.classList.toggle('active',i===idx));
            hud.classList.add('solid');
            playRoom(idx);
          }
        }
      });
    },{threshold:0.6});
    rooms.forEach(id=>roomObs.observe(document.getElementById(id)));
    playRoom(0);
    currentRoom=0;
  }});
}

// ── ROOM ANIMATIONS ── (fire once per room on enter)
const played=new Set();
function playRoom(idx){
  if(played.has(idx))return;
  played.add(idx);
  const id=rooms[idx];
  const tl=gsap.timeline({defaults:{ease:'power3.out'}});
  if(id==='r-entry'){
    tl.to(`#${id} .rnum`,{opacity:1,x:0,duration:.45})
      .to(`#${id} .rlbl`,{opacity:1,x:0,duration:.4},'-=.2')
      .to(`#${id} .tin`,{y:0,stagger:.1,duration:.6},'-=.15')
      .to(`#${id} .rbody`,{opacity:1,y:0,duration:.45},'-=.3')
      .to('#en-acc',{width:'100px',duration:.45,ease:'power2.out'},'-=.35')
      .to(`#${id} .fc`,{opacity:1,x:0,stagger:.12,duration:.45},'-=.3');
  }else if(id==='r-kitchen'){
    tl.to(`#${id} .rnumr`,{opacity:1,x:0,duration:.45})
      .to(`#${id} .rlblr`,{opacity:1,x:0,duration:.4},'-=.2')
      .to(`#${id} .tin`,{y:0,stagger:.1,duration:.6},'-=.15')
      .to(`#${id} .rbodyr`,{opacity:1,y:0,duration:.45},'-=.3')
      .to(`#${id} .rlbll`,{opacity:1,x:0,duration:.4},'-=.5')
      .to(`#${id} .mi`,{opacity:1,x:0,stagger:.1,duration:.42},'-=.2');
  }else if(id==='r-living'){
    tl.to(`#${id} .rnum`,{opacity:1,x:0,duration:.45})
      .to(`#${id} .rlbl`,{opacity:1,x:0,duration:.4},'-=.2')
      .to(`#${id} .tin`,{y:0,stagger:.1,duration:.6},'-=.15')
      .to(`#${id} .rbody`,{opacity:1,y:0,duration:.45},'-=.3')
      .to('#lv-acc',{width:'100px',duration:.45,ease:'power2.out'},'-=.35')
      .to(`#${id} .dr`,{opacity:1,x:0,stagger:.1,duration:.42},'-=.3');
  }else if(id==='r-master'){
    tl.to(`#${id} .rnumr`,{opacity:1,x:0,duration:.45})
      .to(`#${id} .rlblr`,{opacity:1,x:0,duration:.4},'-=.2')
      .to(`#${id} .tin`,{y:0,stagger:.1,duration:.6},'-=.15')
      .to(`#${id} .rbodyr`,{opacity:1,y:0,duration:.45},'-=.3')
      .to(`#${id} .sc`,{opacity:1,y:0,stagger:.08,duration:.38},'-=.2');
  }else if(id==='r-pool'){
    tl.to(`#${id} .rnum`,{opacity:1,y:0,duration:.45})
      .to(`#${id} .rlbll`,{opacity:1,y:0,duration:.4},'-=.2')
      .to(`#${id} .tin`,{y:0,stagger:.1,duration:.65},'-=.15')
      .to(`#${id} .rbodyl`,{opacity:1,y:0,duration:.45},'-=.3')
      .to(`#${id} .psn`,{opacity:1,y:0,stagger:.1,duration:.45},'-=.2')
      .to(`#${id} .pfi`,{opacity:1,x:0,stagger:.1,duration:.42},'-=.2');
  }else if(id==='r-process'){
    tl.to('#pr-ey',{opacity:1,x:0,duration:.45})
      .to('#r-process .tin',{y:0,stagger:.1,duration:.6},'-=.2')
      .to('#pr-sub',{opacity:1,y:0,duration:.45},'-=.3')
      .to(['#pst-1','#psl-1','#pst-2','#psl-2','#pst-3','#psl-3'],{opacity:1,y:0,stagger:.07,duration:.4},'-=.2')
      .to(['#st-1','#st-2','#st-3','#st-4','#st-5'],{opacity:1,x:0,stagger:.12,duration:.5},'-=.4');
  }else if(id==='r-stories'){
    tl.to('#st-ey',{opacity:1,y:0,duration:.45})
      .to('#st-h .tin',{y:0,stagger:.12,duration:.6},'-=.2')
      .to('#st-tg',{opacity:1,y:0,duration:.45},'-=.3');
    // On desktop only — on mobile the slideshow JS handles cards
    if(window.innerWidth>768){
      tl.to(['#sc-1','#sc-2','#sc-3'],{opacity:1,y:0,stagger:.14,duration:.55},'-=.2');
    }
  }else if(id==='r-services'){
    tl.to('#sv-ey',{opacity:1,y:0,duration:.45})
      .to('#sv-h .tin',{y:0,stagger:.12,duration:.6},'-=.2')
      .to('#sv-note',{opacity:1,y:0,duration:.45},'-=.3')
      .to(['#sv-1','#sv-2','#sv-3','#sv-4'],{opacity:1,y:0,stagger:.12,duration:.5},'-=.2');
  }
}

// Scroll listener handled by IntersectionObserver above

// ═══════════════════════════════════════════════════════
// INTRO — CINEMATIC WALK-IN
// Slow push into the home · warm light bloom · film grain · kinetic wordmark
// ═══════════════════════════════════════════════════════
(function(){
  const intro=document.getElementById('intro');
  if(!intro)return;
  const dead=()=>!intro||intro.style.display==='none';

  /* film grain */
  (function(){
    const c=document.getElementById('fx-grain'); if(!c)return;
    const x=c.getContext('2d'); let w,h;
    const size=()=>{w=c.width=Math.ceil(innerWidth/2.4);h=c.height=Math.ceil(innerHeight/2.4);};
    size(); addEventListener('resize',size); let f=0;
    (function loop(){ if(dead())return; if((f++&1)===0){
      const img=x.createImageData(w,h),d=img.data;
      for(let i=0;i<d.length;i+=4){const v=Math.random()*255;d[i]=d[i+1]=d[i+2]=v;d[i+3]=12;}
      x.putImageData(img,0,0);} requestAnimationFrame(loop); })();
  })();

  /* choreography — a glow ignites from black, grows, and becomes the home */
  const tl=gsap.timeline({defaults:{ease:'power2.out'}});
  // 1) a single warm glow ignites from darkness and expands
  tl.fromTo('.lightbloom',{opacity:0,scale:.18},{opacity:1,scale:1.04,duration:3.0,ease:'sine.inOut'},0);
  // 2) the home opens OUT of the glow — a soft radial wipe expanding from the same center, so there is no seam
  tl.fromTo('#house-reveal',{'--r':'0%',opacity:0},{'--r':'140%',opacity:1,duration:4.4,ease:'sine.inOut'},.6);
  tl.fromTo('#house-reveal',{scale:1.16},{scale:1.0,duration:8.6,ease:'power1.out'},.6);
  // 3) the glow settles and keeps warming the scene instead of cutting out
  tl.to('.lightbloom',{opacity:.5,scale:1,duration:3.2,ease:'sine.inOut'},2.6);
  // 3) the wordmark condenses out of light — letters resolve from blur, as one
  tl.set('#wui',{opacity:1,pointerEvents:'all'},2.5);
  tl.to('.wc-b',{opacity:1,duration:1.3},2.6);
  tl.to(['#wr-t','#wr-b'],{width:'92px',duration:1.2},2.7);
  tl.to('.wch',{opacity:1,scale:1,'--b':'0px',duration:1.15,stagger:.055,ease:'power3.out'},2.8);
  tl.to('.wloc',{opacity:1,y:0,duration:1.0},3.3);
  tl.to('.wtag',{opacity:1,y:0,duration:1.0},3.7);
  tl.to('.wbtn',{opacity:1,y:0,duration:1.0},4.1);
  tl.to('.wplse',{opacity:1,duration:.8},4.6);
})();

// Mobile stories slideshow — runs only on mobile
(function(){
  if(window.innerWidth>768)return;
  const cards=[...document.querySelectorAll('.story-card')];
  const dots=[...document.querySelectorAll('.slide-dot')];
  const dotsWrap=document.getElementById('slide-dots');
  if(!cards.length)return;

  // Show dots
  if(dotsWrap)dotsWrap.style.display='flex';

  // Hard reset all cards — override any GSAP inline styles
  function resetCards(){
    cards.forEach(c=>{
      c.style.cssText='display:none !important;opacity:0;width:100%;box-sizing:border-box;';
      c.classList.remove('slide-active');
    });
  }

  let current=0;
  let timer=null;

  function showCard(idx){
    resetCards();
    current=((idx%cards.length)+cards.length)%cards.length;
    const card=cards[current];
    // Force display and opacity via inline style
    card.style.cssText='display:flex !important;flex-direction:column;width:100%;box-sizing:border-box;opacity:1;border:1px solid rgba(201,165,90,.15);padding:2rem 1.6rem;';
    card.classList.add('slide-active');
    // Update dots
    dots.forEach((d,i)=>d.classList.toggle('on',i===current));
  }

  // Make goSlide global for onclick handlers
  window.goSlide=function(idx){
    clearInterval(timer);
    showCard(idx);
    timer=setInterval(()=>showCard(current+1),5000);
  };

  // Wait for room to be entered before initialising
  // Use a small delay to let GSAP run first then override
  function init(){
    showCard(0);
    timer=setInterval(()=>showCard(current+1),5000);
  }

  // Also hook into IntersectionObserver to init when stories room enters view
  const storiesSection=document.getElementById('r-stories');
  if(storiesSection){
    const obs=new IntersectionObserver(entries=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          // Small delay ensures GSAP has run first
          setTimeout(init,100);
          obs.unobserve(storiesSection);
        }
      });
    },{threshold:0.4});
    obs.observe(storiesSection);
  }

  // Touch swipe
  let tx=0;
  const grid=document.querySelector('.stories-grid');
  if(grid){
    grid.addEventListener('touchstart',e=>{tx=e.touches[0].clientX},{passive:true});
    grid.addEventListener('touchend',e=>{
      const diff=tx-e.changedTouches[0].clientX;
      if(Math.abs(diff)>40)window.goSlide(diff>0?current+1:current-1);
    },{passive:true});
  }
})();

