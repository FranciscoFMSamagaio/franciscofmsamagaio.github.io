const revealItems = document.querySelectorAll('.reveal');
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
const navLinks = document.querySelectorAll('.nav a');
const year = document.getElementById('year');
if (year) {
  year.textContent = new Date().getFullYear();
}

document.querySelectorAll('.experience-description').forEach(paragraph => {
  const list = document.createElement('ul');
  paragraph.textContent.trim().replace(/\s+/g, ' ').split(/(?<=\.)\s+(?=[A-Z])/).forEach(sentence => {
    const item = document.createElement('li');
    item.textContent = sentence;
    list.appendChild(item);
  });
  paragraph.replaceWith(list);
});

const timeline = document.querySelector('.timeline');
if (timeline) {
  const layout = document.createElement('div');
  layout.className = 'experience-layout';
  timeline.before(layout);
  const tabs = document.createElement('div');
  tabs.className = 'experience-tabs';
  tabs.setAttribute('role', 'tablist');
  tabs.setAttribute('aria-label', 'Roles and companies');
  const labels = [['Natixis', 'Data Analyst'], ['Natixis', 'Developer'], ['Fraunhofer', 'AI Research']];
  const panels = [...timeline.querySelectorAll('.timeline-item')];
  const activate = (index) => {
    [...tabs.children].forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(i === index));
      tab.tabIndex = i === index ? 0 : -1;
      panels[i].hidden = i !== index;
    });
  };
  panels.forEach((panel, i) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.id = `experience-tab-${i}`;
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-controls', `experience-panel-${i}`);
    button.append(document.createTextNode(labels[i][0]));
    const label = document.createElement('small');
    label.textContent = labels[i][1];
    button.append(label);
    panel.id = `experience-panel-${i}`;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', button.id);
    panel.tabIndex = 0;
    button.addEventListener('click', () => activate(i));
    button.addEventListener('keydown', event => {
      let next = i;
      if (['ArrowRight', 'ArrowDown'].includes(event.key)) next = (i + 1) % panels.length;
      else if (['ArrowLeft', 'ArrowUp'].includes(event.key)) next = (i + panels.length - 1) % panels.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = panels.length - 1;
      else return;
      event.preventDefault();
      activate(next);
      tabs.children[next].focus();
    });
    tabs.append(button);
  });
  layout.append(tabs, timeline);
  activate(0);
}

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('in-view'));
}

if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav.classList.contains('open')) {
      nav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.focus();
    }
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Render remote content as text, with a direct GitHub link when the API is unavailable.
const defaultGitHubUser = 'FranciscoFMSamagaio';
function repoStatus(key) {
  const container = document.getElementById('repos');
  const message = document.createElement('p');
  message.className = 'repos-status';
  const status = document.createElement('span');
  const messages = {
    loading: 'Loading repositories…',
    empty: 'No public repositories available.',
    failed: 'Projects are temporarily unavailable.',
  };
  status.textContent = messages[key];
  const link = document.createElement('a');
  link.href = `https://github.com/${defaultGitHubUser}?tab=repositories`;
  link.textContent = 'View repositories on GitHub ↗';
  message.append(status, document.createElement('br'), link);
  container.replaceChildren(message);
}
async function fetchAndRenderRepos(username) {
  const container = document.getElementById('repos');
  if (!container) return;
  repoStatus('loading');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`, { signal: controller.signal });
    if (!response.ok) throw new Error('GitHub API unavailable');
    const repos = await response.json();
    if (!Array.isArray(repos)) throw new Error('Invalid repository response');
    if (!repos.length) { repoStatus('empty'); return; }
    const fragment = document.createDocumentFragment();
    repos.forEach(repo => {
      const card = document.createElement('article');
      card.className = 'repo-card';
      const top = document.createElement('div');
      top.className = 'repo-top';
      top.setAttribute('aria-hidden', 'true');
      top.innerHTML = '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M3 8h10l3 4h13v15H3z"/><path d="M3 8V5h10l3 3h13v4"/></svg><span class="repo-arrow">↗</span>';
      const heading = document.createElement('h3');
      const link = document.createElement('a');
      link.href = `https://github.com/${encodeURIComponent(username)}/${encodeURIComponent(repo.name)}`;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = repo.name.replace(/[-_]/g, ' ');
      heading.append(link);
      const description = document.createElement('p');
      description.className = 'repo-desc';
      description.textContent = repo.description || '';
      const meta = document.createElement('p');
      meta.className = 'meta';
      meta.textContent = repo.language || '';
      card.append(top, heading, description, meta);
      fragment.append(card);
    });
    container.replaceChildren(fragment);
  } catch { repoStatus('failed'); }
  finally { clearTimeout(timeout); }
}
fetchAndRenderRepos(defaultGitHubUser);

if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => {
        if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-15% 0px -60% 0px', threshold: 0 });
  document.querySelectorAll('main section[id]').forEach(section => sectionObserver.observe(section));
}
