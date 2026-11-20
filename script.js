(function(){
  var nav=document.getElementById('nav');
  function onScroll(){nav.classList.toggle('solid',window.scrollY>24)}
  onScroll();addEventListener('scroll',onScroll,{passive:true});

  // Countdown to Dec 5, 2026 (local midnight; start time TBA)
  var target=new Date(2026,11,5,0,0,0).getTime();
  var el={d:d,h:h,m:m,s:s};
  function pad(n){return String(n).padStart(2,'0')}
  function tick(){
    var t=Math.max(0,target-Date.now());
    el.d.textContent=pad(Math.floor(t/864e5));
    el.h.textContent=pad(Math.floor(t%864e5/36e5));
    el.m.textContent=pad(Math.floor(t%36e5/6e4));
    el.s.textContent=pad(Math.floor(t%6e4/1e3));
  }
  tick();setInterval(tick,1000);

  // Scroll reveal
  var items=document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12});
    items.forEach(function(i){io.observe(i)});
  }else items.forEach(function(i){i.classList.add('in')});

  // Animated candlestick background
  var c=document.getElementById('candles'),x=c.getContext('2d'),W,H,cs=[],w=18,gap=10,speed=.35,off=0;
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  function mk(prev){var o=prev,cl=o+(Math.random()-.46)*30;return{o:o,c:cl,h:Math.max(o,cl)+Math.random()*14,l:Math.min(o,cl)-Math.random()*14}}
  function resize(){var r=devicePixelRatio||1;W=c.clientWidth;H=c.clientHeight;c.width=W*r;c.height=H*r;x.setTransform(r,0,0,r,0,0);
    cs=[];var p=0;for(var i=0;i<Math.ceil(W/(w+gap))+3;i++){var k=mk(p);cs.push(k);p=k.c}}
  function draw(){
    x.clearRect(0,0,W,H);var mid=H*.72,sc=2.4;
    cs.forEach(function(k,i){var X=i*(w+gap)-off,up=k.c>=k.o,col=up?'#2dff5a':'#ff4d6a';
      var y=function(v){return mid-v*sc};
      x.strokeStyle=col;x.fillStyle=col;x.lineWidth=2;
      x.beginPath();x.moveTo(X+w/2,y(k.h));x.lineTo(X+w/2,y(k.l));x.stroke();
      x.fillRect(X,Math.min(y(k.o),y(k.c)),w,Math.max(3,Math.abs(y(k.o)-y(k.c))))});
    if(!reduce){off+=speed;if(off>=w+gap){off=0;cs.shift();var l=cs[cs.length-1];cs.push(mk(l.c))}
      // keep walk bounded
      if(Math.abs(cs[cs.length-1].c)>90)cs[cs.length-1].c*=.5;
      requestAnimationFrame(draw)}
  }
  resize();draw();addEventListener('resize',function(){resize();if(reduce)draw()});
})();
