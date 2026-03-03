

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

        navMenu.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                navMenu.classList.remove('is-open');
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.setAttribute('aria-label', 'Abrir menú');
            });
        });

        window.addEventListener('resize', function () {
            if (window.matchMedia('(min-width: 769px)').matches) {
                navMenu.classList.remove('is-open');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    /* ----- Smooth scroll ----- */
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

    /* ----- Reveal al hacer scroll ----- */
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

    /* ----- Lista de reproducción ----- */
    var PLAYLIST = [
        { title: 'Pista 1', src: 'assets/audio/background.mp3' },
        { title: 'Pista 2', src: 'assets/audio/track2.mp3' },
        { title: 'Pista 3', src: 'assets/audio/track3.mp3' }
    ];

    var audio = document.getElementById('bg-music');
    var musicPlayer = document.querySelector('.music-player');
    var panel = document.getElementById('playlist-panel');
    var backdrop = document.getElementById('playlist-backdrop');
    var musicToggle = document.getElementById('music-toggle');
    var playlistClose = document.getElementById('playlist-close');
    var playlistNow = document.getElementById('playlist-now');
    var playlistList = document.getElementById('playlist-list');
    var btnPlay = document.getElementById('playlist-play');
    var btnPrev = document.getElementById('playlist-prev');
    var btnNext = document.getElementById('playlist-next');
    var volumeInput = document.getElementById('playlist-volume-input');

    var currentIndex = 0;

    function openPanel() {
        if (!musicPlayer || !panel) return;
        musicPlayer.classList.add('is-open');
        panel.setAttribute('aria-hidden', 'false');
        musicToggle.setAttribute('aria-label', 'Cerrar lista de reproducción');
    }

    function closePanel() {
        if (!musicPlayer || !panel) return;
        musicPlayer.classList.remove('is-open');
        panel.setAttribute('aria-hidden', 'true');
        musicToggle.setAttribute('aria-label', 'Abrir lista de reproducción');
    }

    function loadTrack(index) {
        if (!audio || index < 0 || index >= PLAYLIST.length) return;
        currentIndex = index;
        var track = PLAYLIST[currentIndex];
        audio.src = track.src;
        audio.load();
        updateNowPlaying();
        updateActiveItem();
    }

    function playTrack(index) {
        loadTrack(index);
        audio.play().catch(function () {});
        updatePlayButton(true);
    }

    function updateNowPlaying() {
        if (!playlistNow) return;
        playlistNow.textContent = PLAYLIST[currentIndex].title;
    }

    function updateActiveItem() {
        if (!playlistList) return;
        var items = playlistList.querySelectorAll('li');
        items.forEach(function (li, i) {
            li.classList.toggle('is-active', i === currentIndex);
        });
    }

    function updatePlayButton(playing) {
        if (!btnPlay) return;
        btnPlay.textContent = playing ? '❚❚' : '▶';
        btnPlay.setAttribute('aria-label', playing ? 'Pausar' : 'Reproducir');
    }

    function renderList() {
        if (!playlistList) return;
        playlistList.innerHTML = '';
        PLAYLIST.forEach(function (track, i) {
            var li = document.createElement('li');
            var btn = document.createElement('button');
            btn.type = 'button';
            btn.textContent = track.title;
            btn.addEventListener('click', function () {
                playTrack(i);
            });
            li.appendChild(btn);
            playlistList.appendChild(li);
        });
        updateActiveItem();
    }

    function playNext() {
        var next = (currentIndex + 1) % PLAYLIST.length;
        playTrack(next);
    }

    function playPrev() {
        var prev = currentIndex - 1;
        if (prev < 0) prev = PLAYLIST.length - 1;
        playTrack(prev);
    }

    if (audio && musicPlayer && panel && musicToggle && playlistList) {
        renderList();

        musicToggle.addEventListener('click', function () {
            if (musicPlayer.classList.contains('is-open')) {
                closePanel();
            } else {
                openPanel();
            }
        });

        if (playlistClose) playlistClose.addEventListener('click', closePanel);
        if (backdrop) backdrop.addEventListener('click', closePanel);

        if (btnPlay) {
            btnPlay.addEventListener('click', function () {
                if (audio.paused) {
                    if (!audio.src) playTrack(0);
                    else audio.play().catch(function () {});
                    updatePlayButton(true);
                } else {
                    audio.pause();
                    updatePlayButton(false);
                }
            });
        }

        if (btnPrev) btnPrev.addEventListener('click', playPrev);
        if (btnNext) btnNext.addEventListener('click', playNext);

        audio.addEventListener('play', function () {
            updatePlayButton(true);
        });
        audio.addEventListener('pause', function () {
            updatePlayButton(false);
        });
        audio.addEventListener('ended', function () {
            playNext();
        });

        if (volumeInput && audio) {
            audio.volume = 1;
            function setVolumeBar() {
                volumeInput.style.setProperty('--volume-pct', volumeInput.value + '%');
            }
            volumeInput.addEventListener('input', function () {
                audio.volume = this.value / 100;
                setVolumeBar();
            });
            setVolumeBar();
        }

        updatePlayButton(false);
    }
})();
