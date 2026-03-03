/**
 * Música — Landing
 * Menú móvil, smooth scroll y revelado al scroll (vanilla JS)
 */

(function () {
    'use strict';

    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    /* ----- Menú móvil ----- */
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function () {
            const isOpen = navMenu.classList.toggle('is-open');
            navToggle.setAttribute('aria-expanded', isOpen);
            navToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
        });

        // Cerrar menú al hacer clic en un enlace (navegación por anclas)
        navMenu.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                navMenu.classList.remove('is-open');
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.setAttribute('aria-label', 'Abrir menú');
            });
        });

        // Cerrar menú al redimensionar a desktop
        window.addEventListener('resize', function () {
            if (window.matchMedia('(min-width: 769px)').matches) {
                navMenu.classList.remove('is-open');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    /* ----- Smooth scroll con offset por el header fijo ----- */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    /* ----- Reveal al hacer scroll (Intersection Observer) ----- */
    var revealSelectors = ['.feature-card', '.content-block', '.stack-card'];
    var revealElements = [];
    revealSelectors.forEach(function (sel) {
        document.querySelectorAll(sel).forEach(function (el) {
            el.classList.add('reveal');
            revealElements.push(el);
        });
    });

    if (revealElements.length && 'IntersectionObserver' in window) {
        var observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('reveal-visible');
                    }
                });
            },
            { rootMargin: '0px 0px -40px 0px', threshold: 0.1 }
        );
        revealElements.forEach(function (el) {
            observer.observe(el);
        });
    } else {
        revealElements.forEach(function (el) {
            el.classList.add('reveal-visible');
        });
    }

    /* ----- Música de fondo ----- */
    var bgMusic = document.getElementById('bg-music');
    var musicToggle = document.getElementById('music-toggle');
    var musicPlayer = document.querySelector('.music-player');

    if (bgMusic && musicToggle && musicPlayer) {
        function updateMusicButton() {
            var playing = !bgMusic.paused;
            musicPlayer.classList.toggle('is-playing', playing);
            musicToggle.setAttribute('aria-label', playing ? 'Pausar música de fondo' : 'Reproducir música de fondo');
        }

        musicToggle.addEventListener('click', function () {
            if (bgMusic.paused) {
                bgMusic.play().catch(function () { /* navegador puede bloquear autoplay */ });
            } else {
                bgMusic.pause();
            }
            updateMusicButton();
        });

        bgMusic.addEventListener('play', updateMusicButton);
        bgMusic.addEventListener('pause', updateMusicButton);
    }
})();
