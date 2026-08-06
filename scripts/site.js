/* Yahia Al-Tarhouni — language, motion and contact interactions */
(function () {
  'use strict';

  var root = document.documentElement;
  var body = document.body;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var lang = 'en';

  function setLanguage(code) {
    lang = code === 'ar' ? 'ar' : 'en';
    var isArabic = lang === 'ar';
    root.lang = lang;
    root.dir = isArabic ? 'rtl' : 'ltr';
    document.title = isArabic
      ? 'يحيى الطرهوني — النمو التجاري وتطوير الأعمال'
      : 'Yahia Al-Tarhouni — Commercial Growth & Business Development';

    var nodes = document.querySelectorAll('[data-' + lang + ']');
    for (var i = 0; i < nodes.length; i += 1) {
      var value = nodes[i].getAttribute('data-' + lang);
      if (value !== null) nodes[i].innerHTML = value;
    }

    var label = document.getElementById('langLabel');
    var button = document.getElementById('langBtn');
    if (label) label.textContent = isArabic ? 'EN' : 'ع';
    if (button) button.setAttribute('aria-label', isArabic ? 'Switch to English' : 'التبديل إلى العربية');

    try { localStorage.setItem('yat-language', lang); } catch (error) { /* storage is optional */ }
  }

  var savedLanguage = null;
  try { savedLanguage = localStorage.getItem('yat-language'); } catch (error) { /* storage is optional */ }
  if (!savedLanguage && /^ar\b/i.test(navigator.language || '')) savedLanguage = 'ar';
  setLanguage(savedLanguage === 'ar' ? 'ar' : 'en');

  var languageButton = document.getElementById('langBtn');
  if (languageButton) {
    languageButton.addEventListener('click', function () {
      setLanguage(lang === 'en' ? 'ar' : 'en');
    });
  }

  function markReady() {
    if (body.classList.contains('ready')) return;
    body.classList.add('ready');
    window.setTimeout(function () {
      var boot = document.getElementById('boot');
      if (boot) boot.hidden = true;
    }, reduceMotion ? 0 : 1000);
  }

  if (document.readyState === 'complete') markReady();
  else window.addEventListener('load', markReady, { once: true });
  window.setTimeout(markReady, 1200);

  var menuButton = document.getElementById('menuBtn');
  var mobileNav = document.getElementById('mobileNav');

  function closeMenu() {
    body.classList.remove('menu-open');
    if (menuButton) {
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', lang === 'ar' ? 'فتح القائمة' : 'Open menu');
    }
  }

  if (menuButton) {
    menuButton.addEventListener('click', function () {
      var isOpen = body.classList.toggle('menu-open');
      menuButton.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      menuButton.setAttribute('aria-label', isOpen
        ? (lang === 'ar' ? 'إغلاق القائمة' : 'Close menu')
        : (lang === 'ar' ? 'فتح القائمة' : 'Open menu'));
    });
  }
  if (mobileNav) mobileNav.addEventListener('click', function (event) { if (event.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', function (event) { if (event.key === 'Escape') closeMenu(); });

  var revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var element = entry.target;
        var siblings = element.parentElement ? Array.prototype.slice.call(element.parentElement.children) : [];
        var index = siblings.indexOf(element);
        element.style.transitionDelay = Math.min(Math.max(index, 0), 5) * 65 + 'ms';
        element.classList.add('in');
        revealObserver.unobserve(element);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });
    for (var r = 0; r < revealItems.length; r += 1) revealObserver.observe(revealItems[r]);
  } else {
    for (var q = 0; q < revealItems.length; q += 1) revealItems[q].classList.add('in');
  }

  var header = document.getElementById('header');
  var progress = document.getElementById('progress');
  var mobileDock = document.getElementById('mobileDock');
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav a'));
  var navSections = navLinks.map(function (link) { return document.querySelector(link.getAttribute('href')); });
  var scrollQueued = false;

  function updateScrollState() {
    var scrollY = window.scrollY || document.documentElement.scrollTop;
    var scrollable = document.documentElement.scrollHeight - window.innerHeight;
    if (header) header.classList.toggle('solid', scrollY > 28);
    if (progress) progress.style.width = (scrollable > 0 ? (scrollY / scrollable) * 100 : 0) + '%';
    if (mobileDock) mobileDock.classList.toggle('on', scrollY > window.innerHeight * 0.65);

    var activeIndex = -1;
    for (var i = 0; i < navSections.length; i += 1) {
      if (navSections[i] && navSections[i].getBoundingClientRect().top <= 160) activeIndex = i;
    }
    for (var n = 0; n < navLinks.length; n += 1) navLinks[n].classList.toggle('active', n === activeIndex);
    scrollQueued = false;
  }

  window.addEventListener('scroll', function () {
    if (!scrollQueued) {
      scrollQueued = true;
      window.requestAnimationFrame(updateScrollState);
    }
  }, { passive: true });
  updateScrollState();

  if (finePointer && !reduceMotion) {
    var glow = document.getElementById('cursorGlow');
    body.classList.add('has-pointer');
    window.addEventListener('pointermove', function (event) {
      if (!glow) return;
      glow.style.left = event.clientX + 'px';
      glow.style.top = event.clientY + 'px';
    }, { passive: true });

    var floating = document.querySelector('[data-depth]');
    window.addEventListener('pointermove', function (event) {
      if (!floating) return;
      var bounds = floating.getBoundingClientRect();
      var depth = parseFloat(floating.getAttribute('data-depth')) || 0.02;
      var x = (event.clientX - (bounds.left + bounds.width / 2)) * depth;
      var y = (event.clientY - (bounds.top + bounds.height / 2)) * depth;
      floating.style.transform = 'translate3d(' + x.toFixed(2) + 'px,' + y.toFixed(2) + 'px,0)';
    }, { passive: true });
  }

  var toast = document.getElementById('toast');
  var toastTimer;
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('on');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () { toast.classList.remove('on'); }, 2600);
  }

  var copyButton = document.getElementById('copyBtn');
  if (copyButton) {
    copyButton.addEventListener('click', function () {
      var phone = '+966535401284';
      var success = function () { showToast(lang === 'ar' ? 'تم نسخ الرقم ✓' : 'Number copied ✓'); };
      var fallback = function () {
        var field = document.createElement('textarea');
        field.value = phone;
        field.setAttribute('readonly', '');
        field.style.position = 'fixed';
        field.style.opacity = '0';
        document.body.appendChild(field);
        field.select();
        try { document.execCommand('copy'); success(); } catch (error) { showToast(phone); }
        document.body.removeChild(field);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(phone).then(success).catch(fallback);
      else fallback();
    });
  }

  var vCard = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    'N:Al-Tarhouni;Yahia;Ahmed Mahmoud Ahmed;;',
    'FN:Yahia Ahmed Al-Tarhouni',
    'TITLE:Senior Development Manager',
    'ORG:HD Guard Trading Company',
    'TEL;TYPE=CELL,VOICE:+966535401284',
    'ADR;TYPE=WORK:;;;;;;Saudi Arabia',
    'NOTE:Commercial growth, business development, strategic partnerships and performance marketing.',
    'END:VCARD'
  ].join('\r\n');

  var vCardLinks = document.querySelectorAll('a[download$=".vcf"]');
  for (var v = 0; v < vCardLinks.length; v += 1) {
    vCardLinks[v].addEventListener('click', function (event) {
      if (window.location.protocol !== 'file:') return;
      event.preventDefault();
      var blob = new Blob([vCard], { type: 'text/vcard;charset=utf-8' });
      var url = URL.createObjectURL(blob);
      var link = document.createElement('a');
      link.href = url;
      link.download = 'Yahia-Al-Tarhouni.vcf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    });
  }
})();
