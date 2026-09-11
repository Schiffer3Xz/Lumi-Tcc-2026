import '../css/admin.css';

const sidebar = document.querySelector('#admin-sidebar');
const trigger = document.querySelector('[data-admin-menu]');
const overlay = document.querySelector('[data-admin-overlay]');
const desktop = window.matchMedia('(min-width: 1024px)');
let isOpen = false;

function setMenuOpen(open) {
    if (!sidebar || !trigger || !overlay) return;
    isOpen = open && !desktop.matches;
    sidebar.classList.toggle('-translate-x-full', !isOpen);
    sidebar.inert = !desktop.matches && !isOpen;
    overlay.hidden = !isOpen;
    trigger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
    if (isOpen) sidebar.querySelector('a, button')?.focus();
}

trigger?.addEventListener('click', () => setMenuOpen(!isOpen));
overlay?.addEventListener('click', () => {
    setMenuOpen(false);
    trigger?.focus();
});
desktop.addEventListener('change', () => setMenuOpen(false));
setMenuOpen(false);

document.addEventListener('keydown', (event) => {
    if (isOpen && event.key === 'Escape') {
        setMenuOpen(false);
        trigger?.focus();
    }
    if (!isOpen || event.key !== 'Tab') return;
    const elements = [...sidebar.querySelectorAll('a[href], button:not([disabled])')];
    const first = elements[0];
    const last = elements.at(-1);
    if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
    }
});

const account = document.querySelector('[data-admin-account]');
document.addEventListener('click', (event) => {
    if (account && !account.contains(event.target)) account.open = false;
});
account?.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        account.open = false;
        account.querySelector('summary')?.focus();
    }
});
