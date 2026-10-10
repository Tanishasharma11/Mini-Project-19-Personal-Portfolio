
/* ===== CINEMATIC SMOOTH SCROLL ===== */
const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
).matches;

if (window.Lenis && !prefersReducedMotion) {
    new Lenis({
        autoRaf: true,
        anchors: true,
        lerp: 0.08,
        smoothWheel: true,
        wheelMultiplier: 0.9
    });
}

/* ===== MENU SHOW ===== */
const showMenu = (toggleId, navId) => {
    const toggle = document.getElementById(toggleId);
    const nav = document.getElementById(navId);

    if (toggle && nav) {
        toggle.addEventListener('click', () => {
            const isOpen = nav.classList.toggle('show');
            toggle.setAttribute('aria-expanded', String(isOpen));
        });
    }
};

showMenu('nav-toggle', 'nav-menu');

/* ===== REMOVE MENU MOBILE ===== */
const navLinks = document.querySelectorAll('.nav__link');
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu?.classList.remove('show');
        navToggle?.setAttribute('aria-expanded', 'false');
    });
});

/* ===== SCROLL SECTIONS ACTIVE LINK ===== */
const sections = document.querySelectorAll('section[id]');

function scrollActive() {
    let currentSection = '';

    sections.forEach(section => {
        if (section.getBoundingClientRect().top <= 150) {
            currentSection = section.id;
        }
    });

    navLinks.forEach(link => {
        link.classList.toggle(
            'active',
            link.getAttribute('href') === `#${currentSection}`
        );
    });
}

window.addEventListener('scroll', scrollActive, { passive: true });
scrollActive();

/* ===== CINEMATIC SCROLL REVEAL ===== */
if (window.ScrollReveal && !prefersReducedMotion) {
    const sr = ScrollReveal({
        origin: 'bottom',
        distance: '24px',
        duration: 900,
        delay: 80,
        interval: 100,
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
        opacity: 0,
        reset: false,
        mobile: true,
        viewFactor: 0.12
    });

    sr.reveal(
        '.home__data, .home__img, .home__social-icon',
        { interval: 100 }
    );

    sr.reveal('.section-title', {
        distance: '16px',
        duration: 700
    });

    sr.reveal('.about__img, .about__subtitle, .about__text');

    sr.reveal(
        '.skills__subtitle, .skills__text, .skills__img'
    );

    sr.reveal(
        '.skills__data, .work__img, .contact__input',
        { interval: 100 }
    );

    sr.reveal(
        '.contact__button, .footer__title, .footer__social, .footer__copy',
        { distance: '16px', duration: 700 }
    );
}
/*
/*===== MENU SHOW =====*/ 
const showMenu = (toggleId, navId) =>{
    const toggle = document.getElementById(toggleId),
    nav = document.getElementById(navId)

    if(toggle && nav){
        toggle.addEventListener('click', ()=>{
            nav.classList.toggle('show')
        })
    }
}
showMenu('nav-toggle','nav-menu')

/*==================== REMOVE MENU MOBILE ====================*/
const navLink = document.querySelectorAll('.nav__link')

function linkAction(){
    const navMenu = document.getElementById('nav-menu')
    // When we click on each nav__link, we remove the show-menu class
    navMenu.classList.remove('show')
}
navLink.forEach(n => n.addEventListener('click', linkAction))

/*==================== SCROLL SECTIONS ACTIVE LINK ====================*/
const sections = document.querySelectorAll('section[id]')

function scrollActive(){
    const scrollY = window.pageYOffset

    sections.forEach(current =>{
        const sectionHeight = current.offsetHeight
        const sectionTop = current.offsetTop - 50;
        sectionId = current.getAttribute('id')

        if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight){
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.add('active')
        }else{
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.remove('active')
        }
    })
}
window.addEventListener('scroll', scrollActive)

/*===== SCROLL REVEAL ANIMATION =====*/
const sr = ScrollReveal({
    origin: 'top',
    distance: '60px',
    duration: 2000,
    delay: 200,
//     reset: true
});

sr.reveal('.home__data, .about__img, .skills__subtitle, .skills__text',{}); 
sr.reveal('.home__img, .about__subtitle, .about__text, .skills__img',{delay: 400}); 
sr.reveal('.home__social-icon',{ interval: 200}); 
sr.reveal('.skills__data, .work__img, .contact__input',{interval: 200}); 

*/
