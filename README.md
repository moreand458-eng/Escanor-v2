<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ESCANOR BOT</title>
<link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;700;900&family=Share+Tech+Mono&display=swap" rel="stylesheet">
<style>
  :root {
    --cyan: #00f5ff;
    --red: #ff003c;
    --gold: #ffd700;
    --dark: #020408;
    --dark2: #050d14;
    --dark3: #0a1628;
    --glow-cyan: 0 0 10px #00f5ff, 0 0 30px #00f5ff44;
    --glow-red: 0 0 10px #ff003c, 0 0 30px #ff003c44;
    --glow-gold: 0 0 10px #ffd700, 0 0 30px #ffd70044;
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    background: var(--dark);
    color: #c8d8e8;
    font-family: 'Tajawal', sans-serif;
    overflow-x: hidden;
    line-height: 1.7;
  }

  /* ── شبكة الخلفية ── */
  body::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image:
      linear-gradient(rgba(0,245,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,245,255,0.03) 1px, transparent 1px);
    background-size: 50px 50px;
    pointer-events: none;
    z-index: 0;
  }

  /* ── scan line ── */
  body::after {
    content: '';
    position: fixed;
    top: -100%;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--cyan), transparent);
    animation: scan 6s linear infinite;
    pointer-events: none;
    z-index: 999;
    opacity: 0.4;
  }

  @keyframes scan {
    0% { top: -2px; }
    100% { top: 100%; }
  }

  .container {
    max-width: 860px;
    margin: 0 auto;
    padding: 40px 20px;
    position: relative;
    z-index: 1;
  }

  /* ── هيدر ── */
  .hero {
    text-align: center;
    padding: 60px 0 40px;
    position: relative;
  }

  .hero-img-wrapper {
    position: relative;
    display: inline-block;
    margin-bottom: 30px;
  }

  .hero-img-wrapper::before,
  .hero-img-wrapper::after {
    content: '';
    position: absolute;
    inset: -3px;
    border-radius: 12px;
    background: linear-gradient(45deg, var(--cyan), var(--red), var(--gold), var(--cyan));
    background-size: 300%;
    animation: borderAnim 4s linear infinite;
    z-index: -1;
  }

  .hero-img-wrapper::after {
    filter: blur(12px);
    opacity: 0.5;
  }

  @keyframes borderAnim {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }

  .hero img {
    width: 220px;
    height: 220px;
    object-fit: cover;
    border-radius: 10px;
    display: block;
    filter: brightness(0.9) contrast(1.1);
  }

  .hero-title {
    font-family: 'Share Tech Mono', monospace;
    font-size: 3.2rem;
    letter-spacing: 8px;
    color: var(--cyan);
    text-shadow: var(--glow-cyan);
    animation: flicker 5s infinite;
  }

  @keyframes flicker {
    0%,96%,100% { opacity: 1; }
    97% { opacity: 0.4; }
    98% { opacity: 1; }
    99% { opacity: 0.2; }
  }

  .hero-sub {
    font-size: 0.95rem;
    color: #4a7a9b;
    letter-spacing: 3px;
    font-family: 'Share Tech Mono', monospace;
    margin-top: 6px;
  }

  .hero-sub span {
    color: var(--red);
    text-shadow: var(--glow-red);
  }

  /* ── أزرار الروابط ── */
  .badges {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
    margin: 28px 0;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 20px;
    border: 1px solid;
    font-family: 'Tajawal', sans-serif;
    font-size: 0.85rem;
    font-weight: 700;
    text-decoration: none;
    transition: all 0.3s;
    position: relative;
    clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%);
  }

  .badge-cyan {
    border-color: var(--cyan);
    color: var(--cyan);
    background: rgba(0,245,255,0.05);
  }
  .badge-cyan:hover {
    background: rgba(0,245,255,0.15);
    box-shadow: var(--glow-cyan);
  }

  .badge-green {
    border-color: #00ff88;
    color: #00ff88;
    background: rgba(0,255,136,0.05);
  }
  .badge-green:hover {
    background: rgba(0,255,136,0.15);
    box-shadow: 0 0 10px #00ff88, 0 0 30px #00ff8844;
  }

  .badge-gold {
    border-color: var(--gold);
    color: var(--gold);
    background: rgba(255,215,0,0.05);
  }
  .badge-gold:hover {
    background: rgba(255,215,0,0.15);
    box-shadow: var(--glow-gold);
  }

  /* ── فاصل ── */
  .divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 40px 0 20px;
    color: var(--cyan);
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.75rem;
    letter-spacing: 2px;
  }

  .divider::before, .divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--cyan), transparent);
  }

  /* ── بطاقات ── */
  .card {
    background: var(--dark2);
    border: 1px solid rgba(0,245,255,0.15);
    border-right: 3px solid var(--cyan);
    padding: 28px 32px;
    margin-bottom: 20px;
    position: relative;
    overflow: hidden;
    transition: border-color 0.3s, box-shadow 0.3s;
  }

  .card::before {
    content: '';
    position: absolute;
    top: 0; right: 0;
    width: 60px; height: 60px;
    background: radial-gradient(circle at top right, rgba(0,245,255,0.08), transparent 70%);
  }

  .card:hover {
    border-right-color: var(--gold);
    box-shadow: inset 0 0 30px rgba(0,245,255,0.03), 4px 0 0 var(--gold);
  }

  .card-red {
    border-right-color: var(--red);
  }
  .card-red:hover {
    border-right-color: var(--red);
    box-shadow: inset 0 0 30px rgba(255,0,60,0.03), 4px 0 0 var(--red);
  }

  .card-gold {
    border-right-color: var(--gold);
  }

  .section-title {
    font-size: 1.3rem;
    font-weight: 900;
    color: #fff;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .section-title .icon {
    color: var(--cyan);
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.9rem;
    background: rgba(0,245,255,0.1);
    border: 1px solid rgba(0,245,255,0.3);
    padding: 3px 10px;
  }

  /* ── المميزات ── */
  .features-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .feature-item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 10px 14px;
    background: var(--dark3);
    border: 1px solid rgba(0,245,255,0.08);
    font-size: 0.9rem;
    transition: background 0.2s;
  }

  .feature-item:hover {
    background: rgba(0,245,255,0.05);
  }

  .feature-item::before {
    content: '◈';
    color: var(--cyan);
    font-size: 0.7rem;
    margin-top: 4px;
    flex-shrink: 0;
  }

  /* ── الكود ── */
  .code-block {
    background: #000;
    border: 1px solid rgba(0,245,255,0.2);
    padding: 20px 24px;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.82rem;
    line-height: 1.9;
    position: relative;
    overflow-x: auto;
  }

  .code-block::before {
    content: 'BASH';
    position: absolute;
    top: 8px;
    left: 16px;
    color: var(--cyan);
    font-size: 0.7rem;
    opacity: 0.6;
    letter-spacing: 2px;
  }

  .code-block .prompt { color: var(--red); }
  .code-block .cmd { color: var(--cyan); }
  .code-block .comment { color: #3a5a6a; }

  /* ── الدعم ── */
  .support-links {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .support-link {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 18px;
    background: var(--dark3);
    border: 1px solid rgba(0,245,255,0.1);
    text-decoration: none;
    transition: all 0.3s;
    color: #c8d8e8;
  }

  .support-link:hover {
    background: rgba(0,245,255,0.06);
    border-color: var(--cyan);
    padding-right: 26px;
  }

  .support-link .link-label {
    font-weight: 700;
    color: var(--cyan);
    font-size: 0.9rem;
  }

  .support-link .link-arrow {
    color: var(--red);
    font-family: 'Share Tech Mono', monospace;
  }

  /* ── هوستنج ── */
  .host-card {
    display: flex;
    align-items: center;
    gap: 20px;
    background: var(--dark3);
    border: 1px solid rgba(255,215,0,0.15);
    padding: 20px 24px;
    margin-bottom: 16px;
  }

  .host-card img {
    width: 70px;
    height: 70px;
    object-fit: cover;
    border: 1px solid rgba(255,215,0,0.3);
    flex-shrink: 0;
  }

  .host-info { flex: 1; }

  .host-name {
    font-weight: 900;
    color: var(--gold);
    font-size: 1.1rem;
    text-shadow: var(--glow-gold);
  }

  .host-desc {
    font-size: 0.85rem;
    color: #6a8a9a;
    margin-top: 4px;
  }

  .discount-tag {
    display: inline-block;
    background: rgba(255,215,0,0.1);
    border: 1px solid var(--gold);
    color: var(--gold);
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.8rem;
    padding: 3px 12px;
    margin-top: 8px;
    letter-spacing: 2px;
  }

  /* ── فوتر ── */
  .footer {
    text-align: center;
    padding: 50px 0 30px;
    position: relative;
  }

  .footer-line {
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--cyan), var(--red), transparent);
    margin-bottom: 28px;
  }

  .footer-title {
    font-family: 'Share Tech Mono', monospace;
    color: var(--cyan);
    font-size: 1.4rem;
    letter-spacing: 6px;
    text-shadow: var(--glow-cyan);
    margin-bottom: 8px;
  }

  .footer-copy {
    font-size: 0.8rem;
    color: #2a4a5a;
    font-family: 'Share Tech Mono', monospace;
    letter-spacing: 1px;
  }

  .corner-tag {
    position: absolute;
    top: -10px;
    right: 20px;
    background: var(--dark);
    color: var(--red);
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.65rem;
    padding: 2px 10px;
    border: 1px solid var(--red);
    letter-spacing: 2px;
  }

  @media (max-width: 600px) {
    .hero-title { font-size: 2.2rem; letter-spacing: 4px; }
    .features-grid { grid-template-columns: 1fr; }
    .host-card { flex-direction: column; text-align: center; }
    .card { padding: 20px; }
  }
</style>
</head>
<body>

<div class="container">

  <!-- ── هيدر ── -->
  <div class="hero">
    <div class="hero-img-wrapper">
      <img src="https://i.postimg.cc/HxjS4qx2/aa58a61ac0b2d8c8d768ff8b86edd273.jpg" alt="ESCANOR BOT">
    </div>
    <div class="hero-title">ESCANOR</div>
    <div class="hero-sub">⟨ بوت واتساب متطور <span>//</span> يعمل على إطار EsewSub ⟩</div>

    <div class="badges">
      <a href="https://github.com/moreand458-eng" class="badge badge-cyan" target="_blank">
        ⌗ GitHub
      </a>
      <a href="https://wa.me/201092178171" class="badge badge-green" target="_blank">
        ◈ واتساب المطور
      </a>
      <a href="https://whatsapp.com/channel/0029VbBbvWcJ3jv1T55BmR0f" class="badge badge-gold" target="_blank">
        ⚡ القناة الرسمية
      </a>
    </div>
  </div>

  <!-- ── المميزات ── -->
  <div class="divider">[ المـيـزات ]</div>

  <div class="card">
    <div class="corner-tag">v2.0</div>
    <div class="section-title">
      <span class="icon">01</span>
      مميزات البوت
    </div>
    <div class="features-grid">
      <div class="feature-item">بوت خفيف وسريع الاستجابة</div>
      <div class="feature-item">صيانة مستمرة ودعم فني</div>
      <div class="feature-item">يدعم الأزرار والقوائم التفاعلية</div>
      <div class="feature-item">يدعم تحميل من منصات متعددة</div>
      <div class="feature-item">ميزات بوت متقدمة</div>
      <div class="feature-item">سهل التعديل والتخصيص</div>
    </div>
  </div>

  <!-- ── التثبيت ── -->
  <div class="divider">[ التـثـبـيـت ]</div>

  <div class="card card-red">
    <div class="corner-tag">TERMUX</div>
    <div class="section-title">
      <span class="icon" style="color:var(--red);background:rgba(255,0,60,0.1);border-color:rgba(255,0,60,0.3);">02</span>
      تثبيت على Termux — أندرويد
    </div>
    <div class="code-block">
      <br>
      <span class="prompt">$</span> <span class="cmd">termux-setup-storage</span><br>
      <span class="prompt">$</span> <span class="cmd">pkg update -y && pkg upgrade -y</span><br>
      <span class="prompt">$</span> <span class="cmd">pkg install git nodejs -y</span><br>
      <span class="prompt">$</span> <span class="cmd">git clone https://github.com/deveni0/Pomni-AI.git</span><br>
      <span class="prompt">$</span> <span class="cmd">cd Pomni-AI</span><br>
      <span class="prompt">$</span> <span class="cmd">npm install</span><br>
      <span class="prompt">$</span> <span class="cmd">npm start</span>
    </div>
  </div>

  <!-- ── الاستضافة ── -->
  <div class="divider">[ الاسـتـضـافـة ]</div>

  <div class="card card-gold">
    <div class="corner-tag">HOSTING</div>
    <div class="section-title">
      <span class="icon" style="color:var(--gold);background:rgba(255,215,0,0.1);border-color:rgba(255,215,0,0.3);">03</span>
      استضافة موصى بها
    </div>
    <div class="host-card">
      <img src="https://b.top4top.io/p_3725xw4y21.jpg" alt="Cavirox">
      <div class="host-info">
        <div class="host-name">Cavirox Hosting</div>
        <div class="host-desc">استضافة موثوقة وسريعة لتشغيل البوت بشكل مستمر</div>
        <div class="discount-tag">كود الخصم : veni</div>
      </div>
    </div>
    <div class="badges" style="justify-content:flex-start; margin:10px 0 0;">
      <a href="https://cavirox.com" class="badge badge-gold" target="_blank">⌗ الموقع الرسمي</a>
      <a href="https://wa.me/201092178171?text=عند+مشكله" class="badge badge-cyan" target="_blank">◈ تواصل للدعم</a>
    </div>
  </div>

  <!-- ── الدعم ── -->
  <div class="divider">[ الـدعـم ]</div>

  <div class="card">
    <div class="corner-tag">SUPPORT</div>
    <div class="section-title">
      <span class="icon">04</span>
      تواصل معنا
    </div>
    <div class="support-links">
      <a href="https://wa.me/201092178171" class="support-link" target="_blank">
        <span class="link-label">◈ المطور مباشرة</span>
        <span>wa.me/201092178171</span>
        <span class="link-arrow">←</span>
      </a>
      <a href="https://whatsapp.com/channel/0029VbBbvWcJ3jv1T55BmR0f" class="support-link" target="_blank">
        <span class="link-label">⚡ القناة الرسمية</span>
        <span>WhatsApp Channel</span>
        <span class="link-arrow">←</span>
      </a>
      <a href="https://chat.whatsapp.com/FNqQjBXDDcn5SnLBieC6pj?mode=gi_t" class="support-link" target="_blank">
        <span class="link-label">⌗ مجتمع البوت</span>
        <span>WhatsApp Community</span>
        <span class="link-arrow">←</span>
      </a>
    </div>
  </div>

  <!-- ── فوتر ── -->
  <div class="footer">
    <div class="footer-line"></div>
    <div class="footer-title">ESCANOR BOT</div>
    <div class="footer-copy">© 2026 ESCANOR — جميع الحقوق محفوظة</div>
    <div class="footer-copy" style="margin-top:6px; color:#1a3a4a;">
      صُنع بـ ❤️ بواسطة <a href="https://github.com/moreand458-eng" style="color:var(--cyan); text-decoration:none;">ESCANOR Owner</a>
    </div>
  </div>

</div>
</body>
</html>

   [Installation](#-installation) • [Support](#-support) • [Features](#-features) • [Hosting](#-hosting)
</div>

---

# 🌹 Features

- ✅ simple bot
- ✅ Ongoing maintenance 
- ✅ Supports buttons
- ✅ Supports downloads 
- ✅ It supports advanced bot features
- ✅ Very easy to modify 
- ✅ Very fast bot

---

# 🚀 Installation

### Termux (Android)

```bash
termux-setup-storage
pkg update -y && pkg upgrade -y
pkg install git nodejs -y
git clone https://github.com/deveni0/Pomni-AI.git
cd Pomni-AI
npm install
npm start
```

---


# 🌐 Hosting 

## Cavirox Hosting 

<div align="center">
  <img src="https://b.top4top.io/p_3725xw4y21.jpg" alt="IMAGE" width="200"/>

<h4>

**For support, contact the developer [here](https://wa.me/201092178171?text=عند+مشكله)**  
**Discount code:** `veni`

</h4>

[![Website](https://img.shields.io/badge/Website-Cavirox-orange?style=for-the-badge&logo=website)](https://cavirox.com)
[![WhatsApp](https://img.shields.io/badge/WhatsApp-Channel-blue?style=for-the-badge&logo=whatsapp)](https://whatsapp.com/channel/0029VbBbvWcJ3jv1T55BmR0f)
 

</div>


---

# 👤 support

- Owner: [click](https://wa.me/201092178171)
- Group: [Join here](https://whatsapp.com/channel/0029VbBbvWcJ3jv1T55BmR0f)
- Community: [Join here](https://chat.whatsapp.com/FNqQjBXDDcn5SnLBieC6pj?mode=gi_t)


---

<div align="center">

**Made with ❤️ by [ESCANOR Owner](https://github.com/moreand458-eng)**

**© 2026 Escanor-bot- All Rights Reserved**

</div>
