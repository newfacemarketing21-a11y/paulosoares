(function(){
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- NAV bg ---- */
  var nav = document.querySelector('.nav');
  function navScroll(){ nav.classList.toggle('scrolled', window.scrollY > 40); }
  navScroll(); window.addEventListener('scroll', navScroll, {passive:true});

  /* ---- HERO split + photo cycle ---- */
  var hero=document.getElementById('hero'),media=document.getElementById('heroMedia'),
      wPaulo=document.getElementById('wordPaulo'),wSoares=document.getElementById('wordSoares'),
      meta=document.getElementById('heroMeta');
  var imgs=media?[].slice.call(media.querySelectorAll('.hero__img')):[];var last=-1;
  function heroFrame(){
    if(!hero) return;
    var vh=innerHeight,total=hero.offsetHeight-vh;
    var p=Math.min(1,Math.max(0,-hero.getBoundingClientRect().top/total));
    var shift=p*Math.min(innerWidth*0.30,340);
    wPaulo.style.transform='translateX('+(-shift)+'px)';
    wSoares.style.transform='translateX('+shift+'px)';
    var op=Math.min(1,Math.max(0,(p-0.04)/0.22));
    media.style.opacity=op;media.style.scale=(0.94+op*0.06).toFixed(3);
    if(meta) meta.style.opacity=(1-Math.min(1,p/0.25)).toFixed(2);
    if(imgs.length){var idx=Math.min(imgs.length-1,Math.floor(p*imgs.length*1.0000001));
      if(idx!==last){if(imgs[last])imgs[last].classList.remove('on');imgs[idx].classList.add('on');last=idx;}}
  }

  /* ---- MEUS PROJETOS montage ---- */
  var mp=document.getElementById('projetos');
  var cols=mp?[].slice.call(mp.querySelectorAll('.mp__col')):[];
  function mpFrame(){
    if(!mp||!cols.length) return;
    var vh=innerHeight,r=mp.getBoundingClientRect(),total=mp.offsetHeight-vh;
    var p=Math.min(1,Math.max(0,-r.top/total));
    for(var i=0;i<cols.length;i++){
      var c=cols[i],speed=parseFloat(c.dataset.speed)||1;
      var max=Math.max(0,c.scrollHeight-vh);
      var ty=-p*max*speed;
      if(ty<-max) ty=-max; if(ty>0) ty=0;
      c.style.transform='translateY('+ty+'px)';
    }
  }

  /* ---- Skills rotating word ---- */
  var skillWords=['Gestão de projetos','Liderança','Design Gráfico','Branding','Edição de vídeo','Captação de vídeo','Web Design'];
  var skillEl=document.getElementById('skillRot'),skillSec=document.getElementById('skills'),skillLast=0;
  function skillFrame(){
    if(!skillSec||!skillEl) return;
    var vh=innerHeight,r=skillSec.getBoundingClientRect();
    var p=(vh*0.85-r.top)/(vh*0.7); p=Math.min(0.999,Math.max(0,p));
    var idx=Math.floor(p*skillWords.length);
    if(idx!==skillLast&&idx>=0&&idx<skillWords.length){
      skillEl.textContent=skillWords[idx];
      skillEl.classList.remove('anim'); void skillEl.offsetWidth; skillEl.classList.add('anim');
      skillLast=idx;
    }
  }
  /* ---- BR Mind checklist ---- */
  var chk=document.getElementById('brChecklist');
  if(chk){ new IntersectionObserver(function(e){e.forEach(function(x){if(x.isIntersecting){x.target.classList.add('in');}});},{threshold:0.35}).observe(chk); }

  if(!reduce){
    var ticking=false;
    function onScroll(){ if(!ticking){requestAnimationFrame(function(){heroFrame();mpFrame();skillFrame();ticking=false;});ticking=true;} }
    heroFrame(); mpFrame(); skillFrame();
    addEventListener('scroll',onScroll,{passive:true});
    addEventListener('resize',function(){heroFrame();mpFrame();skillFrame();});
  } else if(imgs.length){ imgs[0].classList.add('on'); media.style.opacity=1; }

  /* ---- Reveal ---- */
  var io=new IntersectionObserver(function(e){e.forEach(function(x){if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target);}});},{threshold:0.16});
  document.querySelectorAll('.reveal').forEach(function(el){io.observe(el);});

  /* ---- Charts ---- */
  var cio=new IntersectionObserver(function(e){e.forEach(function(x){if(x.isIntersecting){
    var pth=x.target.querySelector('path.line');
    if(pth&&typeof pth.getTotalLength==='function'){try{var len=pth.getTotalLength();pth.style.strokeDasharray=len;pth.style.strokeDashoffset=reduce?0:len;}catch(_){}}
    requestAnimationFrame(function(){x.target.classList.add('in');});cio.unobserve(x.target);}});},{threshold:0.4});
  document.querySelectorAll('.chart').forEach(function(el){cio.observe(el);});

  /* ---- Count-up ---- */
  function fmt(n,d){return n.toLocaleString('pt-BR',{minimumFractionDigits:d||0,maximumFractionDigits:d||0});}
  function countUp(el){
    var t=parseFloat(el.dataset.to),d=parseInt(el.dataset.dec||'0',10),pre=el.dataset.pre||'',suf=el.dataset.suf||'';
    if(reduce){el.textContent=pre+fmt(t,d)+suf;return;}
    var dur=1600,t0=null;
    function step(ts){if(!t0)t0=ts;var k=Math.min(1,(ts-t0)/dur),e=1-Math.pow(1-k,3);
      el.textContent=pre+fmt(t*e,d)+suf; if(k<1)requestAnimationFrame(step); else el.textContent=pre+fmt(t,d)+suf;}
    requestAnimationFrame(step);
  }
  var nio=new IntersectionObserver(function(e){e.forEach(function(x){if(x.isIntersecting){countUp(x.target);nio.unobserve(x.target);}});},{threshold:0.6});
  document.querySelectorAll('[data-to]').forEach(function(el){nio.observe(el);});

  /* ---- videos + year ---- */
  document.querySelectorAll('video').forEach(function(v){v.play().catch(function(){});});
  var y=document.getElementById('yr'); if(y) y.textContent=new Date().getFullYear();
})();
