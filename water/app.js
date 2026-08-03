const API_BASE = window.API_BASE_URL || 'http://127.0.0.1:8001';
const API_HEADERS = window.API_HEADERS || {};
const quickAmounts = [200, 250, 500, 750, 1000];

function getApiUrl(path) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE}${normalizedPath}`;
}

function buildRequestOptions(method = 'GET', body = null) {
  const headers = { ...API_HEADERS };
  if (body !== null) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  }

  const options = { method, headers };
  if (body !== null) {
    options.body = typeof body === 'string' ? body : JSON.stringify(body);
  }
  return options;
}

const state = {
  goal: 2500,
  total: 0,
  history: [],
};

const els = {
  todayTotal: document.getElementById('todayTotal'),
  goalValue: document.getElementById('goalValue'),
  remainingValue: document.getElementById('remainingValue'),
  percentageValue: document.getElementById('percentageValue'),
  progressFill: document.getElementById('progressFill'),
  latestEntry: document.getElementById('latestEntry'),
  connectionStatus: document.getElementById('connectionStatus'),
  quickActions: document.getElementById('quickActions'),
  modalQuickActions: document.getElementById('modalQuickActions'),
  manualAmount: document.getElementById('manualAmount'),
  modalManualAmount: document.getElementById('modalManualAmount'),
  goalInput: document.getElementById('goalInput'),
  saveManualBtn: document.getElementById('saveManualBtn'),
  confirmModalBtn: document.getElementById('confirmModalBtn'),
  saveGoalBtn: document.getElementById('saveGoalBtn'),
  historyList: document.getElementById('historyList'),
  modalBackdrop: document.getElementById('modalBackdrop'),
  openModalBtn: document.getElementById('openModalBtn'),
  closeModalBtn: document.getElementById('closeModalBtn'),
};

function formatAmount(value) {
  return `${value} ml`;
}

function formatEntryTimestamp(entry) {
  const date = new Date(entry.created_at);
  return `${date.toLocaleDateString()} · ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}

function renderQuickActions(container) {
  container.innerHTML = '';
  quickAmounts.forEach((amount) => {
    const button = document.createElement('button');
    button.className = 'quick-btn';
    button.textContent = `${amount} ml`;
    button.addEventListener('click', () => addWater(amount, 'shortcut'));
    container.appendChild(button);
  });
}

function updateSummary() {
  const remaining = Math.max(state.goal - state.total, 0);
  const percentage = state.goal > 0 ? Math.min(Math.round((state.total / state.goal) * 100), 100) : 0;
  els.todayTotal.textContent = formatAmount(state.total);
  els.goalValue.textContent = formatAmount(state.goal);
  els.remainingValue.textContent = formatAmount(remaining);
  els.percentageValue.textContent = `${percentage}%`;
  els.progressFill.style.width = `${percentage}%`;

  const latest = state.history[0];
  els.latestEntry.textContent = latest
    ? `Last entry: ${latest.amount_ml} ml · ${formatEntryTimestamp(latest)}`
    : 'No entries yet.';
}

function setLoadingState() {
  els.todayTotal.textContent = 'Loading…';
  els.goalValue.textContent = '—';
  els.remainingValue.textContent = '—';
  els.percentageValue.textContent = '—';
  els.progressFill.style.width = '0%';
  els.latestEntry.textContent = 'Connecting to your dashboard…';
  els.connectionStatus.textContent = 'Connecting to API…';
}

function renderHistory() {
  if (!state.history.length) {
    els.historyList.innerHTML = '<li class="history-item"><span class="muted">No water entries yet.</span></li>';
    return;
  }

  els.historyList.innerHTML = '';
  state.history.forEach((entry) => {
    const item = document.createElement('li');
    item.className = 'history-item';
    item.innerHTML = `
      <div>
        <strong>${entry.amount_ml} ml</strong>
        <div class="muted small">${formatEntryTimestamp(entry)}</div>
      </div>
    `;
    els.historyList.appendChild(item);
  });
}

async function loadDashboard() {
  setLoadingState();
  try {
    const [summaryRes, historyRes, settingsRes] = await Promise.all([
      fetch(getApiUrl('/water/today'), buildRequestOptions()),
      fetch(getApiUrl('/water/history'), buildRequestOptions()),
      fetch(getApiUrl('/settings'), buildRequestOptions()),
    ]);

    if (!summaryRes.ok || !historyRes.ok || !settingsRes.ok) {
      throw new Error('Unable to load dashboard data');
    }

    const summary = await summaryRes.json();
    const history = await historyRes.json();
    const settings = await settingsRes.json();

    state.total = summary.today_total_ml || 0;
    state.goal = settings.daily_water_goal_ml || 2500;
    state.history = history || [];

    updateSummary();
    renderHistory();
    els.connectionStatus.textContent = 'Connected to API';
  } catch (error) {
    console.error(error);
    els.latestEntry.textContent = 'Dashboard is offline. Start the API to sync data.';
    els.connectionStatus.textContent = 'Offline';
    els.historyList.innerHTML = '<li class="history-item"><span class="muted">Unable to reach the API right now.</span></li>';
  }
}

async function addWater(amount, source = 'manual') {
  if (!Number.isFinite(amount) || amount <= 0) return;
  try {
    const res = await fetch(getApiUrl('/water'), buildRequestOptions('POST', { amount_ml: amount }));

    if (!res.ok) {
      throw new Error('Unable to save water entry');
    }

    await loadDashboard();
    closeModal();
  } catch (error) {
    console.error(error);
    els.latestEntry.textContent = 'Could not save the entry.';
    els.connectionStatus.textContent = 'Failed to save';
  }
}

async function updateGoal(goal) {
  try {
    const res = await fetch(getApiUrl('/settings'), buildRequestOptions('PUT', { daily_water_goal_ml: goal }));

    if (!res.ok) {
      throw new Error('Unable to update goal');
    }

    state.goal = goal;
    updateSummary();
  } catch (error) {
    console.error(error);
  }
}

function openModal() {
  els.modalBackdrop.classList.remove('hidden');
}

function closeModal() {
  els.modalBackdrop.classList.add('hidden');
}

els.openModalBtn?.addEventListener('click', openModal);
els.closeModalBtn?.addEventListener('click', closeModal);
els.modalBackdrop?.addEventListener('click', (event) => {
  if (event.target === els.modalBackdrop) {
    closeModal();
  }
});

els.saveManualBtn?.addEventListener('click', () => {
  const amount = Number(els.manualAmount.value);
  addWater(amount, 'manual');
});

els.confirmModalBtn?.addEventListener('click', () => {
  const amount = Number(els.modalManualAmount.value);
  addWater(amount, 'manual');
});

els.saveGoalBtn?.addEventListener('click', () => {
  const goal = Number(els.goalInput.value);
  updateGoal(goal);
});

renderQuickActions(els.quickActions);
renderQuickActions(els.modalQuickActions);
loadDashboard();
