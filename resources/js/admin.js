import BookAvailabilityManager from '@/features/admin/BookAvailabilityManager';
import { createElement } from 'react';
import { createRoot } from 'react-dom/client';

const sidebar = document.querySelector('#admin-sidebar');
const trigger = document.querySelector('[data-admin-menu]');
const overlay = document.querySelector('[data-admin-overlay]');
const desktop = window.matchMedia('(min-width: 1024px)');
let isOpen = false;
let previousOverflow = '';

function setMenuOpen(open) {
    if (!sidebar || !trigger || !overlay) return;
    const nextOpen = open && !desktop.matches;
    if (nextOpen && !isOpen) previousOverflow = document.body.style.overflow;
    isOpen = nextOpen;
    sidebar.classList.toggle('-translate-x-full', !isOpen);
    sidebar.inert = !desktop.matches && !isOpen;
    overlay.hidden = !isOpen;
    trigger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : previousOverflow;
    if (isOpen) sidebar.querySelector('a, button')?.focus();
}

trigger?.addEventListener('click', () => setMenuOpen(!isOpen));
document.querySelector('[data-admin-menu-close]')?.addEventListener('click', () => {
    setMenuOpen(false);
    trigger?.focus();
});
overlay?.addEventListener('click', () => {
    setMenuOpen(false);
    trigger?.focus();
});
desktop.addEventListener('change', () => setMenuOpen(false));
setMenuOpen(false);

document.addEventListener('keydown', (event) => {
    if (isOpen && event.key === 'Escape') {
        event.preventDefault();
        setMenuOpen(false);
        trigger?.focus();
    }
    if (!isOpen || event.key !== 'Tab') return;
    const elements = [...sidebar.querySelectorAll('a[href], button:not([disabled])')].filter((element) => element.getClientRects().length > 0);
    const first = elements[0];
    const last = elements.at(-1);
    if (event.shiftKey && (document.activeElement === first || !sidebar.contains(document.activeElement))) {
        event.preventDefault();
        last?.focus();
    } else if (!event.shiftKey && (document.activeElement === last || !sidebar.contains(document.activeElement))) {
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

const availabilityRoot = document.querySelector('[data-admin-availability]');
if (availabilityRoot) {
    createRoot(availabilityRoot).render(
        createElement(BookAvailabilityManager, {
            books: JSON.parse(availabilityRoot.dataset.books),
            dashboardUrl: availabilityRoot.dataset.dashboardUrl,
        }),
    );
}
