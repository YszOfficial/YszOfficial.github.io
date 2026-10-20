(() => {
  const frame = document.getElementById('hugo-demo');
  const panel = frame?.querySelector('.hugo-panel');
  const videos = panel ? Array.from(panel.querySelectorAll('video')) : [];
  if (!panel || !videos.length) return;
  const fit = () => {
    const scale = Math.min(frame.clientWidth / 800, frame.clientHeight / panel.offsetHeight);
    panel.style.transform = `scale(${scale})`;
    panel.style.left = `${(frame.clientWidth - 800 * scale) / 2}px`;
    panel.style.top = `${(frame.clientHeight - panel.offsetHeight * scale) / 2}px`;
  };
  new ResizeObserver(fit).observe(frame);
  for (const video of videos) {
    video.muted = true;
    video.addEventListener('loadedmetadata', fit);
  }
  fit();
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let wantsPlayback = !motion.matches;
  let inView = false;
  const updateButton = () => {
    const playing = videos.some(video => !video.paused);
    frame.setAttribute('aria-label', `${playing ? 'Pause' : 'Play'} HuGo hardware demonstrations: Push Button 93.3%, Lift Box 66.7%.`);
  };
  const sync = () => {
    for (const video of videos) {
      if (wantsPlayback && inView && !document.hidden) video.play().catch(updateButton);
      else video.pause();
    }
    updateButton();
  };
  const togglePlayback = () => {
    wantsPlayback = videos.every(video => video.paused);
    sync();
  };
  frame.addEventListener('click', togglePlayback);
  frame.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      togglePlayback();
    }
  });
  for (const video of videos) {
    video.addEventListener('play', updateButton);
    video.addEventListener('pause', updateButton);
  }
  motion.addEventListener('change', () => { wantsPlayback = !motion.matches; sync(); });
  document.addEventListener('visibilitychange', sync);
  new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    sync();
  }, { threshold: 0.2 }).observe(frame);
  updateButton();
})();
