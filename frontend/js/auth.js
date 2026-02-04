/* =====================================================
   DRIVEX CAR RENTAL - AUTH SCRIPTS
   Racing Car Mascot with Interactive Animations
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
    console.log('🏎️ DriveX Auth System Loading...');
    
    // Elements
    const carMascot = document.getElementById('carMascot');
    const carBubble = document.getElementById('carBubble');
    const bubbleText = carBubble?.querySelector('.bubble-text');
    const authTabs = document.querySelectorAll('.auth-tab');
    const authForms = document.querySelectorAll('.auth-form');
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    const emailInputs = document.querySelectorAll('input[type="email"]');
    const passwordToggles = document.querySelectorAll('.password-toggle');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const toast = document.getElementById('toast');
    const confettiContainer = document.getElementById('confettiContainer');
    const verificationModal = document.getElementById('verificationModal');
    const resendVerificationBtn = document.getElementById('resendVerification');
    const closeVerificationBtn = document.getElementById('closeVerification');
    
    let pendingUser = null; // Store user waiting for email verification

    // Sound Effects System
    const sounds = {
        initialized: false,
        context: null,
        
        // Initialize Web Audio API
        init() {
            if (this.initialized) return;
            try {
                this.context = new (window.AudioContext || window.webkitAudioContext)();
                this.initialized = true;
                console.log('🔊 Sound system initialized');
            } catch (e) {
                console.warn('⚠️ Web Audio API not supported');
            }
        },
        
        // Play beep sound with custom frequency and duration
        playBeep(frequency = 440, duration = 200, type = 'sine') {
            if (!this.initialized || !this.context) return;
            
            const oscillator = this.context.createOscillator();
            const gainNode = this.context.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.context.destination);
            
            oscillator.frequency.value = frequency;
            oscillator.type = type;
            
            gainNode.gain.setValueAtTime(0.3, this.context.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + duration / 1000);
            
            oscillator.start(this.context.currentTime);
            oscillator.stop(this.context.currentTime + duration / 1000);
        },
        
        // Car engine rev sound
        engineRev() {
            if (!this.initialized || !this.context) return;
            
            const oscillator = this.context.createOscillator();
            const gainNode = this.context.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.context.destination);
            
            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(80, this.context.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(200, this.context.currentTime + 0.3);
            oscillator.frequency.exponentialRampToValueAtTime(100, this.context.currentTime + 0.6);
            
            gainNode.gain.setValueAtTime(0.2, this.context.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.6);
            
            oscillator.start(this.context.currentTime);
            oscillator.stop(this.context.currentTime + 0.6);
        },
        
        // Car honk sound
        honk() {
            if (!this.initialized || !this.context) return;
            
            // Create two oscillators for richer honk sound
            const osc1 = this.context.createOscillator();
            const osc2 = this.context.createOscillator();
            const gainNode = this.context.createGain();
            
            osc1.connect(gainNode);
            osc2.connect(gainNode);
            gainNode.connect(this.context.destination);
            
            osc1.frequency.value = 400;
            osc2.frequency.value = 500;
            osc1.type = 'square';
            osc2.type = 'square';
            
            gainNode.gain.setValueAtTime(0.3, this.context.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.3);
            
            osc1.start(this.context.currentTime);
            osc2.start(this.context.currentTime);
            osc1.stop(this.context.currentTime + 0.3);
            osc2.stop(this.context.currentTime + 0.3);
        },
        
        // Typing beep
        typeBeep() {
            this.playBeep(800, 50, 'sine');
        },
        
        // Success chime
        success() {
            if (!this.initialized || !this.context) return;
            
            const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
            notes.forEach((freq, i) => {
                setTimeout(() => {
                    this.playBeep(freq, 150, 'sine');
                }, i * 100);
            });
        },
        
        // Error buzz
        error() {
            if (!this.initialized || !this.context) return;
            
            for (let i = 0; i < 2; i++) {
                setTimeout(() => {
                    this.playBeep(200, 150, 'sawtooth');
                }, i * 200);
            }
        },
        
        // Click sound
        click() {
            this.playBeep(1000, 30, 'sine');
        }
    };
    
    // Initialize sounds on first user interaction
    const initSoundsOnInteraction = () => {
        sounds.init();
        document.removeEventListener('click', initSoundsOnInteraction);
        document.removeEventListener('keydown', initSoundsOnInteraction);
    };
    
    document.addEventListener('click', initSoundsOnInteraction);
    document.addEventListener('keydown', initSoundsOnInteraction);

    // Debug: Check if elements are found
    console.log('✅ Elements found:', {
        carMascot: !!carMascot,
        carBubble: !!carBubble,
        forms: authForms.length,
        tabs: authTabs.length,
        passwordInputs: passwordInputs.length,
        emailInputs: emailInputs.length
    });
    
    // Show welcome message
    setTimeout(() => {
        if (carMascot && carBubble) {
            sounds.init(); // Initialize sound on first animation
            sounds.engineRev(); // Play engine rev sound
            setMascotState('excited');
            showBubble('Ka-chow! Ready to race! 🏁', 2500);
            setTimeout(() => {
                setMascotState('');
                sounds.honk(); // Play honk at the end
            }, 2500);
        }
    }, 500);

    // Car mascot speech phrases
    const phrases = {
        welcome: ['Ka-chow! 🏁', 'Ready to roll! 🚗', 'Let\'s race! 🏎️', 'Speed. I am Speed!'],
        emailFocus: ['What\'s your email? 📧', 'Type away! ⌨️', 'Looking good! 👀'],
        passwordFocus: ['I won\'t peek! 🙈', 'Keep it secret! 🔐', 'Safe with me! 🛡️'],
        passwordTyping: ['*vroom vroom* 🏎️', 'Can\'t see a thing! 😎', 'Still not looking! 🙊'],
        loginSuccess: ['Welcome back, champ! 🏆', 'Let\'s hit the road! 🛣️', 'Full speed ahead! 🚀'],
        registerSuccess: ['Welcome to the crew! 🎉', 'New driver alert! 🚗', 'Race you to the top! 🏁'],
        error: ['Oops, flat tire! 😅', 'Let\'s try again! 🔄', 'Pit stop needed! 🔧'],
        idle: ['*engine revving* 🏎️', '*beep beep* 📯', '*spinning wheels* ⚙️']
    };

    // Utility functions
    const randomPhrase = (category) => {
        const list = phrases[category] || phrases.idle;
        return list[Math.floor(Math.random() * list.length)];
    };

    const showBubble = (text, duration = 2000) => {
        if (bubbleText && carBubble) {
            bubbleText.textContent = text;
            carBubble.classList.add('show');
            setTimeout(() => carBubble.classList.remove('show'), duration);
        }
    };

    const setMascotState = (state) => {
        if (!carMascot) {
            console.warn('⚠️ Car mascot element not found');
            return;
        }
        carMascot.classList.remove('happy', 'excited', 'love', 'sleepy', 'focus', 'peeking');
        if (state) {
            carMascot.classList.add(state);
            console.log('🚗 Mascot state:', state);
        }
    };

    // Initialize car particles
    const initCarParticles = () => {
        const container = document.getElementById('carParticles');
        if (!container) return;

        const carEmojis = ['🚗', '🚙', '🚕', '🏎️', '🚐'];
        
        for (let i = 0; i < 5; i++) {
            const particle = document.createElement('div');
            particle.className = 'car-particle';
            particle.textContent = carEmojis[Math.floor(Math.random() * carEmojis.length)];
            particle.style.cssText = `
                position: absolute;
                font-size: ${20 + Math.random() * 20}px;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                opacity: 0.1;
                animation: floatParticle ${10 + Math.random() * 10}s ease-in-out infinite;
                animation-delay: ${Math.random() * 5}s;
            `;
            container.appendChild(particle);
        }

        // Add keyframe animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes floatParticle {
                0%, 100% { transform: translate(0, 0) rotate(0deg); }
                25% { transform: translate(20px, -30px) rotate(5deg); }
                50% { transform: translate(-10px, 10px) rotate(-5deg); }
                75% { transform: translate(30px, 20px) rotate(3deg); }
            }
        `;
        document.head.appendChild(style);
    };

    // Tab switching
    const switchTab = (tabName) => {
        authTabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabName);
        });
        
        authForms.forEach(form => {
            form.classList.toggle('active', form.dataset.form === tabName);
        });

        // Car mascot reaction
        setMascotState('excited');
        showBubble(tabName === 'login' ? 'Welcome back! 👋' : 'New driver? Awesome! 🚗');
        sounds.engineRev(); // Play engine sound
        
        setTimeout(() => setMascotState(''), 1500);
    };

    // Tab click handlers
    authTabs.forEach(tab => {
        tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });

    // Eye tracking - make car eyes follow mouse (only when not peeking)
    const trackMouse = (e) => {
        if (!carMascot) return;
        
        // Don't track mouse when peeking or focusing (let CSS animation handle it)
        if (carMascot.classList.contains('peeking') || carMascot.classList.contains('focus')) {
            return;
        }
        
        const mascotRect = carMascot.getBoundingClientRect();
        const mascotCenterX = mascotRect.left + mascotRect.width / 2;
        const mascotCenterY = mascotRect.top + mascotRect.height / 2;
        
        const deltaX = (e.clientX - mascotCenterX) / 50;
        const deltaY = (e.clientY - mascotCenterY) / 50;
        
        const maxOffset = 4;
        const offsetX = Math.max(-maxOffset, Math.min(maxOffset, deltaX));
        const offsetY = Math.max(-maxOffset, Math.min(maxOffset, deltaY));
        
        const pupils = carMascot.querySelectorAll('.eye-pupil');
        if (pupils.length > 0) {
            pupils.forEach(pupil => {
                pupil.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
            });
        }
    };

    document.addEventListener('mousemove', trackMouse);

    // Password input - car covers eyes
    passwordInputs.forEach(input => {
        input.addEventListener('focus', () => {
            setMascotState('focus');
            showBubble(randomPhrase('passwordFocus'));
            sounds.click();
        });

        input.addEventListener('input', () => {
            if (input.value.length > 0) {
                showBubble(randomPhrase('passwordTyping'), 1500);
            }
            
            // Password strength indicator
            if (input.id === 'registerPassword') {
                updatePasswordStrength(input.value);
            }
        });

        input.addEventListener('blur', () => {
            setMascotState('');
        });
    });

    // Email input - car watches
    emailInputs.forEach(input => {
        input.addEventListener('focus', () => {
            setMascotState('');
            showBubble(randomPhrase('emailFocus'));
            sounds.typeBeep();
        });

        input.addEventListener('input', () => {
            // Email validation visual
            const isValid = validateEmail(input.value);
            input.classList.toggle('valid', isValid && input.value.length > 0);
            input.classList.toggle('invalid', !isValid && input.value.length > 0);
            
            // Play subtle typing sound
            if (input.value.length > 0 && input.value.length % 3 === 0) {
                sounds.typeBeep();
            }
        });
    });

    // Password toggle - eyes open and continuously look around
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const input = toggle.parentElement.querySelector('input');
            const type = input.type === 'password' ? 'text' : 'password';
            input.type = type;
            toggle.classList.toggle('active', type === 'text');
            
            console.log('👁️ Password visibility toggled:', type);
            sounds.click();
            
            // Car reaction - peeking: eyes open, continuously look at password then elsewhere
            if (type === 'text') {
                if (carMascot) {
                    carMascot.classList.remove('focus');
                    carMascot.classList.add('peeking');
                    console.log('🔍 McQueen is peeking!');
                }
                showBubble('Oops, peeking! 👀', 2000);
            } else {
                if (carMascot) {
                    carMascot.classList.remove('peeking');
                    carMascot.classList.add('focus');
                    console.log('🙈 McQueen is covering eyes!');
                }
                showBubble('Not looking! 🙈', 1500);
            }
        });
    });

    // Password strength checker
    const updatePasswordStrength = (password) => {
        const strengthFill = document.querySelector('.strength-fill');
        const strengthText = document.querySelector('.strength-text');
        
        if (!strengthFill || !strengthText) return;

        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^a-zA-Z0-9]/.test(password)) strength++;

        const levels = ['', 'weak', 'fair', 'good', 'strong'];
        const labels = ['Password strength', 'Weak 😬', 'Fair 🤔', 'Good 👍', 'Strong 💪'];
        
        strengthFill.className = 'strength-fill ' + levels[strength];
        strengthText.textContent = labels[strength];
    };

    // Email validation
    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    // Form submission with Firebase Auth
    const handleSubmit = async (form, isLogin) => {
        const submitBtn = form.querySelector('.submit-btn');
        const email = form.querySelector('input[type="email"]').value;
        const password = form.querySelector('input[type="password"]').value;
        
        submitBtn.classList.add('loading');
        
        try {
            let userCredential;
            
            if (isLogin) {
                // Firebase Login - check if email is verified
                userCredential = await window.signInWithEmailAndPassword(window.auth, email, password);
                
                // Check if email is verified
                if (!userCredential.user.emailVerified) {
                    // Sign out the unverified user
                    await window.auth.signOut();
                    throw { code: 'auth/email-not-verified', message: 'Please verify your email before signing in.' };
                }
            } else {
                // Firebase Registration
                const fullName = form.querySelector('input[placeholder*="name"]')?.value;
                userCredential = await window.createUserWithEmailAndPassword(window.auth, email, password);
                
                // Update display name if provided
                if (fullName && userCredential.user) {
                    await window.updateProfile(userCredential.user, {
                        displayName: fullName
                    });
                }
                
                // Send email verification
                await window.sendEmailVerification(userCredential.user, {
                    url: window.location.origin + '/login.html',
                    handleCodeInApp: false
                });
                
                // Store user for resend functionality
                pendingUser = userCredential.user;
                
                // Sign out user until email is verified
                await window.auth.signOut();
                
                submitBtn.classList.remove('loading');
                
                // Show verification modal instead of redirect
                showVerificationModal(email);
                
                setMascotState('love');
                showBubble('📧 Check your email!', 3000);
                
                return; // Exit without redirect
            }
            
            submitBtn.classList.remove('loading');
            
            // Success animation
            setMascotState('love');
            showBubble(randomPhrase(isLogin ? 'loginSuccess' : 'registerSuccess'), 3000);
            sounds.success(); // Play success chime
            
            // Show success toast
            showToast('success', isLogin ? 'Welcome back! Redirecting...' : 'Account created successfully!');
            
            // Confetti celebration
            createConfetti();
            
            // Redirect after animation
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
            
        } catch (error) {
            submitBtn.classList.remove('loading');
            
            // Error handling
            setMascotState('excited');
            showBubble(randomPhrase('error'), 3000);
            sounds.error(); // Play error buzz
            
            // Parse Firebase error codes
            let errorMessage = 'Something went wrong. Please try again.';
            switch (error.code) {
                case 'auth/email-not-verified':
                    errorMessage = 'Please verify your email address before signing in. Check your inbox for the verification link.';
                    break;
                case 'auth/email-already-in-use':
                    errorMessage = 'This email is already registered. Try logging in!';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Please enter a valid email address.';
                    break;
                case 'auth/user-not-found':
                    errorMessage = 'No account found with this email.';
                    break;
                case 'auth/wrong-password':
                    errorMessage = 'Incorrect password. Please try again.';
                    break;
                case 'auth/weak-password':
                    errorMessage = 'Password should be at least 6 characters.';
                    break;
                case 'auth/too-many-requests':
                    errorMessage = 'Too many attempts. Please try again later.';
                    break;
                case 'auth/network-request-failed':
                    errorMessage = 'Network error. Check your connection.';
                    break;
                case 'auth/invalid-credential':
                    errorMessage = 'Invalid credentials. Please check and try again.';
                    break;
            }
            
            showToast('error', errorMessage);
            console.error('Auth error:', error);
        }
    };

    // Social login handlers
    const handleGoogleLogin = async () => {
        try {
            // Check if Firebase is initialized
            if (!window.auth || !window.GoogleAuthProvider || !window.signInWithPopup) {
                throw new Error('Firebase not initialized. Please refresh the page.');
            }
            
            const provider = new window.GoogleAuthProvider();
            provider.setCustomParameters({
                prompt: 'select_account'
            });
            
            const result = await window.signInWithPopup(window.auth, provider);
            
            console.log('Google login successful:', result.user.email);
            
            // Google accounts are pre-verified
            setMascotState('love');
            showBubble('Google speed! 🚀', 2000);
            showToast('success', 'Logged in with Google!');
            sounds.success(); // Play success chime
            createConfetti();
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        } catch (error) {
            console.error('Google login error:', error);
            let errorMessage = 'Google login failed. Please try again.';
            
            if (error.code === 'auth/popup-closed-by-user') {
                errorMessage = 'Login cancelled.';
            } else if (error.code === 'auth/popup-blocked') {
                errorMessage = 'Popup blocked. Please allow popups for this site.';
            } else if (error.message.includes('Firebase not initialized')) {
                errorMessage = error.message;
            }
            
            sounds.error(); // Play error buzz
            showToast('error', errorMessage);
        }
    };

    const handleFacebookLogin = async () => {
        try {
            // Check if Firebase is initialized
            if (!window.auth || !window.FacebookAuthProvider || !window.signInWithPopup) {
                throw new Error('Firebase not initialized. Please refresh the page.');
            }
            
            const provider = new window.FacebookAuthProvider();
            provider.setCustomParameters({
                display: 'popup'
            });
            
            const result = await window.signInWithPopup(window.auth, provider);
            
            console.log('Facebook login successful:', result.user.email);
            
            // Facebook accounts are pre-verified
            setMascotState('love');
            showBubble('Facebook fast! 💨', 2000);
            showToast('success', 'Logged in with Facebook!');
            sounds.success(); // Play success chime
            createConfetti();
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        } catch (error) {
            console.error('Facebook login error:', error);
            let errorMessage = 'Facebook login failed. Please try again.';
            
            if (error.code === 'auth/popup-closed-by-user') {
                errorMessage = 'Login cancelled.';
            } else if (error.code === 'auth/popup-blocked') {
                errorMessage = 'Popup blocked. Please allow popups for this site.';
            } else if (error.message.includes('Firebase not initialized')) {
                errorMessage = error.message;
            }
            
            sounds.error(); // Play error buzz
            showToast('error', errorMessage);
        }
    };

    // Attach social login handlers
    document.querySelectorAll('.social-btn').forEach(btn => {
        if (btn.classList.contains('google')) {
            btn.addEventListener('click', handleGoogleLogin);
        } else if (btn.classList.contains('facebook')) {
            btn.addEventListener('click', handleFacebookLogin);
        }
    });

    // Login form
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleSubmit(loginForm, true);
        });
    }

    // Register form
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleSubmit(registerForm, false);
        });
    }

    // Toast notification
    const showToast = (type, message) => {
        if (!toast) return;
        
        const toastMessage = toast.querySelector('.toast-message');
        toastMessage.textContent = message;
        toast.className = `toast ${type} show`;
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    };

    // Confetti celebration
    const createConfetti = () => {
        if (!confettiContainer) return;
        
        const colors = ['#f59e0b', '#fbbf24', '#ef4444', '#22c55e', '#3b82f6', '#8b5cf6'];
        const shapes = ['square', 'circle'];
        
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.cssText = `
                left: ${Math.random() * 100}%;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                animation-delay: ${Math.random() * 0.5}s;
                animation-duration: ${2 + Math.random() * 2}s;
                border-radius: ${shapes[Math.floor(Math.random() * shapes.length)] === 'circle' ? '50%' : '0'};
                transform: rotate(${Math.random() * 360}deg);
            `;
            confettiContainer.appendChild(confetti);
        }
        
        // Cleanup
        setTimeout(() => {
            confettiContainer.innerHTML = '';
        }, 5000);
    };

    // Idle animations
    let idleTimer;
    const startIdleAnimation = () => {
        idleTimer = setInterval(() => {
            if (!document.activeElement.classList.contains('form-input')) {
                showBubble(randomPhrase('idle'), 2000);
            }
        }, 8000);
    };

    const resetIdleTimer = () => {
        clearInterval(idleTimer);
        startIdleAnimation();
    };

    document.addEventListener('mousemove', resetIdleTimer);
    document.addEventListener('keydown', resetIdleTimer);

    // Initial setup
    initCarParticles();
    showBubble(randomPhrase('welcome'), 3000);
    startIdleAnimation();

    // Wheel spinning animation - add rotation to wheel spokes
    const animateWheels = () => {
        const wheelSpokes = document.querySelectorAll('.wheel-spokes');
        let rotation = 0;
        
        const spin = () => {
            rotation += 2;
            wheelSpokes.forEach(spoke => {
                spoke.style.transform = `rotate(${rotation}deg)`;
            });
            requestAnimationFrame(spin);
        };
        
        spin();
    };

    animateWheels();

    // Add hover effects to car mascot
    if (carMascot) {
        carMascot.addEventListener('mouseenter', () => {
            setMascotState('excited');
            showBubble('Hey there! 👋', 1500);
            sounds.engineRev(); // Play engine rev
        });

        carMascot.addEventListener('mouseleave', () => {
            setMascotState('');
        });

        carMascot.addEventListener('click', () => {
            setMascotState('happy');
            showBubble('Ka-chow! ⚡', 2000);
            sounds.honk(); // Play honk sound
            
            // Honk sound effect (visual)
            const honk = document.createElement('div');
            honk.textContent = '📯';
            honk.style.cssText = `
                position: absolute;
                font-size: 2rem;
                top: 50%;
                left: 10%;
                animation: honkPop 0.5s ease-out forwards;
                pointer-events: none;
            `;
            carMascot.parentElement.appendChild(honk);
            
            setTimeout(() => honk.remove(), 500);
        });
    }

    // Add honk animation keyframe
    const honkStyle = document.createElement('style');
    honkStyle.textContent = `
        @keyframes honkPop {
            0% { transform: scale(0) translateY(-50%); opacity: 0; }
            50% { transform: scale(1.5) translateY(-50%); opacity: 1; }
            100% { transform: scale(1) translateY(-100px); opacity: 0; }
        }
    `;
    document.head.appendChild(honkStyle);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-nav');
        }
    });

    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-nav');
    });

    // Add focus visible styles
    const focusStyle = document.createElement('style');
    focusStyle.textContent = `
        .keyboard-nav *:focus {
            outline: 3px solid var(--color-primary);
            outline-offset: 2px;
        }
    `;
    document.head.appendChild(focusStyle);

    // Check Firebase initialization
    const checkFirebase = () => {
        if (window.auth && window.signInWithEmailAndPassword) {
            console.log('✅ Firebase Auth Ready');
        } else {
            console.warn('⚠️ Firebase might not be initialized yet');
        }
    };
    
    setTimeout(checkFirebase, 100);
    
    // Start idle animations
    startIdleAnimation();

    // Email Verification Modal Functions
    const showVerificationModal = (email) => {
        if (verificationModal) {
            verificationModal.classList.add('show');
            verificationModal.querySelector('.verification-text').textContent = 
                `We've sent a verification link to ${email}. Please check your inbox and click the link to activate your account.`;
        }
    };

    const hideVerificationModal = () => {
        if (verificationModal) {
            verificationModal.classList.remove('show');
        }
    };

    // Resend verification email
    if (resendVerificationBtn) {
        resendVerificationBtn.addEventListener('click', async () => {
            if (!pendingUser) {
                showToast('error', 'No pending verification found.');
                return;
            }

            try {
                sounds.click();
                resendVerificationBtn.disabled = true;
                resendVerificationBtn.innerHTML = '<span>Sending...</span>';
                
                await window.sendEmailVerification(pendingUser, {
                    url: window.location.origin + '/login.html',
                    handleCodeInApp: false
                });
                
                showToast('success', 'Verification email sent! Check your inbox.');
                showBubble('📧 Email sent again!', 2000);
                
                setTimeout(() => {
                    resendVerificationBtn.disabled = false;
                    resendVerificationBtn.innerHTML = '<span>Resend Email</span>';
                }, 5000);
            } catch (error) {
                console.error('Resend error:', error);
                showToast('error', 'Failed to resend email. Try again later.');
                resendVerificationBtn.disabled = false;
                resendVerificationBtn.innerHTML = '<span>Resend Email</span>';
            }
        });
    }

    // Close verification modal
    if (closeVerificationBtn) {
        closeVerificationBtn.addEventListener('click', () => {
            sounds.click();
            hideVerificationModal();
            // Switch to login tab
            switchTab('login');
            showBubble('Ready to sign in? 🚀', 2000);
        });
    }

    console.log('🏁 DriveX Auth System Initialized - Ka-chow!');
});
