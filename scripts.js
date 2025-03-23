// scripts.js
document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const settingsBtn = document.querySelector('.settings-btn');
    const settingsModal = document.querySelector('.settings-modal');
    const closeBtn = document.querySelector('.close-btn');
    const resetBtn = document.querySelector('.reset-btn');
    const fontBtns = document.querySelectorAll('.toggle-btn[data-font]');
    const densityBtns = document.querySelectorAll('.toggle-btn[data-density]');
    const animationBtns = document.querySelectorAll('.toggle-btn[data-animation]');
    const spacingBtns = document.querySelectorAll('.toggle-btn[data-spacing]');
    const soundBtns = document.querySelectorAll('.toggle-btn[data-sound]');
    const clickSound = document.getElementById('click-sound');
    const hoverSound = document.getElementById('hover-sound');

    // Load saved settings
    const savedFont = localStorage.getItem('fontSize') || 'medium';
    const savedDensity = localStorage.getItem('density') || 'spacious';
    const savedAnimation = localStorage.getItem('animation') || 'on';
    const savedSpacing = localStorage.getItem('spacing') || 'normal';
    const savedSound = localStorage.getItem('sound') || 'on';
    applySettings(savedFont, savedDensity, savedAnimation, savedSpacing, savedSound);

    // Flag to track if audio is unlocked
    let isAudioUnlocked = false;

    // Function to unlock audio on first interaction
    function unlockAudio() {
        if (!isAudioUnlocked) {
            clickSound.play().then(() => {
                console.log('Audio unlocked successfully');
                isAudioUnlocked = true;
            }).catch(error => {
                console.error('Audio unlock failed:', error);
            });
            // Remove this listener after first interaction
            document.removeEventListener('click', unlockAudio);
        }
    }

    // Add global click listener to unlock audio
    document.addEventListener('click', unlockAudio);

    // Open settings
    settingsBtn.addEventListener('click', () => {
        settingsModal.style.display = 'flex';
        playSound(clickSound);
    });

    // Close settings
    closeBtn.addEventListener('click', () => {
        settingsModal.style.display = 'none';
        playSound(clickSound);
    });

    // Font size toggle
    fontBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const newFont = btn.dataset.font;
            applySettings(newFont, savedDensity, savedAnimation, savedSpacing, savedSound);
            localStorage.setItem('fontSize', newFont);
            playSound(clickSound);
        });
    });

    // Density toggle
    densityBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const newDensity = btn.dataset.density;
            applySettings(savedFont, newDensity, savedAnimation, savedSpacing, savedSound);
            localStorage.setItem('density', newDensity);
            playSound(clickSound);
        });
    });

    // Animation toggle
    animationBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const newAnimation = btn.dataset.animation;
            applySettings(savedFont, savedDensity, newAnimation, savedSpacing, savedSound);
            localStorage.setItem('animation', newAnimation);
            playSound(clickSound);
        });
    });

    // Spacing toggle
    spacingBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const newSpacing = btn.dataset.spacing;
            applySettings(savedFont, savedDensity, savedAnimation, newSpacing, savedSound);
            localStorage.setItem('spacing', newSpacing);
            playSound(clickSound);
        });
    });

    // Sound toggle
    soundBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const newSound = btn.dataset.sound;
            applySettings(savedFont, savedDensity, savedAnimation, savedSpacing, newSound);
            localStorage.setItem('sound', newSound);
            playSound(clickSound);
        });
    });

    // Reset to default
    resetBtn.addEventListener('click', () => {
        applySettings('medium', 'spacious', 'on', 'normal', 'on');
        localStorage.setItem('fontSize', 'medium');
        localStorage.setItem('density', 'spacious');
        localStorage.setItem('animation', 'on');
        localStorage.setItem('spacing', 'normal');
        localStorage.setItem('sound', 'on');
        playSound(clickSound);
    });

    // Sound effects for interactive elements across all pages
    const interactiveElements = document.querySelectorAll(
        '.cta-button, .experiment-card, .contact-button, .team-member, .resource-item a'
    );
    interactiveElements.forEach(element => {
        element.addEventListener('click', () => playSound(clickSound));
        element.addEventListener('mouseenter', () => playSound(hoverSound));
    });

    // Apply settings function
    function applySettings(font, density, animation, spacing, sound) {
        body.classList.remove('font-small', 'font-medium', 'font-large',
                             'density-compact', 'density-spacious',
                             'animations-on', 'no-animations',
                             'text-normal', 'text-relaxed',
                             'sounds-on', 'sounds-off');
        body.classList.add(`font-${font}`, `density-${density}`, 
                          `animations-${animation}`, `text-${spacing}`, 
                          `sounds-${sound}`);

        fontBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.font === font));
        densityBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.density === density));
        animationBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.animation === animation));
        spacingBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.spacing === spacing));
        soundBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.sound === sound));
    }

    // Play sound if enabled and unlocked
    function playSound(audioElement) {
        if (body.classList.contains('sounds-on') && isAudioUnlocked) {
            console.log('Playing sound:', audioElement.id); // Debug log
            audioElement.currentTime = 0; // Reset to start
            audioElement.play().catch(error => {
                console.error('Audio play failed:', error); // Log errors
            });
        } else if (!isAudioUnlocked) {
            console.log('Audio not unlocked yet—waiting for first interaction');
        }
    }

    // Close modal when clicking outside
    settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) {
            settingsModal.style.display = 'none';
            playSound(clickSound);
        }
    });
});