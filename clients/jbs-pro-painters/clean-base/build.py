import base64,io,pathlib,re
from PIL import Image
H=pathlib.Path(__file__).resolve().parent;R=H.parent/'v3'
def b64(n,w=None,q=72):
    if w:
        im=Image.open(R/'img'/n).convert('RGB');im.thumbnail((w,w*2));bf=io.BytesIO();im.save(bf,'JPEG',quality=q);d=bf.getvalue()
    else:d=(R/'img'/n).read_bytes()
    return 'data:image/jpeg;base64,'+base64.b64encode(d).decode()
s=(H/'template.html').read_text()
def rep(a,b,count=1):
    global s
    assert a in s,'MISSING: '+a[:70];s=s.replace(a,b,count)
TEL='tel:+16024730415'
# head
rep('<title>Your Company | Residential &amp; Commercial Services</title>','''<title>JB'S Pro Painters LLC | Painters in Gilbert, Mesa &amp; the East Valley, AZ</title>
<meta name="description" content="Owner-operated interior, exterior, cabinet and commercial painters serving Gilbert, Mesa, Chandler, Tempe, Scottsdale and Queen Creek, AZ. Licensed and insured. Free estimates.">
<meta property="og:title" content="JB'S Pro Painters LLC"><meta property="og:description" content="Owner-operated painters across the East Valley. Free estimates."><meta property="og:image" content="og.jpg"><meta name="twitter:card" content="summary_large_image">''')
# palette: navy hero, JB'S blue accent instead of red
rep('--blue:#0a47a1;','--blue:#0b2a6b;');rep('--blue-dark:#083a85;','--blue-dark:#081f52;')
rep('--red:#c8102e;','--red:#1f55d6;');rep('--red-dark:#a50d26;','--red-dark:#1844ad;')
rep('--num:#c3d3e8;','--num:#d3ddef;')
# css additions
rep('</style>','''
  .brandbar{position:absolute;left:0;right:0;top:0;z-index:2;display:flex;align-items:center;justify-content:space-between;padding:14px 18px;background:linear-gradient(180deg,rgba(5,10,28,.75),rgba(5,10,28,0))}
  .brandbar a.logo{display:flex;align-items:center;gap:10px;text-decoration:none;color:#fff;font-weight:800;letter-spacing:.5px}
  .brandbar img{position:static;width:52px;height:52px;border-radius:10px;box-shadow:0 2px 8px rgba(0,0,0,.4)}
  .brandbar .call{white-space:nowrap;background:var(--red);color:#fff;text-decoration:none;font-weight:700;font-size:14px;padding:10px 16px;border-radius:4px}
  @media (max-width:520px){.brandbar .hn{display:none}}
  .hero-media::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(5,10,28,0) 55%,rgba(11,42,107,.55))}
  .icons{display:flex;justify-content:center;gap:14px;margin:16px 0 6px}.icons svg{width:44px;height:44px;fill:none;stroke:var(--blue);stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
  .tile{color:#fff!important;text-shadow:0 2px 6px rgba(0,0,0,.5)}.tile::before{background:linear-gradient(180deg,rgba(5,10,28,.25),rgba(5,10,28,.6))}.tile:hover::before{background:linear-gradient(180deg,rgba(5,10,28,.1),rgba(5,10,28,.5))}
  .sched-photo{max-width:420px;margin:0 auto 18px;border-radius:8px;box-shadow:0 3px 10px rgba(0,0,0,.25);aspect-ratio:16/10;object-fit:cover;width:100%}
  .qf{max-width:420px;margin:18px auto 0;display:grid;gap:10px;text-align:left}.qf label{font-weight:700;font-size:13px;text-transform:uppercase;letter-spacing:.4px;display:grid;gap:4px}
  .qf input,.qf select{font:inherit;font-size:16px;min-height:48px;padding:0 12px;border:1px solid #b9c2d3;border-radius:4px;background:#fff;text-transform:none;letter-spacing:0;font-weight:400}
  .qf .hp{position:absolute;left:-9999px}.qf .btn{min-height:48px;font-size:15px}#ok{min-height:1.3em;font-weight:700;color:var(--blue)}
  .or{margin-top:14px;font-weight:700}.or a{color:var(--red)}
  .owner{max-width:400px;margin:26px auto 18px;background:#fff;padding:12px;box-shadow:0 3px 10px rgba(0,0,0,.25)}.owner img{width:100%;aspect-ratio:4/3;object-fit:cover;object-position:25% 40%}.owner figcaption{padding:10px 4px 2px;font-weight:700}.owner figcaption small{display:block;font-weight:400;color:#666}
  .rating img{width:44px;height:44px;border-radius:8px;flex:none}
  .areas{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin-top:8px}.areas span{background:#fff;border-radius:12px;padding:3px 10px;font-size:13px;font-weight:600;color:var(--blue)}
  .btn:focus-visible,a:focus-visible,button:focus-visible{outline:3px solid var(--red);outline-offset:2px}
  @media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}*{transition:none!important}}
</style>''')
# hero media
rep('''<div class="hero-media" id="home">
  <!-- <video src="hero.mp4" autoplay muted loop playsinline></video> -->
  <span>Hero video / image placeholder</span>
</div>''',f'''<div class="hero-media" id="home">
  <img src="{b64('home-after.jpg',1600,70)}" alt="A Gilbert home repainted by JB'S Pro Painters">
  <div class="brandbar"><a class="logo" href="#home"><img src="{b64('logo-sq.jpg')}" alt="JB'S Pro Painters LLC logo" width="52" height="52">JB'S PRO PAINTERS</a><a class="call" href="{TEL}">Call<span class="hn"> (602) 473-0415</span></a></div>
</div>''')
rep('<h1>Most Trusted<br><b>Service</b><br><b>Company</b> by<br>Local<br>Homeowners!</h1>','<h1>Owner-Operated<br><b>Painting</b> for<br>the <b>East Valley</b></h1>')
rep('<p>Serving Your City and surrounding areas with professional services, including residential, commercial, interior and exterior work.</p>','<p>Serving Gilbert, Mesa, Chandler, Tempe, Scottsdale and Queen Creek with interior, exterior, cabinet and commercial painting. Licensed and insured.</p>')
# intro
rep('<h2>Professional Residential &amp; Commercial Pros in Your City</h2>','<h2>Residential &amp; Commercial Painters in Gilbert and the East Valley</h2>')
rep('<div class="emoji" aria-hidden="true">🏠🎨</div>','<div class="icons" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M3 11 12 3l9 8"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/></svg><svg viewBox="0 0 24 24"><rect x="3" y="3" width="14" height="6" rx="1"/><path d="M17 6h3v5h-8v3"/><rect x="10" y="14" width="4" height="7" rx="1"/></svg></div>')
rep('<p class="sub">Schedule A Free Estimate!</p>','<p class="sub">Schedule a free estimate!</p>')
rep('<a href="#book" class="btn btn-red">View Offers</a>','<a href="#book" class="btn btn-red">Get a Free Estimate</a>')
# apart
rep('<h2>What Sets Our Company Apart?</h2>',"<h2>What Sets JB'S Apart?</h2>")
a=s.index('<p>Replace this paragraph');b=s.index('</p>',s.index('<p>Use this second paragraph'))+4
s=s[:a]+'''<p>JB'S Pro Painters LLC is owner-operated by Jonathan Bernal. When you call, you talk to the person who looks at your job, gives you the estimate and stands behind the finish. We paint homes and businesses across the East Valley, inside and out.</p>
    <p>Interior walls and ceilings, stucco exteriors, kitchen cabinets, doors and wood stain, and commercial repaints for restaurants, warehouses and shops. Quality, precision and perfection on every wall. See our <a href="#services">painting services</a> or <a href="#book">request a free estimate</a>.</p>'''+s[b:]
# feature cards text (keep icons)
for old,new in [('<h3>Keep Our Time Commitment</h3>','<h3>Free Estimates</h3>'),('<p>We always show up when we say we will</p>','<p>Every job starts with a free estimate</p>'),
('<h3>Same Day Quotes</h3>','<h3>Owner-Operated</h3>'),('<p>We provide same day written quotes</p>','<p>You talk to Jonathan, the owner, start to finish</p>'),
('<h3>Transparent Communication</h3>','<h3>Licensed &amp; Insured</h3>'),('<p>We give you daily project updates</p>','<p>Peace of mind on every home and business</p>'),
('<h3>All Jobs Are Inspected</h3>','<h3>Prep, Protect, Paint</h3>'),('<p>Every job gets an initial &amp; final inspection</p>','<p>Surfaces prepped and your space covered first</p>'),
('<h3>Same Day Response</h3>','<h3>Homes &amp; Businesses</h3>'),('<p>Same day response when you reach out to us</p>','<p>Interior, exterior, cabinets, doors and commercial</p>'),
('<h3>Long-Lasting Results</h3>','<h3>Quality Finish</h3>'),('<p>Every customer gets a free touch-up kit</p>','<p>Quality, precision and perfection on every wall</p>')]: rep(old,new)
# schedule
a=s.index('<svg class="house"');b=s.index('</svg>',a)+6
s=s[:a]+f'<img class="sched-photo" src="{b64("gdoor-after.jpg",900)}" alt="Garage doors painted by JB\'S Pro Painters" loading="lazy">'+s[b:]
rep('<h2>Schedule Your<br>Estimate Now!</h2>','<h2>Schedule Your<br>Free Estimate</h2>')
rep('<p>Schedule your <b>free</b> in-home quote now,<br>in <b>three minutes or less!</b></p>','<p>Send a few details and <b>Jonathan</b> will get back to you.<br>Or call or text <b>(602) 473-0415</b>.</p>')
rep('<a href="tel:5555550100" class="btn btn-red">Book Free Estimate</a>','''<form class="qf" id="qf" name="quote" method="POST" data-netlify="true" netlify-honeypot="bot"><input type="hidden" name="form-name" value="quote"><label class="hp">Leave empty<input name="bot" tabindex="-1" autocomplete="off"></label>
    <label>Name<input name="name" required autocomplete="name"></label><label>Phone<input name="phone" type="tel" required autocomplete="tel"></label>
    <label>Type of job<select name="job"><option>Interior painting</option><option>Exterior painting</option><option>Cabinet refinishing</option><option>Doors and wood stain</option><option>Commercial</option><option>Not sure yet</option></select></label>
    <button class="btn btn-red" type="submit">Book Free Estimate</button><p id="ok" role="status"></p></form>
  <p class="or">or <a href="tel:+16024730415">call</a> / <a href="sms:+16024730415">text</a> (602) 473-0415</p>''')
# best
rep('<h2>Best Home Services in Your Region</h2>','<h2>Painting Services Across the East Valley</h2>')
rep('<p>Write a short overview here: years in business, the size of your team, and the area you cover. Two or three sentences is plenty.</p>',"<p>JB'S Pro Painters LLC serves Gilbert, Mesa, Chandler, Tempe, Scottsdale, Queen Creek and nearby, for homeowners and businesses alike.</p>")
a=s.index('<ul>',s.index('class="best"'));b=s.index('</ul>',a)+5
s=s[:a]+'''<ul>
      <li>Careful painters: we <b>pay attention to detail</b>, from prep to the last coat, and we are licensed and insured.</li>
      <li>Complete painting: residential, commercial, interior, exterior, cabinets, doors and wood stain.</li>
      <li>Free estimates: tell us about the job and you get a free estimate before any work starts.</li>
    </ul>'''+s[b:]
rep('<p class="q">What types of services do you offer? See below for a list of services and learn more about how we can help with your next project!</p>','<p class="q">What do we paint? See the services below and tap one to start your free estimate.</p>')
# tiles with real photos
a=s.index('<div class="services">');b=s.index('</div>',a)+6
T=[('Exterior Painting','home'),('Interior Painting','bath'),('Commercial Painting','tl'),('Cabinet Painting','kitchen'),('Doors &amp; Wood Stain','door'),('Garage Doors','gdoor')]
s=s[:a]+'<div class="services">\n'+''.join(f'    <a href="#book" class="tile" style="background-image:url({b64(k+"-after.jpg",700)})"><span>{t}</span></a>\n' for t,k in T)+'  </div>'+s[b:]
# testimonials
rep('<div class="logo-ph" title="Your logo"></div>',f'<img src="{b64("logo-sq.jpg")}" alt="">')
rep('<div><b>Excellent</b><small>Your Company</small><span class="stars">4.8 ★★★★★</span><small>Based on 000 reviews</small></div>',"<div><b>JB'S Pro Painters LLC</b><small>Reviews on Facebook</small></div>")
FB='https://www.facebook.com/profile.php?id=61584288311213'
rep('<div class="pill-row"><a class="pill" href="#">See all reviews</a><a class="pill" href="#">Leave a review</a></div>',f'<div class="pill-row"><a class="pill" href="{FB}">See reviews</a><a class="pill" href="{FB}">Leave a review</a></div>')
a=s.index('<div class="review active">');b=s.index('<button class="arrow next"')
s=s[:a]+'''<div class="review active">
        <div class="who"><div class="avatar">K</div><div><b>Kenneth R.</b><small>Facebook review (excerpt)</small></div></div>
        <p>&ldquo;JB&rsquo;S Pro Painters LLC did an outstanding job painting the exterior&hellip;&rdquo;</p>
      </div>
      '''+s[b:]
rep('<a href="#" class="btn btn-red">View More Testimonials</a>',f'<a href="{FB}" class="btn btn-red">View More on Facebook</a>')
# careers -> owner
a=s.index('<section class="careers center">');b=s.index('</section>',a)+10
s=s[:a]+f'''<section class="careers center" id="about">
  <div class="wrap">
    <h2>Meet the Owner</h2>
    <p>Jonathan Bernal runs JB'S Pro Painters LLC himself. He brings care and precision to homes and businesses across the East Valley, inside and out.</p>
    <a href="{TEL}" class="btn btn-black">Call Jonathan</a>
    <figure class="owner"><img src="{b64('owner-new.jpg',900)}" alt="Jonathan Bernal, owner of JB'S Pro Painters LLC" loading="lazy"><figcaption>Jonathan Bernal<small>Owner, JB'S Pro Painters LLC</small></figcaption></figure>
    <p>Quality, precision and perfection on every wall. We want you proud of the result.</p>
  </div>
</section>'''+s[b:]
# footer
a=s.index('<div class="social">');b=s.index('</div>',a)+6
fbsvg=re.search(r'<a href="#" aria-label="Facebook">(<svg.*?</svg>)</a>',s,re.S).group(1)
s=s[:a]+f'<div class="social"><a href="{FB}" aria-label="Facebook">{fbsvg}</a></div>'+s[b:]
rep('<h4>Locations</h4>','<h4>Service Area</h4>')
a=s.index('<div class="locs">');b=s.index('<p class="copy">')
s=s[:a]+f'''<div class="locs" style="grid-template-columns:1fr;max-width:420px">
    <div class="loc"><h5>East Valley, AZ</h5><div class="areas"><span>Gilbert</span><span>Mesa</span><span>Chandler</span><span>Tempe</span><span>Scottsdale</span><span>Queen Creek</span></div><a href="{TEL}">(602) 473-0415</a><a href="mailto:jbspropainters@gmail.com" style="margin-top:4px">jbspropainters@gmail.com</a></div>
  </div>
  '''+s[b:]
rep('<p class="copy">© 2026 Your Company. All rights reserved.</p>',"<p class=\"copy\">© 2026 JB'S Pro Painters LLC. All rights reserved.</p>")
# drawer + bottom nav
rep('<a href="#">Reviews</a>','<a href="#reviews">Reviews</a>');rep('<a href="#">Careers</a>','<a href="#about">Meet the Owner</a>');rep('<a href="#">Contact</a>',f'<a href="{TEL}">Call (602) 473-0415</a>')
rep('<section class="trust center">','<section class="trust center" id="reviews">')
rep('<a href="tel:5555550100"><svg viewBox="0 0 24 24"><path d="M2 5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5zm2 .5V7l8 5 8-5V5.5l-8 5-8-5z"/></svg>Call</a>',f'<a href="{TEL}"><svg viewBox="0 0 24 24"><path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.3 0 .7-.2 1z"/></svg>Call</a>')
# netlify hidden form + submit js; hide carousel arrows when one slide
rep('<body>','<body>\n<form name="quote" data-netlify="true" netlify-honeypot="bot" hidden><input name="form-name"><input name="name"><input name="phone"><input name="job"><input name="bot"></form>')
rep('  show(0);\n</script>','''  show(0);
  if (slides.length < 2) document.querySelectorAll('.arrow,.dots').forEach(el => el.style.display = 'none');
  const qf = document.getElementById('qf'), ok = document.getElementById('ok');
  qf.addEventListener('submit', async e => {
    e.preventDefault(); if (qf.bot.value) return;
    const b = qf.querySelector('button'); b.disabled = true;
    try { const r = await fetch('/', {method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'}, body:new URLSearchParams(new FormData(qf)).toString()}); if (!r.ok) throw 0; ok.textContent = 'Thanks! Jonathan will be in touch soon.'; qf.reset(); }
    catch (_) { ok.textContent = 'Could not send. Please call (602) 473-0415.'; }
    b.disabled = false;
  });
</script>''')
rep("setInterval(() => show(i + 1), 6000);","if (slides.length > 1 && !matchMedia('(prefers-reduced-motion: reduce)').matches) setInterval(() => show(i + 1), 6000);")
out=H.parent/'preview/JBS-clean-base.html';out.write_text(s);print(out.stat().st_size//1024,'KB')
