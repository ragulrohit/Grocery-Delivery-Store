const adminMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '&#8962;', href: 'dashboard.html' },
    { id: 'orders', label: 'Orders', icon: '&#128230;', href: 'admin-orders.html', badge: '12' },
    { id: 'products', label: 'Products', icon: '&#128722;', href: 'admin-products.html' },
    { id: 'inventory', label: 'Inventory', icon: '&#128203;', href: 'admin-inventory.html', badge: '6' },
    { id: 'deliveries', label: 'Deliveries', icon: '&#128666;', href: 'admin-deliveries.html', badge: '8' },
    { id: 'customers', label: 'Customers', icon: '&#128101;', href: 'admin-customers.html' },
    { id: 'offers', label: 'Offers', icon: '&#127873;', href: 'admin-offers.html' },
    { id: 'analytics', label: 'Analytics', icon: '&#128200;', href: 'admin-analytics.html' },
    { id: 'support', label: 'Support', icon: '&#127911;', href: 'admin-support.html', badge: '3' },
    { id: 'settings', label: 'Settings', icon: '&#9881;', href: 'admin-settings.html' }
];

function initAdminPortal() {
    const shell = document.querySelector('.admin-portal');
    const sidebar = document.querySelector('[data-admin-sidebar]');
    if (!shell || !sidebar) return;

    if (typeof checkAuth === 'function' && !checkAuth()) return;

    const activePage = document.body.dataset.adminPage || 'dashboard';
    const currentUser = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
    const userName = currentUser?.name || 'Store Manager';
    const userEmail = currentUser?.email || 'manager@grocery.com';
    const initial = userName.charAt(0).toUpperCase();

    const escapeAdminText = value => String(value).replace(/[&<>"']/g, character => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
    })[character]);
    const safeUserName = escapeAdminText(userName);
    const safeUserEmail = escapeAdminText(userEmail);
    const safeInitial = escapeAdminText(initial);
    const adminMain = document.querySelector('.admin-main');
    if (adminMain && !adminMain.querySelector('.admin-mobile-brand')) {
        adminMain.insertAdjacentHTML('afterbegin', `
            <a class="admin-mobile-brand" href="index.html" aria-label="Stackly home">
                <img src="images/stackly-logo.webp" alt="Stackly">
            </a>`);
    }

    const menuMarkup = adminMenuItems.map(item => `
        <a class="admin-nav-link ${item.id === activePage ? 'active' : ''}" href="${item.href}">
            <span class="admin-nav-icon">${item.icon}</span>
            <span>${item.label}</span>
            ${item.badge ? `<b>${item.badge}</b>` : ''}
        </a>`).join('');

    sidebar.innerHTML = `
        <a class="admin-brand" href="index.html"><img src="images/stackly-logo.webp" alt="Stackly"></a>
        <div class="admin-user-card"><span class="admin-avatar">${safeInitial}</span><div><small>Welcome back</small><strong>${safeUserName}</strong><span>${safeUserEmail}</span></div></div>
        <p class="admin-nav-label">Store control</p>
        <nav class="admin-nav">${menuMarkup}</nav>
        <div class="admin-sidebar-actions"><button type="button" onclick="openAdminLogout()"><span>&#10162;</span> Logout</button></div>`;

    if (!document.querySelector('[data-admin-logout-modal]')) {
        document.body.insertAdjacentHTML('beforeend', `
            <div class="admin-logout-modal" data-admin-logout-modal aria-hidden="true">
                <div class="admin-logout-backdrop" onclick="closeAdminLogout()"></div>
                <section class="admin-logout-dialog" role="dialog" aria-modal="true" aria-labelledby="admin-logout-title">
                    <span class="admin-logout-symbol" aria-hidden="true">&#10162;</span>
                    <p class="admin-eyebrow">End admin session</p>
                    <h2 id="admin-logout-title">Ready to log out?</h2>
                    <p>You will return to the login page. Any unsaved changes on this screen may be lost.</p>
                    <div class="admin-logout-actions">
                        <button type="button" class="btn btn-outline" onclick="closeAdminLogout()">Cancel</button>
                        <button type="button" class="btn btn-danger" onclick="confirmAdminLogout()">Confirm Logout</button>
                    </div>
                </section>
            </div>`);
    }

    const profileButton = document.querySelector('.admin-profile-btn');
    if (profileButton) {
        profileButton.innerHTML = `<span class="admin-profile-avatar">${safeInitial}</span><span class="admin-profile-copy"><strong>${safeUserName}</strong><small>${safeUserEmail}</small></span>`;
        profileButton.setAttribute('aria-label', `Signed in as ${userEmail}`);
        profileButton.title = userEmail;
    }

    document.body.insertAdjacentHTML('beforeend', '<button type="button" class="admin-sidebar-backdrop" data-admin-sidebar-backdrop aria-label="Close menu"></button>');
    const sidebarBackdrop = document.querySelector('[data-admin-sidebar-backdrop]');
    const mobileToggle = document.querySelector('[data-admin-toggle]');
    const closeSidebar = () => {
        sidebar.classList.remove('open');
        document.body.classList.remove('admin-menu-open');
        mobileToggle?.setAttribute('aria-expanded', 'false');
        mobileToggle?.setAttribute('aria-label', 'Open menu');
    };
    if (mobileToggle) {
        mobileToggle.innerHTML = '<span aria-hidden="true">&#9776;</span><span>Menu</span>';
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.addEventListener('click', () => {
            const isOpen = sidebar.classList.toggle('open');
            document.body.classList.toggle('admin-menu-open', isOpen);
            mobileToggle.setAttribute('aria-expanded', String(isOpen));
            mobileToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
        });
    }
    sidebarBackdrop?.addEventListener('click', closeSidebar);
    adminMain?.addEventListener('click', event => {
        if (window.innerWidth <= 980 && sidebar.classList.contains('open') && !event.target.closest('[data-admin-toggle]')) closeSidebar();
    });
    window.addEventListener('resize', () => {
        if (window.innerWidth > 980) closeSidebar();
    });

    document.querySelectorAll('[data-admin-user-name]').forEach(node => { node.textContent = userName; });
}

function openAdminLogout() {
    const modal = document.querySelector('[data-admin-logout-modal]');
    if (!modal) return;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('admin-modal-open');
    modal.querySelector('.admin-logout-actions .btn-outline')?.focus();
}

function closeAdminLogout() {
    const modal = document.querySelector('[data-admin-logout-modal]');
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('admin-modal-open');
}

function confirmAdminLogout() {
    if (typeof logout === 'function') logout();
}

function initAdminResponsiveSelects() {
    document.querySelectorAll('[data-admin-select]').forEach(wrapper => {
        const valueInput = wrapper.querySelector('input[type="hidden"]');
        const toggle = wrapper.querySelector('.admin-select-toggle');
        const toggleValue = toggle?.querySelector('span');
        const menu = wrapper.querySelector('.admin-select-menu');
        const options = Array.from(menu?.querySelectorAll('.admin-select-option') || []);
        if (!valueInput || !toggle || !toggleValue || !menu || !options.length) return;

        const closeMenu = () => {
            wrapper.classList.remove('is-open');
            toggle.setAttribute('aria-expanded', 'false');
        };

        const syncSelection = () => {
            const selected = options.find(option => option.dataset.value === valueInput.value);
            toggleValue.textContent = selected?.textContent || valueInput.value;
            options.forEach(option => {
                option.setAttribute('aria-selected', String(option.dataset.value === valueInput.value));
            });
        };

        toggle.addEventListener('click', () => {
            const willOpen = !wrapper.classList.contains('is-open');
            document.querySelectorAll('[data-admin-select].is-open').forEach(openSelect => {
                openSelect.classList.remove('is-open');
                openSelect.querySelector('.admin-select-toggle')?.setAttribute('aria-expanded', 'false');
            });
            wrapper.classList.toggle('is-open', willOpen);
            toggle.setAttribute('aria-expanded', String(willOpen));
            if (willOpen) menu.querySelector('[aria-selected="true"]')?.focus();
        });

        options.forEach(option => {
            option.addEventListener('click', () => {
                valueInput.value = option.dataset.value;
                valueInput.dispatchEvent(new Event('change', { bubbles: true }));
                syncSelection();
                closeMenu();
                toggle.focus();
            });
        });

        wrapper.addEventListener('keydown', event => {
            const focusedIndex = options.indexOf(document.activeElement);
            if (event.key === 'Escape') {
                closeMenu();
                toggle.focus();
            } else if (event.key === 'ArrowDown' && wrapper.classList.contains('is-open')) {
                event.preventDefault();
                options[Math.min(focusedIndex + 1, options.length - 1)]?.focus();
            } else if (event.key === 'ArrowUp' && wrapper.classList.contains('is-open')) {
                event.preventDefault();
                options[Math.max(focusedIndex - 1, 0)]?.focus();
            }
        });

        document.addEventListener('click', event => {
            if (!wrapper.contains(event.target)) closeMenu();
        });
        syncSelection();
    });
}

document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeAdminLogout();
});

document.addEventListener('DOMContentLoaded', () => {
    initAdminResponsiveSelects();
    initAdminPortal();
});
