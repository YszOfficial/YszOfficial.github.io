(() => {
  const root = document.documentElement;
  const key = 'shizhao-theme';
  const valid = value => value === 'light' || value === 'dark';
  let preference = null;
  try {
    const saved = localStorage.getItem(key);
    if (valid(saved)) preference = saved;
  } catch (_) { /* Themes still work when storage is unavailable. */ }

  let button;
  const apply = () => {
    const theme = preference || 'dark';
    root.dataset.theme = theme;
    if (button) {
      const label = `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`;
      button.setAttribute('aria-label', label);
      button.title = label;
    }
  };
  // Apply before styles load so returning visitors see their chosen theme immediately.
  apply();
  document.addEventListener('DOMContentLoaded', () => {
    button = document.getElementById('theme-toggle');
    if (!button) return;
    apply();
    button.hidden = false;
    button.addEventListener('click', () => {
      preference = root.dataset.theme === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem(key, preference); } catch (_) {}
      apply();
    });
  });
  window.addEventListener('storage', event => {
    if (event.key !== key && event.key !== null) return;
    preference = valid(event.newValue) ? event.newValue : null;
    apply();
  });
})();
