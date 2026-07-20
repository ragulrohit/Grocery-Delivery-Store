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

    const activePage = document.body.dataset.adminPage || 'dashboard';
    const currentUser = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
    const userName = currentUser?.name || 'Store Manager';
    const userEmail = currentUser?.email || 'manager@grocery.com';
    const initial = userName.charAt(0).toUpperCase();

    const menuMarkup = adminMenuItems.map(item => `
        <a class="admin-nav-link ${item.id === activePage ? 'active' : ''}" href="${item.href}">
            <span class="admin-nav-icon">${item.icon}</span>
            <span>${item.label}</span>
            ${item.badge ? `<b>${item.badge}</b>` : ''}
        </a>`).join('');

    sidebar.innerHTML = `
        <a class="admin-brand" href="index.html"><img src="images/stackly-logo.webp" alt="Stackly"></a>
        <div class="admin-user-card"><span class="admin-avatar">${initial}</span><div><small>Welcome back</small><strong>${userName}</strong><span>${userEmail}</span></div></div>
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

    const mobileToggle = document.querySelector('[data-admin-toggle]');
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => sidebar.classList.toggle('open'));
    }
    document.querySelector('.admin-main')?.addEventListener('click', event => {
        if (window.innerWidth <= 980 && !event.target.closest('[data-admin-toggle]')) sidebar.classList.remove('open');
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

document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeAdminLogout();
});

document.addEventListener('DOMContentLoaded', initAdminPortal);
