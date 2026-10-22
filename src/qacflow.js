// Q.A.C-Flow section: the monitor-screen tabs.
//
// Each panel holds its own <img loading="lazy">; hidden panels are display:none, so the
// browser only fetches a screen once its tab is opened. Arrow keys move between tabs
// (WAI-ARIA tabs pattern, automatic activation).

export function initQacFlow(root = document) {
  const list = root.querySelector('#qac-flow [role="tablist"]');
  if (!list) return;
  const tabs = Array.from(list.querySelectorAll('[role="tab"]'));

  const select = (tab, focus = false) => {
    tabs.forEach(t => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
    if (focus) tab.focus();
  };

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('keydown', e => {
      const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
      if (step) { e.preventDefault(); select(tabs[(i + step + tabs.length) % tabs.length], true); }
      else if (e.key === 'Home') { e.preventDefault(); select(tabs[0], true); }
      else if (e.key === 'End') { e.preventDefault(); select(tabs[tabs.length - 1], true); }
    });
  });
}
