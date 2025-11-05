(() => {
  'use strict';


const normalizePath = (path) => {
    if (!path) return '/';
    let p = path.replace(/\/+/g, '/'); 
    p =  p.replace(/\/index\.html?$/i, '/'); 
    if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);
    return p;
};



  const highlightActiveNav = () => {
    const current = new URL(window.location.href);
    const currentPath = normalizePath(current.pathname);

    document.querySelectorAll('.nav__link').forEach((a) => {
      const url = new URL(a.href, window.location.origin);
      const linkPath = normalizePath(url.pathname);
      const isSame =
        linkPath === currentPath ||
        (linkPath === '' && currentPath === '/') ||
        (linkPath === '/' && currentPath === '/');

      if (isSame) {
        a.classList.add('is-active');
        a.setAttribute('aria-current', 'page');
      } else {
        a.classList.remove('is-active');
        a.removeAttribute('aria-current');
      }
    });
  };


  const reportLoadTime = () => {
    let ms = null;
    const n = performance.getEntriesByType('navigation')[0];
    if (n) ms = n.loadEventEnd;
    else if (performance.timing)
      ms = performance.timing.loadEventEnd - performance.timing.navigationStart;

    if (!ms || ms < 0) return;

    const footer = document.querySelector('.footer');
    if (!footer) return;

    let box = footer.querySelector('[data-load-time]');
    if (!box) {
      box = document.createElement('p');
      box.dataset.loadTime = 'true';
      footer.appendChild(box);
    }
    const rounded = Math.round(ms);
    const now = new Date();
    box.textContent = `Страница загружена за ${rounded} мс • ${now.toLocaleString()}`;
  };

  window.addEventListener('DOMContentLoaded', highlightActiveNav);
  window.addEventListener('load', reportLoadTime);
})();
