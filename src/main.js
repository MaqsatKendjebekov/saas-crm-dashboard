import {
  fetchWorkspaceData,
  getSession,
  insertRecord,
  isOAuthEnabled,
  onAuthStateChange,
  signInWithOAuth,
  signInWithPassword,
  signOut,
  signUpWithPassword,
  supabaseEnabled,
  updateDealStage
} from "./lib/supabase.js";
import { store, views } from "./state.js";
import {
  renderBilling,
  renderControl,
  renderCustomers,
  renderDashboard,
  renderDeals,
  renderDrawer,
  renderStatusLabel,
  renderTasks
} from "./components/views.js";
import { escapeHtml, initials } from "./utils/format.js";

const root = document.getElementById("app");
const THEME_KEY = "pulse-crm-theme";
const LANG_KEY = "pulse-crm-language";
const emptyWorkspace = Object.freeze({
  customers: [],
  deals: [],
  tasks: [],
  invoices: [],
  activity: []
});

let toastTimer = null;

store.setState({
  theme: window.localStorage.getItem(THEME_KEY) || store.state.theme,
  language: window.localStorage.getItem(LANG_KEY) || store.state.language
});

const copy = {
  en: {
    appTagline: "Private SaaS workspace",
    browseLabel: "Workspace menu",
    editLabel: "Edit mode",
    dashboard: "Dashboard",
    customers: "Customers",
    deals: "Deals",
    tasks: "Tasks",
    billing: "Billing",
    control: "Control Center",
    guidedWorkspace: "Guided workspace",
    guidedWorkspaceBody: "Main navigation is now horizontal at the top. Use it to browse. Use the big Create data action to enter edit mode.",
    quickOrientation: "Quick orientation",
    quickOrientationBody: "Browse from the top menu, inspect records from the cards and tables, and only switch into Control Center when you want to create or change the workspace.",
    workspaceStatus: "Workspace status",
    totalRecords: "total records across customers, deals, tasks and invoices.",
    createData: "Create data",
    editingWorkspace: "Editing workspace",
    lightMode: "Light mode",
    darkMode: "Dark mode",
    searchPlaceholder: "Search customers, deals, tasks...",
    openDashboardHint: "Open Dashboard to overview or Control Center to edit records.",
    openControlCenter: "Open Control Center",
    refreshWorkspace: "Refresh workspace",
    signOut: "Sign out",
    language: "Language",
    signOutTitle: "Sign out from Pulse CRM?",
    signOutMessage: "You are about to leave the secure workspace. Your session will close and you will return to the login screen.",
    signOutConfirm: "Yes, sign out",
    stayHere: "Stay here",
    footer: "Every screen is private to the signed-in user. New data is created from Control Center, and logout always asks for confirmation first.",
    authTitleSignin: "Sign in to enter your workspace",
    authTitleSignup: "Create a secure Pulse CRM account",
    authSignin: "Sign in",
    authSignup: "Create account",
    authSwitchSignin: "Already have an account? Sign in",
    authSwitchSignup: "No account yet? Create one",
    authIntro: "This workspace does not expose shared demo data anymore. Every customer, deal, task and invoice belongs only to the signed-in account.",
    authAccess: "Private access only",
    authUnlock: "Login required before any tools unlock",
    menuMap: "Menu map",
    firstRun: "First-run suggestion",
    firstRunBody: "Create a customer first. After that, add a deal or task and the rest of the screens become much more intuitive immediately.",
    whatAfterLogin: "What happens after login",
    whatAfterLoginBody: "You land in a guided dashboard, then use the top menu and Control Center to create your first records.",
    sessionPersistence: "Session persistence",
    sessionPersistenceBody: "The session is cached by Supabase Auth, so refreshing or returning from background does not log you out unexpectedly.",
    safety: "Safety",
    safetyBody: "Passwords are handled by Supabase Auth. The app is using policy-protected API calls instead of raw SQL from the browser.",
    themeToast: "Theme switched to",
    signedOut: "Signed out successfully.",
    signInFirst: "Sign in first.",
    authConfigMissing: "Supabase is not configured yet."
  },
  ru: {
    appTagline: "Приватное SaaS-пространство",
    browseLabel: "Меню разделов",
    editLabel: "Режим редактирования",
    dashboard: "Дашборд",
    customers: "Клиенты",
    deals: "Сделки",
    tasks: "Задачи",
    billing: "Платежи",
    control: "Центр управления",
    guidedWorkspace: "Понятное пространство",
    guidedWorkspaceBody: "Основная навигация теперь горизонтальная сверху. Используй ее для просмотра. Большая кнопка создания переводит в режим редактирования.",
    quickOrientation: "Быстрая ориентация",
    quickOrientationBody: "Смотри разделы через верхнее меню, открывай записи из карточек и таблиц, а в Control Center заходи только когда хочешь что-то создать или изменить.",
    workspaceStatus: "Состояние пространства",
    totalRecords: "записей всего по клиентам, сделкам, задачам и счетам.",
    createData: "Создать данные",
    editingWorkspace: "Редактирование",
    lightMode: "Светлая тема",
    darkMode: "Темная тема",
    searchPlaceholder: "Поиск по клиентам, сделкам, задачам...",
    openDashboardHint: "Открой дашборд для обзора или Control Center для редактирования записей.",
    openControlCenter: "Открыть Control Center",
    refreshWorkspace: "Обновить данные",
    signOut: "Выйти",
    language: "Язык",
    signOutTitle: "Выйти из Pulse CRM?",
    signOutMessage: "Ты собираешься покинуть защищенное пространство. Сессия завершится, и ты вернешься на экран входа.",
    signOutConfirm: "Да, выйти",
    stayHere: "Остаться",
    footer: "Все экраны приватны для текущего пользователя. Новые данные создаются через Control Center, а выход всегда требует подтверждения.",
    authTitleSignin: "Войди, чтобы открыть рабочее пространство",
    authTitleSignup: "Создай защищенный аккаунт Pulse CRM",
    authSignin: "Войти",
    authSignup: "Создать аккаунт",
    authSwitchSignin: "Уже есть аккаунт? Войти",
    authSwitchSignup: "Еще нет аккаунта? Создать",
    authIntro: "Здесь больше нет общих демо-данных. Каждый клиент, сделка, задача и счет принадлежат только текущему аккаунту.",
    authAccess: "Только приватный доступ",
    authUnlock: "Вход обязателен перед доступом к инструментам",
    menuMap: "Карта меню",
    firstRun: "Совет для старта",
    firstRunBody: "Сначала создай клиента. Потом добавь сделку или задачу, и остальные экраны сразу станут намного понятнее.",
    whatAfterLogin: "Что будет после входа",
    whatAfterLoginBody: "Ты попадешь в понятный дашборд, а дальше через верхнее меню и Control Center сможешь создать первые записи.",
    sessionPersistence: "Сохранение сессии",
    sessionPersistenceBody: "Сессия хранится через Supabase Auth, поэтому обновление страницы или возврат из фона не выбрасывает тебя из аккаунта.",
    safety: "Безопасность",
    safetyBody: "Пароли обрабатывает Supabase Auth. Приложение использует API с политиками доступа, а не raw SQL из браузера.",
    themeToast: "Тема переключена на",
    signedOut: "Выход выполнен.",
    signInFirst: "Сначала войди в аккаунт.",
    authConfigMissing: "Supabase пока не настроен."
  }
};

function cloneEmptyWorkspace() {
  return {
    customers: [],
    deals: [],
    tasks: [],
    invoices: [],
    activity: []
  };
}

function flashToast(message) {
  clearTimeout(toastTimer);
  store.setState({ toast: message });
  toastTimer = window.setTimeout(() => {
    store.setState({ toast: null });
  }, 2600);
}

function escape(value) {
  return escapeHtml(value);
}

function t(state, key) {
  const language = state?.language === "ru" ? "ru" : "en";
  return copy[language][key] || copy.en[key] || key;
}

function normalizeSupabaseData(appData) {
  const safeData = appData || emptyWorkspace;

  return {
    customers: (safeData.customers || []).map((customer) => ({
      ...customer,
      lastActivity: customer.lastActivity || customer.last_activity
    })),
    deals: (safeData.deals || []).map((deal) => ({
      ...deal,
      dueDate: deal.dueDate || deal.due_date
    })),
    tasks: (safeData.tasks || []).map((task) => ({
      ...task,
      dueDate: task.dueDate || task.due_date
    })),
    invoices: (safeData.invoices || []).map((invoice) => ({
      ...invoice,
      dueDate: invoice.dueDate || invoice.due_date
    })),
    activity: safeData.activity || []
  };
}

function currentWorkspace() {
  return store.state.appData || cloneEmptyWorkspace();
}

function displayProfile(session) {
  const user = session?.user;
  const email = user?.email || "No email";
  const name =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.user_metadata?.user_name ||
    (email.includes("@") ? email.split("@")[0] : email);

  return {
    avatar: user?.user_metadata?.avatar_url || user?.user_metadata?.picture || "",
    email,
    initials: initials(name || email || "PC"),
    name
  };
}

function viewDescription(activeView) {
  switch (activeView) {
    case "customers":
      return {
        title: "Customer Orbit",
        subtitle: "Accounts, lifecycle and ownership for this private workspace."
      };
    case "deals":
      return {
        title: "Revenue Flow",
        subtitle: "Move opportunities visually and let the pipeline tell a story."
      };
    case "tasks":
      return {
        title: "Execution Matrix",
        subtitle: "Keep next actions obvious, prioritized and hard to miss."
      };
    case "billing":
      return {
        title: "Billing Signal",
        subtitle: "Track what is paid, pending or overdue without leaving the cockpit."
      };
    case "control":
      return {
        title: "Control Center",
        subtitle: "Create the first real records here and the rest of the product wakes up."
      };
    default:
      return {
        title: "Pulse Command",
        subtitle: "A private CRM workspace with guided onboarding and a more cinematic flow."
      };
  }
}

function filterOptions(activeView) {
  switch (activeView) {
    case "customers":
      return ["All", "Customer", "Qualified", "New", "Churned"];
    case "deals":
      return ["All", "Discovery", "Qualified", "Proposal", "Negotiation"];
    case "tasks":
      return ["All", "Open", "In Progress", "Blocked", "Done"];
    case "billing":
      return ["All", "Paid", "Pending", "Overdue"];
    default:
      return [];
  }
}

function renderWorkspaceNav(state) {
  const items = [
    { id: "dashboard", label: t(state, "dashboard") },
    { id: "customers", label: t(state, "customers") },
    { id: "deals", label: t(state, "deals") },
    { id: "tasks", label: t(state, "tasks") },
    { id: "billing", label: t(state, "billing") }
  ];

  return `
    <nav class="nav-strip" aria-label="Workspace sections">
      ${items
        .map(
          (item) => `
            <button class="nav-pill ${state.activeView === item.id ? "is-active" : ""}" data-nav="${item.id}" type="button">
              ${escape(item.label)}
            </button>
          `
        )
        .join("")}
    </nav>
  `;
}

function renderSidebar(state) {
  const data = currentWorkspace();
  const totalRecords = data.customers.length + data.deals.length + data.tasks.length + data.invoices.length;

  return `
    <aside class="sidebar">
      <div class="brand">
        <img class="brand__mark" src="./assets/pulse-logo.svg" alt="Pulse CRM logo" />
        <div>
          <h1>Pulse CRM</h1>
          <p>${escape(t(state, "appTagline"))}</p>
        </div>
      </div>
      <div class="workspace-switcher">
        <strong>${escape(t(state, "guidedWorkspace"))}</strong>
        <div class="sidebar-copy">${escape(t(state, "guidedWorkspaceBody"))}</div>
      </div>
      <div class="sidebar-footer">
        <div class="sidebar-card">
          <strong>${escape(t(state, "quickOrientation"))}</strong>
          <div class="sidebar-copy">${escape(t(state, "quickOrientationBody"))}</div>
        </div>
        <div class="sidebar-card">
          <strong>${escape(t(state, "workspaceStatus"))}</strong>
          <div class="sidebar-copy">${renderStatusLabel(state)}</div>
          <div class="sidebar-copy sidebar-copy--strong">${totalRecords} ${escape(t(state, "totalRecords"))}</div>
        </div>
      </div>
    </aside>
  `;
}

function renderProfileMenu(state) {
  const profile = displayProfile(state.session);

  return `
    <div class="profile-area" data-profile-area="true">
      <button class="profile-trigger ${state.profileMenuOpen ? "is-open" : ""}" data-profile-toggle="true" type="button" aria-expanded="${state.profileMenuOpen ? "true" : "false"}">
        ${
          profile.avatar
            ? `<img class="profile-avatar profile-avatar--image" src="${escape(profile.avatar)}" alt="${escape(profile.name)} avatar" />`
            : `<span class="profile-avatar">${escape(profile.initials)}</span>`
        }
        <span class="profile-copy">
          <strong>${escape(profile.name)}</strong>
          <span>${escape(profile.email)}</span>
        </span>
        <span class="profile-caret">${state.profileMenuOpen ? "Hide" : "Menu"}</span>
      </button>
      ${
        state.profileMenuOpen
          ? `
            <div class="profile-dropdown">
              <div class="profile-dropdown__header">
                <strong>${escape(profile.name)}</strong>
                <span class="muted">${escape(profile.email)}</span>
              </div>
              <div class="language-switcher">
                <span class="language-switcher__label">${escape(t(state, "language"))}</span>
                <div class="language-switcher__actions">
                  <button class="language-pill ${state.language === "en" ? "is-active" : ""}" data-language-switch="en" type="button">EN</button>
                  <button class="language-pill ${state.language === "ru" ? "is-active" : ""}" data-language-switch="ru" type="button">RU</button>
                </div>
              </div>
              <button class="profile-dropdown__action" data-open-control="true" type="button">${escape(t(state, "openControlCenter"))}</button>
              <button class="profile-dropdown__action" data-sync-data="true" type="button">${escape(t(state, "refreshWorkspace"))}</button>
              <button class="profile-dropdown__action is-danger" data-request-signout="true" type="button">${escape(t(state, "signOut"))}</button>
            </div>
          `
          : ""
      }
    </div>
  `;
}

function renderTopbar(state) {
  const copy = viewDescription(state.activeView);
  const options = filterOptions(state.activeView);
  const activeFilter = state.filters[state.activeView];
  const isControlView = state.activeView === "control";

  return `
    <header class="topbar topbar--stacked">
      <div class="topbar-row">
      <div class="topbar-copy">
        <span class="label">${escape(isControlView ? t(state, "editLabel") : t(state, "browseLabel"))}</span>
        <h2 class="page-title">${escape(copy.title)}</h2>
        <p class="page-subtitle">${escape(copy.subtitle)}</p>
      </div>
      <div class="topbar-actions">
        <div class="status-chip"><span class="status-dot ${state.backend === "live" ? "is-live" : "is-demo"}"></span>${renderStatusLabel(state)}</div>
        <button class="icon-button" data-theme-toggle="true" type="button">${escape(state.theme === "dark" ? t(state, "lightMode") : t(state, "darkMode"))}</button>
        <button class="primary-button ${isControlView ? "is-active" : ""}" data-open-control="true" type="button">${escape(isControlView ? t(state, "editingWorkspace") : t(state, "createData"))}</button>
        ${renderProfileMenu(state)}
      </div>
      </div>
      <div class="toolbar-surface">
        <div class="toolbar-surface__main">
          ${renderWorkspaceNav(state)}
        </div>
        <div class="toolbar-surface__actions">
          <label class="search" aria-label="Search">
            <input type="search" value="${escape(state.globalSearch)}" placeholder="${escape(t(state, "searchPlaceholder"))}" data-search-input="true" />
          </label>
          ${
            options.length
              ? `
                <select class="filter-select" data-filter-view="${state.activeView}">
                  ${options
                    .map((option) => `<option value="${escape(option)}" ${option === activeFilter ? "selected" : ""}>${escape(option)}</option>`)
                    .join("")}
                </select>
              `
              : `<div class="filter-placeholder">${escape(t(state, "openDashboardHint"))}</div>`
          }
        </div>
      </div>
    </header>
  `;
}

function renderLoadingOverlay(state) {
  if (!state.loading) {
    return "";
  }

  return `
    <div class="loading-overlay" aria-live="polite" aria-busy="true">
      <div class="loading-card">
        <img class="loading-logo" src="./assets/pulse-logo.svg" alt="Pulse CRM logo" />
        <h3>${state.booting ? "Preparing secure workspace" : "Syncing your records"}</h3>
        <p class="muted">${state.booting ? "Checking your session and opening the correct screen." : "Applying live changes from your private Supabase workspace."}</p>
        <div class="loading-bar" aria-hidden="true"><div class="loading-bar__fill"></div></div>
      </div>
    </div>
  `;
}

function renderToast(state) {
  return state.toast ? `<div class="toast" role="status" aria-live="polite">${escape(state.toast)}</div>` : "";
}

function renderConfirmDialog(state) {
  if (!state.confirmDialog) {
    return "";
  }

  return `
    <div class="confirm-overlay" data-confirm-dismiss="true">
      <div class="confirm-card" role="dialog" aria-modal="true" aria-label="${escape(state.confirmDialog.title)}" onclick="event.stopPropagation()">
        <span class="label">Confirm action</span>
        <h3>${escape(state.confirmDialog.title)}</h3>
        <p class="muted">${escape(state.confirmDialog.message)}</p>
        <div class="confirm-actions">
          <button class="ghost-button" data-confirm-dismiss="true" type="button">${escape(t(state, "stayHere"))}</button>
          <button class="primary-button danger-button" data-confirm-action="${escape(state.confirmDialog.action)}" type="button">${escape(state.confirmDialog.confirmLabel)}</button>
        </div>
      </div>
    </div>
  `;
}

function renderAuthScreen(state) {
  const authHeadline = state.authMode === "signup" ? t(state, "authTitleSignup") : t(state, "authTitleSignin");
  const authButton = state.authMode === "signup" ? t(state, "authSignup") : t(state, "authSignin");
  const switchText = state.authMode === "signup" ? t(state, "authSwitchSignin") : t(state, "authSwitchSignup");
  const googleEnabled = isOAuthEnabled("google");
  const githubEnabled = isOAuthEnabled("github");
  const disabledMessage = !supabaseEnabled ? "Supabase is not configured yet, so registration is temporarily unavailable." : "";

  return `
    <main class="auth-layout">
      <section class="auth-panel">
        <div class="auth-brand">
          <img class="auth-brand__mark" src="./assets/pulse-logo.svg" alt="Pulse CRM logo" />
          <div>
            <h1>Pulse CRM</h1>
            <p class="muted">${escape(t(state, "authUnlock"))}</p>
          </div>
        </div>
        <span class="label">${escape(t(state, "authAccess"))}</span>
        <h2 class="auth-title">${escape(authHeadline)}</h2>
        <p class="auth-copy">${escape(t(state, "authIntro"))}</p>
        <form class="auth-form auth-form--page" data-auth-form="true">
          <input type="email" name="email" placeholder="Work email" autocomplete="email" required ${supabaseEnabled ? "" : "disabled"} />
          <input type="password" name="password" placeholder="Password" autocomplete="${state.authMode === "signup" ? "new-password" : "current-password"}" required minlength="8" ${supabaseEnabled ? "" : "disabled"} />
          ${
            state.authMode === "signup"
              ? `<input type="password" name="confirmPassword" placeholder="Repeat password" autocomplete="new-password" required minlength="8" ${supabaseEnabled ? "" : "disabled"} />`
              : ""
          }
          <button class="primary-button" type="submit" ${supabaseEnabled ? "" : "disabled"}>${escape(authButton)}</button>
          <button class="ghost-button" type="button" data-toggle-auth="true">${escape(switchText)}</button>
        </form>
        <div class="oauth-grid">
          <button class="oauth-button" type="button" data-oauth-provider="google" ${googleEnabled && supabaseEnabled ? "" : "disabled"}><span class="oauth-mark">G</span>Continue with Google</button>
          <button class="oauth-button" type="button" data-oauth-provider="github" ${githubEnabled && supabaseEnabled ? "" : "disabled"}><span class="oauth-mark">GH</span>Continue with GitHub</button>
        </div>
        ${
          disabledMessage
            ? `<div class="helper-note helper-note--warning"><strong>Configuration notice</strong><div class="muted">${escape(disabledMessage)}</div></div>`
            : ""
        }
        <div class="helper-list">
          <div class="helper-note">
            <strong>${escape(t(state, "whatAfterLogin"))}</strong>
            <div class="muted">${escape(t(state, "whatAfterLoginBody"))}</div>
          </div>
          <div class="helper-note">
            <strong>${escape(t(state, "sessionPersistence"))}</strong>
            <div class="muted">${escape(t(state, "sessionPersistenceBody"))}</div>
          </div>
          <div class="helper-note">
            <strong>${escape(t(state, "safety"))}</strong>
            <div class="muted">${escape(t(state, "safetyBody"))}</div>
          </div>
        </div>
      </section>
      <aside class="auth-side">
        <div class="sidebar-card feature-card">
          <strong>${escape(t(state, "menuMap"))}</strong>
          <div class="sidebar-copy">Dashboard = overview, Customers = accounts, Deals = pipeline, Tasks = execution, Billing = invoices, Control Center = create data.</div>
        </div>
        <div class="sidebar-card feature-card">
          <strong>${escape(t(state, "firstRun"))}</strong>
          <div class="sidebar-copy">${escape(t(state, "firstRunBody"))}</div>
        </div>
      </aside>
      ${renderLoadingOverlay(state)}
      ${renderToast(state)}
    </main>
  `;
}

function renderView(state) {
  const data = currentWorkspace();

  switch (state.activeView) {
    case "customers":
      return renderCustomers(data, state);
    case "deals":
      return renderDeals(data, state);
    case "tasks":
      return renderTasks(data, state);
    case "billing":
      return renderBilling(data, state);
    case "control":
      return renderControl(data, state);
    default:
      return renderDashboard(data, state);
  }
}

function renderApp(state) {
  const data = currentWorkspace();

  root.innerHTML = `
    <div class="app-shell">
      ${renderSidebar(state)}
      <main class="main">
        ${renderTopbar(state)}
        <div class="view-stack">
          ${renderView(state)}
        </div>
        <div class="footer-note">${escape(t(state, "footer"))}</div>
      </main>
    </div>
    ${renderDrawer(data, state.drawer)}
    ${renderConfirmDialog(state)}
    ${renderLoadingOverlay(state)}
    ${renderToast(state)}
  `;
}

function renderRoot(state) {
  document.body.dataset.theme = state.theme;

  if (!state.session) {
    root.innerHTML = renderAuthScreen(state);
    return;
  }

  renderApp(state);
}

async function hydrateWorkspace(options = {}) {
  const { booting = false } = options;
  store.setState({ loading: true, booting });

  try {
    if (!supabaseEnabled) {
      store.setState({
        appData: cloneEmptyWorkspace(),
        backend: "demo",
        configured: false,
        loading: false,
        booting: false,
        session: null
      });
      return;
    }

    const session = await getSession();

    if (!session) {
      store.setState({
        appData: cloneEmptyWorkspace(),
        backend: "live",
        configured: true,
        loading: false,
        booting: false,
        session: null,
        drawer: null,
        profileMenuOpen: false,
        confirmDialog: null
      });
      return;
    }

    const liveData = await fetchWorkspaceData();
    store.setState({
      appData: normalizeSupabaseData(liveData),
      backend: "live",
      configured: true,
      loading: false,
      booting: false,
      session
    });
  } catch (error) {
    store.setState({
      appData: cloneEmptyWorkspace(),
      backend: supabaseEnabled ? "live" : "demo",
      configured: supabaseEnabled,
      loading: false,
      booting: false
    });
    flashToast(`Workspace sync failed: ${error.message}`);
  }
}

async function logActivity(text) {
  if (!store.state.session) {
    return;
  }

  const profile = displayProfile(store.state.session);
  const payload = {
    id: `a-${crypto.randomUUID().slice(0, 8)}`,
    actor: profile.name,
    text,
    time: "Just now",
    user_id: store.state.session.user.id
  };

  try {
    await insertRecord("activity", payload);
  } catch (_error) {
    // Activity is nice-to-have. The primary action should still succeed.
  }
}

function viewForCreateType(type) {
  switch (type) {
    case "deal":
      return "deals";
    case "task":
      return "tasks";
    case "invoice":
      return "billing";
    default:
      return "customers";
  }
}

function buildPayload(type, form, session) {
  const userId = session.user.id;
  const today = new Date().toISOString().slice(0, 10);

  if (type === "deal") {
    return {
      id: `d-${crypto.randomUUID().slice(0, 8)}`,
      company: form.elements.company.value.trim(),
      title: form.elements.title.value.trim(),
      owner: form.elements.owner.value.trim(),
      value: Number(form.elements.value.value),
      stage: form.elements.stage.value,
      due_date: form.elements.dueDate.value,
      probability: Number(form.elements.probability.value),
      type: form.elements.type.value,
      user_id: userId
    };
  }

  if (type === "task") {
    return {
      id: `t-${crypto.randomUUID().slice(0, 8)}`,
      title: form.elements.title.value.trim(),
      customer: form.elements.customer.value.trim(),
      assignee: form.elements.assignee.value.trim(),
      priority: form.elements.priority.value,
      status: form.elements.status.value,
      due_date: form.elements.dueDate.value,
      lane: form.elements.lane.value,
      user_id: userId
    };
  }

  if (type === "invoice") {
    return {
      id: `inv-${crypto.randomUUID().slice(0, 8)}`,
      company: form.elements.company.value.trim(),
      amount: Number(form.elements.amount.value),
      due_date: form.elements.dueDate.value,
      status: form.elements.status.value,
      user_id: userId
    };
  }

  return {
    id: `c-${crypto.randomUUID().slice(0, 8)}`,
    name: form.elements.name.value.trim(),
    company: form.elements.company.value.trim(),
    owner: form.elements.owner.value.trim(),
    plan: form.elements.plan.value,
    status: form.elements.status.value,
    arr: Number(form.elements.arr.value),
    health: form.elements.health.value,
    last_activity: today,
    contacts: Number(form.elements.contacts.value),
    region: form.elements.region.value.trim(),
    notes: form.elements.notes.value.trim(),
    user_id: userId
  };
}

async function handleCreate(type, form) {
  const session = store.state.session;

  if (!session) {
    flashToast(t(store.state, "signInFirst"));
    return;
  }

  const workspaceBefore = currentWorkspace();
  const wasEmpty =
    !workspaceBefore.customers.length &&
    !workspaceBefore.deals.length &&
    !workspaceBefore.tasks.length &&
    !workspaceBefore.invoices.length;

  try {
    store.setState({ loading: true, drawer: null, profileMenuOpen: false });
    const payload = buildPayload(type, form, session);
    await insertRecord(type === "invoice" ? "invoices" : `${type}s`, payload);
    await logActivity(`Created a new ${type} record in Control Center.`);
    await hydrateWorkspace();
    store.setState({
      activeView: viewForCreateType(type)
    });
    flashToast(
      wasEmpty
        ? `First ${type} created. The guided empty state has now been replaced by your real workspace.`
        : `${type[0].toUpperCase()}${type.slice(1)} created successfully.`
    );
  } catch (error) {
    store.setState({ loading: false, booting: false });
    flashToast(error.message);
  }
}

async function confirmSignOut() {
  try {
    store.setState({ loading: true, confirmDialog: null, profileMenuOpen: false });
    await signOut();
    store.setState({
      appData: cloneEmptyWorkspace(),
      session: null,
      drawer: null,
      loading: false,
      booting: false
    });
    window.location.replace(window.location.pathname);
  } catch (error) {
    store.setState({ loading: false, booting: false });
    flashToast(error.message);
  }
}

store.subscribe(renderRoot);
renderRoot(store.state);

document.addEventListener("click", (event) => {
  if (store.state.profileMenuOpen && !event.target.closest("[data-profile-area='true']")) {
    store.setState({ profileMenuOpen: false });
  }

  const target = event.target.closest(
    "[data-nav], [data-open-drawer], [data-close-drawer], [data-theme-toggle], [data-open-control], [data-profile-toggle], [data-request-signout], [data-toggle-auth], [data-sync-data], [data-oauth-provider], [data-create-type], [data-confirm-action], [data-confirm-dismiss], [data-language-switch]"
  );

  if (!target) {
    return;
  }

  if (target.dataset.nav) {
    store.setState({
      activeView: target.dataset.nav,
      globalSearch: "",
      drawer: null,
      profileMenuOpen: false
    });
    return;
  }

  if (target.dataset.openDrawer) {
    store.setState({
      drawer: {
        type: target.dataset.openDrawer,
        id: target.dataset.id
      },
      profileMenuOpen: false
    });
    return;
  }

  if (target.dataset.closeDrawer) {
    store.setState({ drawer: null });
    return;
  }

  if (target.dataset.themeToggle) {
    const nextTheme = store.state.theme === "dark" ? "light" : "dark";
    window.localStorage.setItem(THEME_KEY, nextTheme);
    store.setState({ theme: nextTheme });
    flashToast(`${t(store.state, "themeToast")} ${nextTheme}.`);
    return;
  }

  if (target.dataset.openControl) {
    store.setState({
      activeView: "control",
      drawer: null,
      profileMenuOpen: false
    });
    return;
  }

  if (target.dataset.profileToggle) {
    store.setState((state) => ({
      profileMenuOpen: !state.profileMenuOpen
    }));
    return;
  }

  if (target.dataset.languageSwitch) {
    const nextLanguage = target.dataset.languageSwitch === "ru" ? "ru" : "en";
    window.localStorage.setItem(LANG_KEY, nextLanguage);
    store.setState({ language: nextLanguage, profileMenuOpen: true });
    return;
  }

  if (target.dataset.requestSignout) {
    store.setState({
      confirmDialog: {
        action: "signout",
        confirmLabel: t(store.state, "signOutConfirm"),
        message: t(store.state, "signOutMessage"),
        title: t(store.state, "signOutTitle")
      },
      profileMenuOpen: false
    });
    return;
  }

  if (target.dataset.confirmDismiss) {
    store.setState({ confirmDialog: null });
    return;
  }

  if (target.dataset.confirmAction === "signout") {
    confirmSignOut();
    return;
  }

  if (target.dataset.toggleAuth) {
    store.setState((state) => ({
      authMode: state.authMode === "signin" ? "signup" : "signin"
    }));
    return;
  }

  if (target.dataset.syncData) {
    hydrateWorkspace();
    return;
  }

  if (target.dataset.oauthProvider) {
    if (!isOAuthEnabled(target.dataset.oauthProvider)) {
      flashToast(`${target.dataset.oauthProvider} login is not enabled yet.`);
      return;
    }

    signInWithOAuth(target.dataset.oauthProvider).catch((error) => {
      flashToast(error.message);
    });
    return;
  }

  if (target.dataset.createType) {
    store.setState({ createType: target.dataset.createType });
  }
});

document.addEventListener("input", (event) => {
  const target = event.target;

  if (target.matches("[data-search-input='true']")) {
    store.setState({ globalSearch: target.value });
  }
});

document.addEventListener("change", (event) => {
  const target = event.target;

  if (target.matches("[data-filter-view]")) {
    const view = target.dataset.filterView;
    store.setState((state) => ({
      filters: {
        ...state.filters,
        [view]: target.value
      }
    }));
  }
});

document.addEventListener("submit", async (event) => {
  const form = event.target;

  if (form.matches("[data-auth-form='true']")) {
    event.preventDefault();

    if (!supabaseEnabled) {
      flashToast(t(store.state, "authConfigMissing"));
      return;
    }

    const email = form.elements.email.value.trim();
    const password = form.elements.password.value;
    const confirmPassword = form.elements.confirmPassword?.value || "";

    if (store.state.authMode === "signup") {
      if (password.length < 8) {
        flashToast("Use at least 8 characters for the password.");
        return;
      }

      if (password !== confirmPassword) {
        flashToast("Passwords do not match.");
        return;
      }
    }

    try {
      store.setState({ loading: true, booting: true });

      if (store.state.authMode === "signup") {
        await signUpWithPassword(email, password);
        await hydrateWorkspace();

        if (!store.state.session) {
          store.setState({ authMode: "signin" });
          flashToast("Account created. If email confirmation is enabled, verify your inbox and then sign in.");
        } else {
          flashToast("Account created. Welcome to your private workspace.");
        }
        return;
      }

      await signInWithPassword(email, password);
      await hydrateWorkspace();
      flashToast("Signed in successfully.");
    } catch (error) {
      store.setState({ loading: false, booting: false });
      flashToast(error.message);
    }

    return;
  }

  if (form.matches("[data-create-form]")) {
    event.preventDefault();
    const type = form.dataset.createForm;
    await handleCreate(type, form);
  }
});

document.addEventListener("dragstart", (event) => {
  const card = event.target.closest("[data-deal-id]");

  if (!card) {
    return;
  }

  event.dataTransfer.setData("text/plain", card.dataset.dealId);
});

document.addEventListener("dragover", (event) => {
  if (event.target.closest("[data-drop-zone]")) {
    event.preventDefault();
  }
});

document.addEventListener("drop", async (event) => {
  const dropZone = event.target.closest("[data-drop-zone]");

  if (!dropZone || !store.state.session) {
    return;
  }

  event.preventDefault();

  const dealId = event.dataTransfer.getData("text/plain");
  const targetStage = dropZone.dataset.dropZone;
  const workspace = currentWorkspace();
  const deal = workspace.deals.find((item) => item.id === dealId);

  if (!deal || deal.stage === targetStage) {
    return;
  }

  const optimisticDeals = workspace.deals.map((item) => (item.id === dealId ? { ...item, stage: targetStage } : item));
  store.setState({
    appData: {
      ...workspace,
      deals: optimisticDeals
    }
  });

  try {
    await updateDealStage(dealId, targetStage);
    await logActivity(`Moved deal "${deal.title}" to ${targetStage}.`);
    await hydrateWorkspace();
    flashToast(`Deal moved to ${targetStage}.`);
  } catch (error) {
    await hydrateWorkspace();
    flashToast(error.message);
  }
});

onAuthStateChange(async (session) => {
  if (!supabaseEnabled) {
    return;
  }

  if (!session) {
    store.setState({
      appData: cloneEmptyWorkspace(),
      backend: "live",
      configured: true,
      loading: false,
      booting: false,
      session: null,
      drawer: null,
      profileMenuOpen: false,
      confirmDialog: null
    });
    return;
  }

  try {
    const liveData = await fetchWorkspaceData();
    store.setState({
      appData: normalizeSupabaseData(liveData),
      backend: "live",
      configured: true,
      loading: false,
      booting: false,
      session
    });
  } catch (error) {
    flashToast(`Supabase sync failed: ${error.message}`);
  }
});

hydrateWorkspace({ booting: true });
