(() => {
  const navWrap = document.querySelector('.nav-wrap');
  const mainNav = navWrap?.querySelector('.main-nav');
  if (!navWrap || !mainNav) return;

  const menuButton = navWrap.querySelector('.mobile-btn') || document.createElement('button');
  if (!menuButton.classList.contains('mobile-btn')) {
    menuButton.className = 'mobile-btn';
    menuButton.type = 'button';
    menuButton.setAttribute('aria-label', 'Toggle navigation');
    menuButton.innerHTML = '<span></span><span></span><span></span>';
    navWrap.append(menuButton);
  }

  if (!mainNav.id) mainNav.id = 'main-navigation';
  menuButton.setAttribute('aria-controls', mainNav.id);
  menuButton.setAttribute('aria-expanded', 'false');

  const closeDropdowns = (except) => {
    navWrap.querySelectorAll('.nav-dropdown.is-open').forEach((dropdown) => {
      if (dropdown === except) return;
      dropdown.classList.remove('is-open');
      dropdown.querySelector('.nav-toggle')?.setAttribute('aria-expanded', 'false');
    });
  };

  const setMenuOpen = (open) => {
    navWrap.classList.toggle('mobile-nav-open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    if (!open) closeDropdowns();
  };

  menuButton.addEventListener('click', () => {
    setMenuOpen(!navWrap.classList.contains('mobile-nav-open'));
  });

  mainNav.querySelectorAll('.nav-toggle').forEach((toggle) => {
    const dropdown = toggle.closest('.nav-dropdown');
    if (!dropdown) return;
    toggle.setAttribute('aria-haspopup', 'true');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.addEventListener('click', () => {
      const open = !dropdown.classList.contains('is-open');
      closeDropdowns(dropdown);
      dropdown.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
    });
  });

  mainNav.addEventListener('click', (event) => {
    if (event.target.closest('a')) setMenuOpen(false);
  });

  document.addEventListener('click', (event) => {
    if (!navWrap.contains(event.target)) setMenuOpen(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navWrap.classList.contains('mobile-nav-open')) {
      setMenuOpen(false);
      menuButton.focus();
    }
  });

  window.addEventListener('resize', () => {
    if (window.matchMedia('(min-width: 981px)').matches) setMenuOpen(false);
  });
})();
