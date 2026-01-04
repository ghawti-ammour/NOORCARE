// Main DOM Content Loaded Event Listener
document.addEventListener('DOMContentLoaded', function() {
    // 1. Language Setup
    initializeLanguageSelector();
    
    // 2. Loading Screen Logic
    const loadingScreen = document.getElementById('loadingScreen');
    const mainContent = document.getElementById('mainContent');
    
    if (loadingScreen && mainContent) {
        setTimeout(() => {
            loadingScreen.style.transform = 'translateY(-100%)';
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                mainContent.style.display = 'block';
            }, 500);
        }, 2000);
    }

    // 3. Modal & Form Handling
    const signInModal = document.getElementById('signInModal');
    const signUpModal = document.getElementById('signUpModal');
    const btnSignIn = document.getElementById('openSignIn');
    const btnSignUp = document.getElementById('openSignUp');
    const closeModals = document.querySelectorAll('.close-modal');
    const profileInput = document.getElementById('profileInput');
    const profileLabel = document.getElementById('profileLabel');
    const switchToSignIn = document.querySelector('.switch-to-signin');
    const switchToSignUp = document.querySelector('.switch-to-signup');

    // Open Modals
    if(btnSignIn) {
        btnSignIn.onclick = () => {
            signInModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        };
    }

    if(btnSignUp) {
        btnSignUp.onclick = () => {
            signUpModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        };
    }

    // Close Modals
    closeModals.forEach(closeBtn => {
        closeBtn.onclick = () => {
            signInModal.style.display = 'none';
            signUpModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        };
    });

    // Switch between Sign In and Sign Up
    if(switchToSignIn) {
        switchToSignIn.onclick = (e) => {
            e.preventDefault();
            signUpModal.style.display = 'none';
            signInModal.style.display = 'flex';
        };
    }

    if(switchToSignUp) {
        switchToSignUp.onclick = (e) => {
            e.preventDefault();
            signInModal.style.display = 'none';
            signUpModal.style.display = 'flex';
        };
    }

    // Handle Profile Pic Preview
    if (profileInput && profileLabel) {
        profileInput.onchange = function() {
            if (this.files && this.files[0]) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    profileLabel.style.backgroundImage = `url(${e.target.result})`;
                    const icon = profileLabel.querySelector('i');
                    if (icon) icon.style.display = 'none';
                };
                reader.readAsDataURL(this.files[0]);
            }
        };
    }

    // Close modals when clicking outside
    window.onclick = (e) => {
        if (e.target === signInModal) {
            signInModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        if (e.target === signUpModal) {
            signUpModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    };

    // Form submissions
    const loginForm = document.getElementById('loginForm');
    const registrationForm = document.getElementById('registrationForm');
    const sendVerificationBtn = document.getElementById('sendVerificationCode');
    const verifyAndSignUpBtn = document.getElementById('verifyAndSignUp');
    const verificationSection = document.getElementById('verificationSection');

    let verificationCode = '';
    let userEmail = '';

    function generateVerificationCode() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    function sendVerificationCode(email) {
        console.log(`Verification code ${verificationCode} sent to ${email}`);
        
        const message = document.getElementById('verificationMessage');
        if (message) {
            message.textContent = `Verification code sent to ${email}`;
            message.style.color = '#2563eb';
        }
    }

    function validateVerificationCode(code) {
        return code === verificationCode;
    }

    // Registration Form Handler
    if (registrationForm) {
        registrationForm.onsubmit = function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: registrationForm.querySelector('input[placeholder="Full Name"]').value,
                email: registrationForm.querySelector('input[type="email"]').value,
                password: registrationForm.querySelector('input[type="password"]').value,
                confirmPassword: registrationForm.querySelector('input[placeholder="Confirm"]').value,
                role: registrationForm.querySelector('#roleSelect').value,
                phone: registrationForm.querySelector('input[type="tel"]').value,
                age: registrationForm.querySelector('input[placeholder="Age"]').value
            };
            
            // Basic validation
            if (formData.password !== formData.confirmPassword) {
                showAlert('Passwords do not match', 'error');
                return;
            }
            
            if (formData.password.length < 6) {
                showAlert('Password must be at least 6 characters', 'error');
                return;
            }
            
            // Remove confirmPassword before saving
            const { confirmPassword, ...userData } = formData;
            
            try {
                const result = window.auth.register(userData);
                
                if (result.success) {
                    // Handle profile picture if uploaded
                    const profileInput = document.getElementById('profileInput');
                    if (profileInput.files && profileInput.files[0]) {
                        const reader = new FileReader();
                        reader.onload = function(e) {
                            window.auth.updateProfile(result.user.id, { profileImage: e.target.result });
                        };
                        reader.readAsDataURL(profileInput.files[0]);
                    }
                    
                    showAlert('Registration successful! Redirecting...', 'success');
                    
                    // Close modal and reset form
                    signUpModal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                    registrationForm.reset();
                    
                    // Redirect to appropriate dashboard
                    setTimeout(() => {
                        window.redirectToDashboard(result.user.role);
                    }, 1500);
                } else {
                    showAlert(result.message || 'Registration failed. Please try again.', 'error');
                }
            } catch (error) {
                console.error('Registration error:', error);
                showAlert('An error occurred during registration. Please try again.', 'error');
            }
        };
    }
    
    // Verification code functionality (simplified for demo)
    if (sendVerificationBtn) {
        sendVerificationBtn.addEventListener('click', function() {
            const emailInput = registrationForm.querySelector('input[type="email"]');
            if (!emailInput || !emailInput.value) {
                showAlert('Please enter your email address first', 'error');
                return;
            }
            
            // In a real app, you would send a verification code to the user's email
            // For demo purposes, we'll just show the verification section
            verificationSection.style.display = 'block';
            sendVerificationBtn.disabled = true;
            
            // Auto-fill with a demo code for testing
            document.getElementById('verificationCode').value = '123456';
            
            showAlert('Verification code sent to your email', 'success');
            verificationSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    }

    // Initialize dashboard functionality
    function initializeDashboard() {
        // This will be called by individual dashboard pages
        const currentUser = window.auth?.getCurrentUser();
        if (!currentUser) {
            window.location.href = 'index.html';
            return;
        }
        
        // Set user info in dashboard
        const userName = document.getElementById('userName');
        const profileImage = document.getElementById('profileImage');
        
        if (userName) {
            const title = currentUser.role === 'doctor' ? 'Dr. ' : '';
            userName.textContent = `${title}${currentUser.name}`;
        }
        
        if (profileImage && currentUser.profileImage) {
            profileImage.src = currentUser.profileImage;
        }
        
        // Setup logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.onclick = function(e) {
                e.preventDefault();
                window.auth.logout();
                window.location.href = 'index.html';
            };
        }
        
        console.log('Dashboard initialized for', currentUser.role);
    }

    if (loginForm) {
        loginForm.onsubmit = async function(e) {
            e.preventDefault();
            
            const email = loginForm.querySelector('input[type="email"]').value;
            const password = loginForm.querySelector('input[type="password"]').value;
            const rememberMe = loginForm.querySelector('input[type="checkbox"]')?.checked || false;
            
            if (!email || !password) {
                showAlert('Please enter both email and password', 'error');
                return;
            }
            
            const result = window.userManager.login(email, password);
            
            if (result.success) {
                // Store login in localStorage if "Remember me" is checked
                if (rememberMe) {
                    localStorage.setItem('noorcare_rememberedEmail', email);
    if (!languageSelect) return;

    const translations = {
        en: { 
            // Existing translations
            title: "NOORCARE", 
            subtitle: "Your health is our priority", 
            signIn: "Sign In", 
            signUp: "Sign Up", 
            or: "or", 
            continueWithGoogle: "Continue with Google", 
            continueWithFacebook: "Continue with Facebook",
            
            // Form specific translations
            signInTitle: "Sign In",
            signInSubtitle: "Welcome back! Please sign in to continue",
            signUpTitle: "Sign Up",
            signUpSubtitle: "Create your account to continue",
            fullName: "Full Name",
            age: "Age",
            phoneNumber: "Phone Number",
            emailAddress: "Email Address",
            password: "Password",
            confirmPassword: "Confirm Password",
            forgotPassword: "Forgot Password?",
            noAccount: "Don't have an account?",
            haveAccount: "Already have an account?",
            selectRole: "Select Role",
            doctor: "Doctor",
            hospital: "Hospital",
            pharmacy: "Pharmacy",
            laboratoire: "Laboratory",
            patient: "Patient",
            addPhoto: "Add Photo (Optional)"
        },
        ar: { 
            // Arabic translations
            title: "نوركير", 
            subtitle: "صحتك هي أولويتنا", 
            signIn: "تسجيل الدخول", 
            signUp: "إنشاء حساب", 
            or: "أو", 
            continueWithGoogle: "المتابعة مع جوجل", 
            continueWithFacebook: "المتابعة مع فيسبوك",
            
            // Form specific Arabic translations
            signInTitle: "تسجيل الدخول",
            signInSubtitle: "مرحباً بعودتك! يرجى تسجيل الدخول للمتابعة",
            signUpTitle: "إنشاء حساب",
            signUpSubtitle: "أنشئ حسابك للمتابعة",
            fullName: "الاسم الكامل",
            age: "العمر",
            phoneNumber: "رقم الهاتف",
            emailAddress: "البريد الإلكتروني",
            password: "كلمة المرور",
            confirmPassword: "تأكيد كلمة المرور",
            forgotPassword: "نسيت كلمة المرور؟",
            noAccount: "ليس لديك حساب؟",
            haveAccount: "لديك حساب بالفعل؟",
            selectRole: "اختر الدور",
            doctor: "طبيب",
            hospital: "مستشفى",
            pharmacy: "صيدلية",
            laboratoire: "مختبر",
            patient: "مريض",
            addPhoto: "إضافة صورة (اختياري)"
        },
        fr: { 
            // French translations
            title: "NOORCARE", 
            subtitle: "Votre santé est notre priorité", 
            signIn: "Se connecter", 
            signUp: "S'inscrire", 
            or: "ou", 
            continueWithGoogle: "Continuer avec Google", 
            continueWithFacebook: "Continuer avec Facebook",
            
            // Form specific French translations
            signInTitle: "Se connecter",
            signInSubtitle: "Content de vous revoir! Veuillez vous connecter pour continuer",
            signUpTitle: "S'inscrire",
            signUpSubtitle: "Créez votre compte pour continuer",
            fullName: "Nom complet",
            age: "Âge",
            phoneNumber: "Numéro de téléphone",
            emailAddress: "Adresse e-mail",
            password: "Mot de passe",
            confirmPassword: "Confirmer le mot de passe",
            forgotPassword: "Mot de passe oublié ?",
            noAccount: "Vous n'avez pas de compte ?",
            haveAccount: "Vous avez déjà un compte ?",
            selectRole: "Sélectionner un rôle",
            doctor: "Médecin",
            hospital: "Hôpital",
            pharmacy: "Pharmacie",
            laboratoire: "Laboratoire",
            patient: "Patient",
            addPhoto: "Ajouter une photo (Optionnel)"
        }
    };

    function updateLanguage(lang) {
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        
        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const text = translations[lang]?.[key] || translations['en'][key];
            if (text) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = text;
                } else if (el.tagName === 'OPTION') {
                    el.textContent = text;
                } else if (el.querySelector('i')) {
                    const icon = el.querySelector('i').outerHTML;
                    el.innerHTML = `${icon} ${text}`;
                } else {
                    el.textContent = text;
                }
            }
        });

        // Update form titles and subtitles
        const signInTitle = document.querySelector('#signInModal .form-title');
        const signInSubtitle = document.querySelector('#signInModal .form-subtitle');
        const signUpTitle = document.querySelector('#signUpModal .form-title');
        const signUpSubtitle = document.querySelector('#signUpModal .form-subtitle');
        const addPhotoText = document.querySelector('.profile-pic-container span');

        if (signInTitle) signInTitle.textContent = translations[lang]?.signInTitle || translations.en.signInTitle;
        if (signInSubtitle) signInSubtitle.textContent = translations[lang]?.signInSubtitle || translations.en.signInSubtitle;
        if (signUpTitle) signUpTitle.textContent = translations[lang]?.signUpTitle || translations.en.signUpTitle;
        if (signUpSubtitle) signUpSubtitle.textContent = translations[lang]?.signUpSubtitle || translations.en.signUpSubtitle;
        if (addPhotoText) addPhotoText.textContent = translations[lang]?.addPhoto || translations.en.addPhoto;

        // Update form placeholders and labels
        const formElements = {
            'input[placeholder="Full Name"]': translations[lang]?.fullName,
            'input[placeholder="Age"]': translations[lang]?.age,
            'input[placeholder="Phone Number"]': translations[lang]?.phoneNumber,
            'input[type="email"]': translations[lang]?.emailAddress,
            'input[type="password"]': translations[lang]?.password,
            'input[placeholder="Confirm"]': translations[lang]?.confirmPassword,
            '.forgot-link': translations[lang]?.forgotPassword,
            '.switch-to-signup': translations[lang]?.noAccount,
            '.switch-to-signin': translations[lang]?.haveAccount,
            '#roleSelect': translations[lang]?.selectRole
        };

        Object.entries(formElements).forEach(([selector, text]) => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = text;
                } else if (el.tagName === 'SELECT') {
                    // For select elements, update the first option
                    const firstOption = el.querySelector('option:first-child');
                    if (firstOption) firstOption.textContent = text;
                } else {
                    el.textContent = text;
                }
            });
        });

        // Update role options
        const roleSelect = document.getElementById('roleSelect');
        if (roleSelect) {
            const roleOptions = roleSelect.querySelectorAll('option:not(:first-child)');
            const roles = ['doctor', 'hospital', 'pharmacy', 'laboratoire', 'patient'];
            roleOptions.forEach((option, index) => {
                if (roles[index]) {
                    option.textContent = translations[lang]?.[roles[index]] || translations.en[roles[index]];
                }
            });
        }
    }

    // Initialize with current language
    if (languageSelect) {
        languageSelect.onchange = (e) => updateLanguage(e.target.value);
        updateLanguage(languageSelect.value || 'en');
    }
});

function initializeLanguageSelector() {
    const languageSelect = document.getElementById('languageSelect');
    if (!languageSelect) return;

    const translations = {
        en: { 
            // Existing translations
            title: "NOORCARE", 
            subtitle: "Your health is our priority", 
            signIn: "Sign In", 
            signUp: "Sign Up", 
            or: "or", 
            continueWithGoogle: "Continue with Google", 
            continueWithFacebook: "Continue with Facebook",
            
            // Form specific translations
            signInTitle: "Sign In",
            signInSubtitle: "Welcome back! Please sign in to continue",
            signUpTitle: "Sign Up",
            signUpSubtitle: "Create your account to continue",
            fullName: "Full Name",
            age: "Age",
            phoneNumber: "Phone Number",
            emailAddress: "Email Address",
            password: "Password",
            confirmPassword: "Confirm Password",
            forgotPassword: "Forgot Password?",
            noAccount: "Don't have an account?",
            haveAccount: "Already have an account?",
            selectRole: "Select Role",
            doctor: "Doctor",
            hospital: "Hospital",
            pharmacy: "Pharmacy",
            laboratoire: "Laboratory",
            patient: "Patient",
            addPhoto: "Add Photo (Optional)"
        },
        ar: { 
            // Existing Arabic translations
            title: "نوركير", 
            subtitle: "صحتك هي أولويتنا", 
            signIn: "تسجيل الدخول", 
            signUp: "إنشاء حساب", 
            or: "أو", 
            continueWithGoogle: "المتابعة مع جوجل", 
            continueWithFacebook: "المتابعة مع فيسبوك",
            
            // Form specific Arabic translations
            signInTitle: "تسجيل الدخول",
            signInSubtitle: "مرحباً بعودتك! يرجى تسجيل الدخول للمتابعة",
            signUpTitle: "إنشاء حساب",
            signUpSubtitle: "أنشئ حسابك للمتابعة",
            fullName: "الاسم الكامل",
            age: "العمر",
            phoneNumber: "رقم الهاتف",
            emailAddress: "البريد الإلكتروني",
            password: "كلمة المرور",
            confirmPassword: "تأكيد كلمة المرور",
            forgotPassword: "نسيت كلمة المرور؟",
            noAccount: "ليس لديك حساب؟",
            haveAccount: "لديك حساب بالفعل؟",
            selectRole: "اختر الدور",
            doctor: "طبيب",
            hospital: "مستشفى",
            pharmacy: "صيدلية",
            laboratoire: "مختبر",
            patient: "مريض",
            addPhoto: "إضافة صورة (اختياري)"
        },
        fr: { 
            // Existing French translations
            title: "NOORCARE", 
            subtitle: "Votre santé est notre priorité", 
            signIn: "Se connecter", 
            signUp: "S'inscrire", 
            or: "ou", 
            continueWithGoogle: "Continuer avec Google", 
            continueWithFacebook: "Continuer avec Facebook",
            
            // Form specific French translations
            signInTitle: "Se connecter",
            signInSubtitle: "Content de vous revoir! Veuillez vous connecter pour continuer",
            signUpTitle: "S'inscrire",
            signUpSubtitle: "Créez votre compte pour continuer",
            fullName: "Nom complet",
            age: "Âge",
            phoneNumber: "Numéro de téléphone",
            emailAddress: "Adresse e-mail",
            password: "Mot de passe",
            confirmPassword: "Confirmer le mot de passe",
            forgotPassword: "Mot de passe oublié ?",
            noAccount: "Vous n'avez pas de compte ?",
            haveAccount: "Vous avez déjà un compte ?",
            selectRole: "Sélectionner un rôle",
            doctor: "Médecin",
            hospital: "Hôpital",
            pharmacy: "Pharmacie",
            laboratoire: "Laboratoire",
            patient: "Patient",
            addPhoto: "Ajouter une photo (Optionnel)"
        }
    };

    function updateLanguage(lang) {
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        
        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const text = translations[lang]?.[key] || translations['en'][key];
            if (text) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = text;
                } else if (el.tagName === 'OPTION') {
                    el.textContent = text;
                } else if (el.querySelector('i')) {
                    const icon = el.querySelector('i').outerHTML;
                    el.innerHTML = `${icon} ${text}`;
                } else {
                    el.textContent = text;
                }
            }
        });

        // Update form titles and subtitles
        const signInTitle = document.querySelector('#signInModal .form-title');
        const signInSubtitle = document.querySelector('#signInModal .form-subtitle');
        const signUpTitle = document.querySelector('#signUpModal .form-title');
        const signUpSubtitle = document.querySelector('#signUpModal .form-subtitle');
        const addPhotoText = document.querySelector('.profile-pic-container span');

        if (signInTitle) signInTitle.textContent = translations[lang]?.signInTitle || translations.en.signInTitle;
        if (signInSubtitle) signInSubtitle.textContent = translations[lang]?.signInSubtitle || translations.en.signInSubtitle;
        if (signUpTitle) signUpTitle.textContent = translations[lang]?.signUpTitle || translations.en.signUpTitle;
        if (signUpSubtitle) signUpSubtitle.textContent = translations[lang]?.signUpSubtitle || translations.en.signUpSubtitle;
        if (addPhotoText) addPhotoText.textContent = translations[lang]?.addPhoto || translations.en.addPhoto;

        // Update form placeholders and labels
        const formElements = {
            'input[name="fullName"]': translations[lang]?.fullName,
            'input[placeholder="Age"]': translations[lang]?.age,
            'input[placeholder="Phone Number"]': translations[lang]?.phoneNumber,
            'input[type="email"]': translations[lang]?.emailAddress,
            'input[type="password"]': translations[lang]?.password,
            'input[placeholder="Confirm"]': translations[lang]?.confirmPassword,
            '.forgot-link': translations[lang]?.forgotPassword,
            '.switch-to-signup': translations[lang]?.noAccount,
            '.switch-to-signin': translations[lang]?.haveAccount,
            '#roleSelect': translations[lang]?.selectRole
        };

        Object.entries(formElements).forEach(([selector, text]) => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = text;
                } else if (el.tagName === 'SELECT') {
                    // For select elements, update the first option
                    const firstOption = el.querySelector('option:first-child');
                    if (firstOption) firstOption.textContent = text;
                } else {
                    el.textContent = text;
                }
            });
        });

        // Update role options
        const roleSelect = document.getElementById('roleSelect');
        if (roleSelect) {
            const roleOptions = roleSelect.querySelectorAll('option:not(:first-child)');
            const roles = ['doctor', 'hospital', 'pharmacy', 'laboratoire', 'patient'];
            roleOptions.forEach((option, index) => {
                if (roles[index]) {
                    option.textContent = translations[lang]?.[roles[index]] || translations.en[roles[index]];
                }
            });
        }
    }

    // Initialize with current language
    if (languageSelect) {
        languageSelect.onchange = (e) => updateLanguage(e.target.value);
        updateLanguage(languageSelect.value || 'en');
    }
}
