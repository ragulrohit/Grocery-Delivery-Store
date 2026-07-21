// ===== GROCERY DELIVERY STORE - Main JavaScript =====

// ===== AUTH SYSTEM =====
function getUsers() {
    return JSON.parse(localStorage.getItem('groceryUsers') || '[]');
}

function saveUsers(users) {
    localStorage.setItem('groceryUsers', JSON.stringify(users));
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem('groceryCurrentUser') || 'null');
}

function setCurrentUser(user) {
    localStorage.setItem('groceryCurrentUser', JSON.stringify(user));
}

function logout() {
    localStorage.removeItem('groceryCurrentUser');
    window.location.href = 'login.html';
}

function checkAuth() {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// ===== SIGNUP =====
function handleSignup(e) {
    e.preventDefault();
    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;
    const phone = document.getElementById('signup-phone').value.trim();
    const remember = document.getElementById('signup-remember')?.checked;

    if (!name || !email || !password || !confirmPassword) {
        showToast('Please fill all required fields', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        document.getElementById('signup-confirm-password').focus();
        return;
    }

    const users = getUsers();
    if (users.find(u => u.email === email)) {
        showToast('Email already registered', 'error');
        return;
    }

    const user = { name, email, password, phone, joined: new Date().toISOString() };
    users.push(user);
    saveUsers(users);
    if (remember) localStorage.setItem('groceryRememberEmail', email);
    else localStorage.removeItem('groceryRememberEmail');
    localStorage.removeItem('groceryCurrentUser');
    showToast('Account created successfully! Please login.');
    setTimeout(() => { window.location.replace('login.html'); }, 1200);
}

// ===== LOGIN =====
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const remember = document.getElementById('login-remember')?.checked;

    if (!email || !password) {
        showToast('Please fill all fields', 'error');
        return;
    }

    const savedUser = getUsers().find(u => u.email === email);
    const fallbackName = email.includes('@') ? email.split('@')[0] : email;
    setCurrentUser({
        name: savedUser?.name || fallbackName || 'Grocery Shopper',
        email,
        phone: savedUser?.phone || ''
    });
    if (remember) localStorage.setItem('groceryRememberEmail', email);
    else localStorage.removeItem('groceryRememberEmail');
    showToast('Login successful! Redirecting...');
    setTimeout(() => { window.location.href = 'dashboard.html'; }, 1200);
}

function togglePasswordVisibility(inputId, button) {
    const input = document.getElementById(inputId);
    if (!input) return;

    const isHidden = input.type === 'password';
    input.type = isHidden ? 'text' : 'password';
    button.classList.toggle('is-visible', isHidden);
    button.setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password');
    button.setAttribute('aria-pressed', String(isHidden));
    input.focus();
}

function initRememberMe() {
    const emailInput = document.getElementById('login-email');
    const rememberInput = document.getElementById('login-remember');
    const rememberedEmail = localStorage.getItem('groceryRememberEmail');
    if (emailInput && rememberInput && rememberedEmail) {
        emailInput.value = rememberedEmail;
        rememberInput.checked = true;
    }
}

// ===== TOAST NOTIFICATIONS =====
function showToast(message, type = 'success') {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${type === 'success' ? '&#10004;' : '&#9888;'}</span> <span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

// ===== NAVBAR =====
function initNavbar() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navAuth = document.querySelector('.nav-auth');

    if (navLinks && navAuth && !navLinks.querySelector('.mobile-auth-links')) {
        const mobileAuth = document.createElement('li');
        mobileAuth.className = 'mobile-auth-links';

        if (navAuth.querySelector('[onclick*="logout"]')) {
            mobileAuth.innerHTML = '<button type="button" class="btn btn-danger" onclick="logout()">Logout</button>';
        } else {
            navAuth.querySelectorAll('a').forEach(link => {
                const mobileLink = link.cloneNode(true);
                const label = link.textContent.trim();
                mobileLink.classList.add(link.getAttribute('href') === 'signup.html' ? 'mobile-signup-btn' : 'mobile-login-btn');
                mobileLink.innerHTML = `<span>${label}</span>`;
                mobileAuth.appendChild(mobileLink);
            });
        }

        navLinks.appendChild(mobileAuth);
    }

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(a => {
        const href = a.getAttribute('href');
        if (href === currentPage) {
            a.classList.add('active');
        }
    });

    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        }
    });
}

// ===== SIDEBAR TOGGLE =====
function initSidebar() {
    const toggle = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    if (toggle && sidebar) {
        toggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
        document.querySelector('.main-content')?.addEventListener('click', () => {
            sidebar.classList.remove('active');
        });
    }
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

// ===== TABS =====
function initTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const group = btn.closest('.tabs')?.dataset.group || 'default';
            document.querySelectorAll(`.tab-btn[data-group="${group}"]`).forEach(b => b.classList.remove('active'));
            document.querySelectorAll(`.tab-content[data-group="${group}"]`).forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            const target = document.getElementById(btn.dataset.target);
            if (target) target.classList.add('active');
        });
    });
}

// ===== PIE CHART (Pure Canvas) =====
function drawPieChart(canvasId, data, colors, labels) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const total = data.reduce((s, v) => s + v, 0);
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const radius = Math.min(cx, cy) * 0.75;
    let startAngle = -Math.PI / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    data.forEach((value, i) => {
        const sliceAngle = (value / total) * 2 * Math.PI;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, radius, startAngle, startAngle + sliceAngle);
        ctx.closePath();
        ctx.fillStyle = colors[i];
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();

        const midAngle = startAngle + sliceAngle / 2;
        const labelRadius = radius * 0.65;
        const lx = cx + Math.cos(midAngle) * labelRadius;
        const ly = cy + Math.sin(midAngle) * labelRadius;
        if (sliceAngle > 0.3) {
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 12px Poppins';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(Math.round((value / total) * 100) + '%', lx, ly);
        }
        startAngle += sliceAngle;
    });

    ctx.beginPath();
    ctx.arc(cx, cy, radius * 0.4, 0, 2 * Math.PI);
    ctx.fillStyle = '#fff';
    ctx.fill();

    ctx.fillStyle = '#2d3436';
    ctx.font = 'bold 14px Poppins';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(total.toLocaleString(), cx, cy - 8);
    ctx.font = '11px Poppins';
    ctx.fillStyle = '#636e72';
    ctx.fillText('Total', cx, cy + 10);

    const legendContainer = canvas.parentElement?.querySelector('.chart-legend');
    if (legendContainer) {
        legendContainer.innerHTML = labels.map((label, i) =>
            `<div class="legend-item"><div class="legend-color" style="background:${colors[i]}"></div>${label}</div>`
        ).join('');
    }
}

// ===== BAR CHART (Pure Canvas) =====
function drawBarChart(canvasId, data, labels, colors) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const padding = 50;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;
    const maxVal = Math.max(...data);
    const barWidth = (chartWidth / data.length) * 0.6;
    const gap = (chartWidth / data.length) * 0.4;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#dfe6e9';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(canvas.width - padding, y);
        ctx.stroke();
        ctx.fillStyle = '#636e72';
        ctx.font = '11px Poppins';
        ctx.textAlign = 'right';
        ctx.fillText(Math.round(maxVal - (maxVal / 5) * i), padding - 8, y + 4);
    }

    data.forEach((val, i) => {
        const x = padding + i * (barWidth + gap) + gap / 2;
        const barHeight = (val / maxVal) * chartHeight;
        const y = padding + chartHeight - barHeight;

        const gradient = ctx.createLinearGradient(x, y, x, padding + chartHeight);
        gradient.addColorStop(0, colors[i % colors.length]);
        gradient.addColorStop(1, colors[i % colors.length] + '88');
        ctx.fillStyle = gradient;

        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, [6, 6, 0, 0]);
        ctx.fill();

        ctx.fillStyle = '#636e72';
        ctx.font = '11px Poppins';
        ctx.textAlign = 'center';
        ctx.fillText(labels[i], x + barWidth / 2, padding + chartHeight + 20);
    });
}

// ===== LINE CHART (Pure Canvas) =====
function drawLineChart(canvasId, data, labels, color) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const padding = 50;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;
    const maxVal = Math.max(...data) * 1.1;
    const stepX = chartWidth / (data.length - 1);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#dfe6e9';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(canvas.width - padding, y);
        ctx.stroke();
    }

    const points = data.map((val, i) => ({
        x: padding + i * stepX,
        y: padding + chartHeight - (val / maxVal) * chartHeight
    }));

    const gradient = ctx.createLinearGradient(0, padding, 0, padding + chartHeight);
    gradient.addColorStop(0, color + '40');
    gradient.addColorStop(1, color + '05');

    ctx.beginPath();
    ctx.moveTo(points[0].x, padding + chartHeight);
    points.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(points[points.length - 1].x, padding + chartHeight);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    points.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.stroke();

    points.forEach((p, i) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
    });

    ctx.fillStyle = '#636e72';
    ctx.font = '11px Poppins';
    ctx.textAlign = 'center';
    labels.forEach((label, i) => {
        ctx.fillText(label, points[i].x, padding + chartHeight + 20);
    });
}

// ===== DASHBOARD USER GREETING =====
function initDashboard() {
    if (!checkAuth()) return;
    const user = getCurrentUser();
    const greetEl = document.getElementById('user-greeting');
    if (greetEl && user) {
        greetEl.textContent = `Welcome, ${user.name}`;
    }
    const nameEl = document.getElementById('sidebar-user-name');
    if (nameEl && user) {
        nameEl.textContent = user.name;
    }
    const emailEl = document.getElementById('sidebar-user-email');
    if (emailEl && user) {
        emailEl.textContent = user.email;
    }
}

// ===== COUNTER ANIMATION =====
function animateCounters() {
    document.querySelectorAll('.counter').forEach(counter => {
        const target = parseInt(counter.dataset.target);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        const update = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(update);
            } else {
                counter.textContent = target.toLocaleString();
            }
        };
        update();
    });
}

// ===== SEARCH FUNCTIONALITY =====
function initSearch() {
    document.querySelectorAll('.search-bar input').forEach(input => {
        input.addEventListener('keyup', (e) => {
            const query = e.target.value.toLowerCase();
            const grid = e.target.closest('.section')?.querySelector('.products-grid, .categories-grid, .content-grid');
            if (grid) {
                grid.querySelectorAll('.product-card, .category-card, .content-card').forEach(card => {
                    const text = card.textContent.toLowerCase();
                    card.style.display = text.includes(query) ? '' : 'none';
                });
            }
        });
    });
}

// ===== CART SYSTEM =====
function getCart() {
    return JSON.parse(localStorage.getItem('groceryCart') || '[]');
}

function saveCart(cart) {
    localStorage.setItem('groceryCart', JSON.stringify(cart));
    updateCartCount();
}

function addToCart(name, price, image) {
    const cart = getCart();
    const existing = cart.find(item => item.name === name);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ name, price, image, qty: 1 });
    }
    saveCart(cart);
    showToast(`${name} added to cart!`);
}

function removeFromCart(index) {
    const cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
}

function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((s, item) => s + item.qty, 0);
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = count;
        el.style.display = count > 0 ? 'flex' : 'none';
    });
}

// ===== DELIVERY TRACKER ANIMATION =====
function animateDeliveryTracker() {
    const steps = document.querySelectorAll('.tracker-step');
    let currentStep = 0;

    function advanceStep() {
        steps.forEach((step, i) => {
            step.classList.remove('active', 'completed');
            if (i < currentStep) step.classList.add('completed');
            else if (i === currentStep) step.classList.add('active');
        });
        if (currentStep < steps.length - 1) {
            currentStep++;
            setTimeout(advanceStep, 2500);
        }
    }
    if (steps.length) advanceStep();
}

// ===== PRELOADER =====
function hideLoader() {
    const loader = document.getElementById('preloader');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => loader.style.display = 'none', 500);
        }, 800);
    }
}

// ===== DARK MODE TOGGLE =====
function initDarkMode() {
    const toggle = document.getElementById('darkModeToggle');
    if (!toggle) return;
    const isDark = localStorage.getItem('groceryDarkMode') === 'true';
    if (isDark) document.body.classList.add('dark-mode');
    toggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('groceryDarkMode', document.body.classList.contains('dark-mode'));
    });
}

// ===== SHARED SITE FOOTER =====
function renderSiteFooter() {
    document.querySelectorAll('[data-site-footer]').forEach(footer => {
        footer.innerHTML = `
            <div class="footer-content">
                <div class="footer-section footer-brand">
                    <a href="index.html" aria-label="Stackly home"><img class="footer-logo" src="images/stackly-logo.webp" alt="Stackly"></a>
                    <p>Fresh groceries, thoughtful packing and dependable delivery—all brought together for an easier everyday shop.</p>
                    <div class="social-links" aria-label="Stackly social links">
                        <a class="social-facebook" href="404.html" aria-label="Facebook"><img src="images/social-facebook.webp" alt=""></a>
                        <a class="social-x" href="404.html" aria-label="X"><img src="images/social-x.webp" alt=""></a>
                        <a class="social-linkedin" href="404.html" aria-label="LinkedIn"><img src="images/social-linkedin.webp" alt=""></a>
                        <a class="social-instagram" href="404.html" aria-label="Instagram"><img src="images/social-instagram.webp" alt=""></a>
                    </div>
                </div>
                <div class="footer-section">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><a href="products.html">Products</a></li>
                        <li><a href="orders.html">Orders</a></li>
                        <li><a href="offers.html">Offers</a></li>
                        <li><a href="delivery.html">Delivery Info</a></li>
                        <li><a href="contact.html">Contact</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h3>Categories</h3>
                    <ul>
                        <li><a href="products.html">Fresh Fruits</a></li>
                        <li><a href="products.html">Vegetables</a></li>
                        <li><a href="products.html">Dairy Products</a></li>
                        <li><a href="products.html">Bakery Items</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h3>Contact Us</h3>
                    <ul>
                        <li>&#128205; 123 Grocery Street, Food City</li>
                        <li>&#128222; +1 234 567 890</li>
                        <li>&#128231; hello@stackly.com</li>
                        <li>&#128336; Mon - Sun: 7AM - 11PM</li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom"><p>&copy; 2026 Stackly. All rights reserved.</p></div>`;
    });
}

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
    renderSiteFooter();
    initNavbar();
    initSidebar();
    initTabs();
    initSearch();
    hideLoader();
    initDarkMode();
    updateCartCount();
    initRememberMe();

    setTimeout(() => {
        initScrollAnimations();
        animateCounters();
        animateDeliveryTracker();
    }, 200);
});
