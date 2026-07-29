const revealItems = document.querySelectorAll('.reveal');
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
const navLinks = document.querySelectorAll('.nav a');
const year = document.getElementById('year');
const langButtons = document.querySelectorAll('.lang-btn');

const translations = {
  en: {
    nav_profile: 'Profile',
    nav_experience: 'Experience',
    nav_contact: 'Contact',
    hero_kicker: 'Data Analyst • Data Scientist • Data Engineering',
    hero_copy: 'Data Analyst at <span class="natixis-text">Natixis in Portugal</span>',
    btn_explore: 'Explore Work',
    btn_download: 'CV',
    profile_eyebrow: 'Professional Profile',
    profile_title: 'About Me',
    about_p1: "Data Analyst with expertise in SQL, Python, and data engineering. I hold a Master's degree in Electrical and Computer Engineering from the University of Porto and have experience designing ETL processes, optimizing reports, and building data pipelines in regulated financial environments. I'm passionate about turning complex data into clear, meaningful insights that help solve real problems.",
    about_p2: "Beyond data, I love exploring how technology can make everyday life simpler and more meaningful - whether through automation, creative side projects, or AI experiments. Outside of work, you'll usually find me playing sports, traveling, or discovering new restaurants. I value curiosity, precision, and continuous learning in everything I do.",
    core_stack: 'Core Stack',
    languages_title: 'Languages',
    lang_pt: 'Portuguese (Native)',
    lang_en: 'English (Fluent)',
    lang_es: 'Spanish (Intermediate)',
    experience_eyebrow: 'Experience',
    experience_title: 'Professional Path.',
    exp_1_title: 'Junior Data Analyst · <span class="natixis-text">Natixis in Portugal</span>',
    exp_1_date: 'December 2024 - Present',
    exp_1_desc: 'Responsible for data extraction, transformation, and reporting within the Financing Data team, working on a data lake that mirrors the Oracle-based financing system. Develop custom reports using EasyMorph for data manipulation, addressing requests from shareholders and business stakeholders. Maintain and optimize SQL queries used across ~300 reports, ensuring high performance, data accuracy, and alignment with business needs. Oversee the design, development, maintenance, and validation of 30+ database tables, ensuring data integrity throughout the pipeline. Contribute to a migration project, transitioning ~80 reports from IBM Cognos to EasyMorph and the data lake environment, rewriting complex SQL logic for compatibility and improved efficiency. Built strong expertise in data engineering, ETL design, and cross-functional collaboration within a regulated financial environment.',
    exp_2_title: 'Intern Developer · <span class="natixis-text">Natixis in Portugal</span>',
    exp_2_date: 'December 2023 - December 2024',
    exp_2_desc: 'Developed a project to transition an application from PowerShell to Python, contributing to architecture redesign, technology selection, and feature implementation. Created Python scripts using Pandas and NumPy to automate data extraction and transformation from around 150 files in various formats (CSV, Excel, TXT, JSON), with each script handling multiple input files. This automation enabled seamless integration with reporting pipelines. Used Git and Jenkins for version control and to support continuous integration and deployment throughout the development lifecycle. Contributed to COBOL program development and analysis in a mainframe environment, working with JCL, CICS, and batch processing for financial data processing and job automation.',
    exp_3_title: 'Intern Developer · <span class="fraunhofer-text">Fraunhofer Portugal AICOS</span>',
    exp_3_date: 'February 2023 - July 2023',
    exp_3_desc: 'Developed my master\'s dissertation on generative AI for automating color generation in ceramic product design, in partnership with Fraunhofer Portugal. Fine-tuned existing models and proposed a new approach based on the two most widely used image generation architectures. Worked with HPC environments, Linux, Python, PyTorch, and Jupyter Notebooks. Evaluated model outputs using specific visual quality metrics and questionnaires, contributing to AI adoption in the creative manufacturing.',
    contact_eyebrow: 'Contact',
    projects_eyebrow: 'Projects',
    projects_title: 'Repositories',
    nav_projects: 'Projects',
    nav_dashboard: 'Dashboard',
  },
  pt: {
    nav_profile: 'Perfil',
    nav_experience: 'Experiência',
    nav_contact: 'Contacto',
    hero_kicker: 'Analista de Dados • Cientista de Dados • Engenharia de Dados',
    hero_copy: 'Analista de Dados na <span class="natixis-text">Natixis em Portugal</span>',
    btn_explore: 'Explorar Trabalho',
    btn_download: 'CV',
    profile_eyebrow: 'Perfil Profissional',
    profile_title: 'Sobre Mim',
    about_p1: 'Analista de Dados com experiência em SQL, Python e engenharia de dados. Sou detentor de um mestrado em Engenharia Eletrotécnica e de Computadores pela Universidade do Porto e tenho experiência no desenho de processos ETL, otimização de relatórios e construção de pipelines de dados em ambientes financeiros regulados. Sou apaixonado por transformar dados complexos em insights claros e significativos que ajudam a resolver problemas reais.',
    about_p2: 'Para além de dados, gosto de explorar como a tecnologia pode tornar o dia a dia mais simples e significativo - seja através de automação, projetos criativos ou experiências com IA. Fora do trabalho, costumo estar a praticar desporto, viajar ou descobrir novos restaurantes. Valorizo curiosidade, precisão e aprendizagem contínua em tudo o que faço.',
    core_stack: 'Stack Principal',
    languages_title: 'Línguas',
    lang_pt: 'Português (Nativo)',
    lang_en: 'Inglês (Fluente)',
    lang_es: 'Espanhol (Intermédio)',
    experience_eyebrow: 'Experiência',
    experience_title: 'Trilho Profissional.',
    exp_1_title: 'Analista de Dados Júnior · <span class="natixis-text">Natixis em Portugal</span>',
    exp_1_date: 'Dezembro 2024 - Presente',
    exp_1_desc: 'Responsável pela extração, transformação e reporting na equipa de Financiamento, trabalhando num data lake que espelha o sistema de financiamento baseado em Oracle. Desenvolvo relatórios personalizados com EasyMorph para manipulação de dados, atendendo a solicitações de acionistas e stakeholders de negócio. Mantenho e otimizo consultas SQL usadas em cerca de 300 relatórios, garantindo desempenho elevado, precisão dos dados e alinhamento com as necessidades do negócio. Supervisiono o desenho, desenvolvimento, manutenção e validação de mais de 30 tabelas de base de dados, assegurando integridade dos dados em toda a pipeline. Contribuo para um projeto de migração, transferindo cerca de 80 relatórios do IBM Cognos para EasyMorph e o ambiente de data lake, reescrevendo lógica SQL complexa para compatibilidade e eficiência melhoradas. Desenvolvi forte experiência em engenharia de dados, design de ETL e colaboração cross-functional num ambiente financeiro regulado.',
    exp_2_title: 'Estagiário Desenvolvedor · <span class="natixis-text">Natixis em Portugal</span>',
    exp_2_date: 'Dezembro 2023 - Dezembro 2024',
    exp_2_desc: 'Desenvolvi um projeto para transição de uma aplicação de PowerShell para Python, contribuindo para o redesenho de arquitetura, seleção de tecnologia e implementação de funcionalidades. Criei scripts Python usando Pandas e NumPy para automatizar a extração e transformação de dados de cerca de 150 ficheiros em vários formatos (CSV, Excel, TXT, JSON), com cada script a tratar múltiplos ficheiros de entrada. Esta automação permitiu a integração contínua com pipelines de reporting. Usei Git e Jenkins para controlo de versão e para suportar integração contínua e deployment ao longo do ciclo de desenvolvimento. Contribuí para desenvolvimento e análise de programas COBOL em ambiente mainframe, trabalhando com JCL, CICS e processamento batch para automação de dados financeiros.',
    exp_3_title: 'Estagiário Desenvolvedor · <span class="fraunhofer-text">Fraunhofer Portugal AICOS</span>',
    exp_3_date: 'Fevereiro 2023 - Julho 2023',
    exp_3_desc: 'Desenvolvi a minha dissertação de mestrado sobre IA generativa para automatizar a geração de cores no design de produtos cerâmicos, em parceria com a Fraunhofer Portugal. Ajustei modelos existentes e propus uma nova abordagem baseada nas duas arquiteturas de geração de imagem mais utilizadas. Trabalhei com ambientes de HPC, Linux, Python, PyTorch e Jupyter Notebooks. Avaliei as saídas dos modelos usando métricas de qualidade visual específicas e questionários, contribuindo para a adoção de IA na manufatura criativa.',
    contact_eyebrow: 'Contacto',
    projects_eyebrow: 'Projetos',
    projects_title: 'Repositórios',
    nav_projects: 'Projetos',
    nav_dashboard: 'Dashboard',
  },
};

const setLanguage = (language) => {
  const locale = translations[language] ? language : 'en';
  localStorage.setItem('portfolioLang', locale);
  document.documentElement.setAttribute('lang', locale);

  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const key = element.dataset.i18n;
    const value = translations[locale][key];
    if (value) {
      element.textContent = value;
    }
  });

  document.querySelectorAll('[data-i18n-html]').forEach((element) => {
    const key = element.dataset.i18nHtml;
    const value = translations[locale][key];
    if (value) {
      element.innerHTML = value;
    }
  });

  langButtons.forEach((button) => {
    const active = button.dataset.lang === locale;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
};

const defaultLanguage = localStorage.getItem('portfolioLang') || (navigator.language?.startsWith('pt') ? 'pt' : 'en');

if (year) {
  year.textContent = new Date().getFullYear();
}

if (langButtons.length > 0) {
  langButtons.forEach((button) => {
    button.addEventListener('click', () => setLanguage(button.dataset.lang));
  });
}

setLanguage(defaultLanguage);

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

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// GitHub projects fetch and render
async function fetchAndRenderRepos(username) {
  const container = document.getElementById('repos');
  if (!container || !username) return;
  container.innerHTML = '<p>Loading repositories…</p>';
  try {
    const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=50`);
    if (!res.ok) throw new Error('GitHub API error');
    const repos = await res.json();
    if (!Array.isArray(repos) || repos.length === 0) {
      container.innerHTML = '<p>No repositories found.</p>';
      return;
    }
    container.innerHTML = '';
    repos.forEach((repo) => {
      const el = document.createElement('article');
      el.className = 'repo-card glass-card';
      el.innerHTML = `
        <h3><a href="${repo.html_url}" target="_blank" rel="noreferrer">${repo.name}</a></h3>
        <p class="repo-desc">${repo.description || ''}</p>
        <p class="meta">${repo.language || ''}</p>
      `;
      container.appendChild(el);
    });
  } catch (err) {
    container.innerHTML = '<p>Failed to load repositories.</p>';
    console.error(err);
  }
}

const defaultGitHubUser = 'FranciscoFMSamagaio';
if (document.getElementById('repos')) {
  fetchAndRenderRepos(defaultGitHubUser);
}
