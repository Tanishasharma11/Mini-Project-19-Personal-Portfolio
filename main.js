/* =========================================================
   TANISHA'S PROJECTOR PORTFOLIO
   Keeps the original mobile menu behaviour, but changes the
   site from scroll-based sections to four click-driven panels.
   ========================================================= */
(() => {
  const stage = document.getElementById('portfolio-stage');
  if (!stage) return;

  const panels = Array.from(stage.querySelectorAll('[data-panel]'));
  const navLinks = Array.from(document.querySelectorAll('[data-scene-link]'));
  const sceneButtons = Array.from(document.querySelectorAll('.scene-index__button'));
  const sceneNumber = document.getElementById('scene-number');
  const sceneName = document.getElementById('scene-name');
  const navMenu = document.getElementById('nav-menu');
  const navToggle = document.getElementById('nav-toggle');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const sceneInfo = {
    home: { number: '01', name: 'HOME' },
    skills: { number: '02', name: 'SKILLS' },
    work: { number: '03', name: 'PROJECTS' },
    contact: { number: '04', name: 'CONTACT' }
  };

  const sceneOrder = Object.keys(sceneInfo);
  let activeScene = 'home';
  let transitionTimer = null;

  function closeMobileMenu() {
    navMenu?.classList.remove('show');
    navToggle?.setAttribute('aria-expanded', 'false');
  }

  function showScene(scene, options = {}) {
    if (!sceneInfo[scene] || scene === activeScene) {
      closeMobileMenu();
      return;
    }

    const previousIndex = sceneOrder.indexOf(activeScene);
    const nextIndex = sceneOrder.indexOf(scene);
    const direction = nextIndex > previousIndex ? 1 : -1;
    const outgoing = panels.find(panel => panel.dataset.panel === activeScene);
    const incoming = panels.find(panel => panel.dataset.panel === scene);

    if (!incoming) return;
    if (transitionTimer) window.clearTimeout(transitionTimer);

    // Update the beam direction and section labels.
    stage.dataset.scene = scene;
    sceneNumber.textContent = sceneInfo[scene].number;
    sceneName.textContent = sceneInfo[scene].name;

    // Update both header navigation and numbered scene controls.
    navLinks.forEach(link => {
      const isActive = link.dataset.sceneLink === scene;
      if (link.classList.contains('nav__link')) {
        link.classList.toggle('active', isActive);
        if (isActive) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
      }
    });
    sceneButtons.forEach(button => {
      const isActive = button.dataset.sceneLink === scene;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });

    if (outgoing) {
      outgoing.classList.remove('is-active');
      outgoing.classList.add(direction > 0 ? 'is-leaving-left' : 'is-leaving-right');
      outgoing.setAttribute('aria-hidden', 'true');
    }

    incoming.hidden = false;
    incoming.setAttribute('aria-hidden', 'false');
    incoming.classList.remove('is-leaving-left', 'is-leaving-right');
    incoming.classList.remove('is-active');

    // Force layout so the incoming panel starts at its entry position.
    void incoming.offsetWidth;
    requestAnimationFrame(() => incoming.classList.add('is-active'));

    activeScene = scene;
    closeMobileMenu();

    if (options.updateHash !== false) {
      history.replaceState(null, '', `#${scene === 'work' ? 'work' : scene}`);
    }

    const wait = reducedMotion ? 0 : 650;
    transitionTimer = window.setTimeout(() => {
      panels.forEach(panel => {
        const isCurrent = panel.dataset.panel === activeScene;
        panel.hidden = !isCurrent;
        panel.classList.remove('is-leaving-left', 'is-leaving-right');
        panel.setAttribute('aria-hidden', String(!isCurrent));
      });
      incoming.hidden = false;
      incoming.classList.add('is-active');
    }, wait);
  }

  // All four sections use the same navigation handler.
  navLinks.forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      showScene(link.dataset.sceneLink);
    });
  });

  sceneButtons.forEach(button => {
    button.addEventListener('click', () => showScene(button.dataset.sceneLink));
  });

  // Original responsive menu interaction retained.
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('show');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  // Keyboard support: left/right arrows switch scenes; Home/End jump to ends.
  document.addEventListener('keydown', event => {
    const target = event.target;
    if (target && (target.matches('input, textarea, select') || target.isContentEditable)) return;

    const currentIndex = sceneOrder.indexOf(activeScene);
    let nextIndex = currentIndex;
    if (event.key === 'ArrowRight') nextIndex = Math.min(sceneOrder.length - 1, currentIndex + 1);
    else if (event.key === 'ArrowLeft') nextIndex = Math.max(0, currentIndex - 1);
    else if (event.key === 'Home' && !event.altKey && !event.ctrlKey && !event.metaKey) nextIndex = 0;
    else if (event.key === 'End' && !event.altKey && !event.ctrlKey && !event.metaKey) nextIndex = sceneOrder.length - 1;
    else return;

    if (nextIndex !== currentIndex) {
      event.preventDefault();
      showScene(sceneOrder[nextIndex]);
    }
  });

  // Contact form: compose a mailto message without pretending to submit to a server.
  const contactForm = document.getElementById('contact-form');
  contactForm?.addEventListener('submit', event => {
    event.preventDefault();
    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const message = document.getElementById('contact-message').value.trim();
    const recipient = 'YOUR_EMAIL_HERE'; // Replace with your email address before publishing.
    if (recipient === 'YOUR_EMAIL_HERE') {
      window.alert('Please add your email address in main.js before using the contact form.');
      return;
    }
    const subject = encodeURIComponent(`Portfolio message from ${name}`);
    const body = encodeURIComponent(`${message}\n\nFrom: ${name}\nEmail: ${email}`);
    window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
  });

  // Resume link reminder until a real PDF URL is configured.
  document.getElementById('resume-link')?.addEventListener('click', event => {
    const href = event.currentTarget.getAttribute('href');
    if (!href || href === '#') {
      event.preventDefault();
      window.alert('Replace the resume link in index.html with your resume PDF path or URL.');
    }
  });

  // Direct links such as index.html#skills open the requested panel on load.
  const requestedScene = window.location.hash.replace('#', '');
  const initialScene = requestedScene === 'work' ? 'work' : requestedScene;
  if (sceneInfo[initialScene]) {
    panels.forEach(panel => {
      const isCurrent = panel.dataset.panel === initialScene;
      panel.hidden = !isCurrent;
      panel.classList.toggle('is-active', isCurrent);
      panel.setAttribute('aria-hidden', String(!isCurrent));
    });
    activeScene = initialScene;
    stage.dataset.scene = initialScene;
    sceneNumber.textContent = sceneInfo[initialScene].number;
    sceneName.textContent = sceneInfo[initialScene].name;
    navLinks.forEach(link => {
      if (link.classList.contains('nav__link')) {
        const isActive = link.dataset.sceneLink === initialScene;
        link.classList.toggle('active', isActive);
        if (isActive) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
      }
    });
    sceneButtons.forEach(button => {
      const isActive = button.dataset.sceneLink === initialScene;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });
  }

  document.getElementById('current-year').textContent = new Date().getFullYear();
})();
