import { data as mockData } from "./data/mockData.js";
import { fetchWorkspaceData, getSession, isOAuthEnabled, onAuthStateChange, signInWithOAuth, signInWithPassword, signOut, signUpWithPassword, supabaseEnabled } from "./lib/supabase.js";
import { store, views } from "./state.js";
import { renderBilling, renderCustomers, renderDashboard, renderDeals, renderDrawer, renderStatusLabel, renderTasks } from "./components/views.js";

const root = document.getElementById("app");
let toastTimer = null;

function flashToast(message) {
  clearTimeout(toastTimer);
  store.setState({ toast: message });
  toastTimer = setTimeout(() => {
    store.setState({ toast: null });
  }, 2600);
}

function normalizeSupabaseData(appData) {
  return {
    ...appData,
    customers: appData.customers.map((customer) => ({
      ...customer,
      lastActivity: customer.lastActivity || customer.last_activity
    })),
    deals: appData.deals.map((deal) => ({
      ...deal,
      dueDate: deal.dueDate || deal.due_date
    })),
    tasks: appData.tasks.map((task) => ({
      ...task,
      dueDate: task.dueDate || task.due_date
    })),
    invoices: appData.invoices.map((invoice) => ({
      ...invoice,
      dueDate: invoice.dueDate || invoice.due_date
    }))
  };
}

async function hydrateWorkspace() {
  store.setState({ loading: true });

  try {
    if (!supabaseEnabled) {
      store.setState({
        appData: null,
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
        appData: null,
        backend: "live",
        configured: true,
        loading: false,
        booting: false,
        session: null
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
      appData: null,
      backend: supabaseEnabled ? "live" : "demo",
      configured: supabaseEnabled,
      loading: false,
      booting: false,
      session: null
    });
    flashToast(`Auth or data sync failed: ${error.message}`);
  }
}

function filterOptions(state) {
  switch (state.activeView) {
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

function renderView(state) {
  const data = state.appData || mockData;

  switch (state.activeView) {
    case "customers":
      return renderCustomers(data, state);
    case "deals":
      return renderDeals(data, state);
    case "tasks":
      return renderTasks(data, state);
    case "billing":
      return renderBilling(data, state);
    default:
      return renderDashboard(data, state);
  }
}

function pageCopy(state) {
  switch (state.activeView) {
    case "customers":
      return {
        title: "Customer 360",
        subtitle: "Account health, ownership, ARR and lifecycle status in one place."
      };
    case "deals":
      return {
        title: "Revenue Pipeline",
        subtitle: "Kanban motion for discovery, proposals, negotiations and expansion revenue."
      };
    case "tasks":
      return {
        title: "Execution Queue",
        subtitle: "Operational follow-through for sales, onboarding, support and billing."
      };
    case "billing":
      return {
        title: "Billing & Plans",
        subtitle: "Invoice visibility, collections focus and subscription mix across the base."
      };
    default:
      return {
        title: "Pulse Command",
        subtitle: "A product-style CRM/Admin Dashboard MVP designed to feel like real SaaS work."
      };
  }
}

function renderSidebar(state) {
  const data = state.appData || mockData;
  const navItems = [
    { id: "dashboard", label: views.dashboard, meta: "Overview" },
    { id: "customers", label: views.customers, meta: `${data.customers.length} accounts` },
    { id: "deals", label: views.deals, meta: `${data.deals.length} open deals` },
    { id: "tasks", label: views.tasks, meta: `${data.tasks.length} tasks` },
    { id: "billing", label: views.billing, meta: `${data.invoices.length} invoices` }
  ];

  return `
    <aside class="sidebar">
      <div class="brand">
        <img class="brand__mark" src="./assets/pulse-logo.svg" alt="Pulse CRM logo" />
        <div>
          <h1>Pulse CRM</h1>
          <p>Secure SaaS workspace</p>
        </div>
      </div>
      <div class="workspace-switcher">
        <strong>Protected workspace</strong>
        <div class="sidebar-copy">Signed in as ${state.session?.user?.email || "authenticated user"}.</div>
      </div>
      <nav class="nav-list" aria-label="Primary">
        ${navItems
          .map(
            (item) => `
            <button class="nav-button ${state.activeView === item.id ? "is-active" : ""}" data-nav="${item.id}">
              <span>${item.label}</span>
              <span class="nav-button__meta">${item.meta}</span>
            </button>
          `
          )
          .join("")}
      </nav>
      <div class="sidebar-footer">
        <div class="sidebar-card">
          <strong>Session & Security</strong>
          <div class="sidebar-copy">${renderStatusLabel(state)}</div>
          <div class="auth-actions" style="margin-top:12px;">
            <button class="secondary-button" data-sync-data="true">Refresh data</button>
            <button class="ghost-button" data-signout="true">Sign out</button>
          </div>
        </div>
        <div class="sidebar-card">
          <strong>How to use</strong>
          <div class="sidebar-copy">Open customers, move deals across the pipeline, then review tasks and billing. Access is protected behind Supabase Auth and RLS.</div>
        </div>
      </div>
    </aside>
  `;
}

function renderTopbar(state) {
  const copy = pageCopy(state);
  const options = filterOptions(state);
  const activeFilter = state.filters[state.activeView];

  return `
    <header class="topbar">
      <div>
        <h2 class="page-title">${copy.title}</h2>
        <p class="page-subtitle">${copy.subtitle}</p>
      </div>
      <div class="topbar-actions">
        <div class="status-chip"><span class="status-dot ${state.backend === "live" ? "is-live" : "is-demo"}"></span>${renderStatusLabel(state)}</div>
        <label class="search" aria-label="Search">
          <input type="search" value="${state.globalSearch}" placeholder="Search accounts, deals, tasks, owners..." data-search-input="true" />
        </label>
        ${
          options.length
            ? `
            <select class="filter-select" data-filter-view="${state.activeView}">
              ${options
                .map((option) => `<option value="${option}" ${option === activeFilter ? "selected" : ""}>${option}</option>`)
                .join("")}
            </select>
          `
            : ""
        }
        <button class="icon-button" data-theme-toggle="true">${state.theme === "dark" ? "Light mode" : "Dark mode"}</button>
        <button class="primary-button" data-create-record="true">Create record</button>
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
        <h3 style="margin:0 0 8px; font-family:'Space Grotesk', sans-serif;">${state.booting ? "Preparing secure access" : "Refreshing workspace"}</h3>
        <p class="muted" style="margin:0;">Passwords are handled by Supabase Auth, and CRM data is requested only after a valid session is present.</p>
        <div class="loading-bar" aria-hidden="true"><div class="loading-bar__fill"></div></div>
      </div>
    </div>
  `;
}

function renderAuthScreen(state) {
  const authHeadline = state.authMode === "signup" ? "Create your account first" : "Sign in to unlock the CRM";
  const authButton = state.authMode === "signup" ? "Create secure account" : "Sign in";
  const switchText = state.authMode === "signup" ? "Already registered? Sign in" : "New here? Create an account";
  const googleEnabled = isOAuthEnabled("google");
  const githubEnabled = isOAuthEnabled("github");

  return `
    <main class="auth-layout">
      <section class="auth-panel">
        <div class="auth-brand">
          <img class="auth-brand__mark" src="./assets/pulse-logo.svg" alt="Pulse CRM logo" />
          <div>
            <h1>Pulse CRM</h1>
            <p class="muted">Protected SaaS workspace</p>
          </div>
        </div>
        <span class="label">Registration required</span>
        <h2 class="auth-title">${authHeadline}</h2>
        <p class="auth-copy">
          You cannot enter the dashboard without an account. Email/password authentication is already wired through Supabase Auth,
          sessions stay active across refresh/background state, and access to data is protected by Row Level Security.
        </p>
        <form class="auth-form auth-form--page" data-auth-form="true">
          <input type="email" name="email" placeholder="Work email" autocomplete="email" required />
          <input type="password" name="password" placeholder="Password (minimum 8 characters recommended)" autocomplete="${state.authMode === "signup" ? "new-password" : "current-password"}" required minlength="6" />
          ${
            state.authMode === "signup"
              ? `<input type="password" name="confirmPassword" placeholder="Repeat password" autocomplete="new-password" required minlength="6" />`
              : ""
          }
          <button class="primary-button" type="submit">${authButton}</button>
          <button class="ghost-button" type="button" data-toggle-auth="true">${switchText}</button>
        </form>
        <div class="oauth-grid">
          <button class="oauth-button" type="button" data-oauth-provider="google" ${googleEnabled ? "" : "disabled"}><span class="oauth-mark">G</span>Continue with Google</button>
          <button class="oauth-button" type="button" data-oauth-provider="github" ${githubEnabled ? "" : "disabled"}><span class="oauth-mark">GH</span>Continue with GitHub</button>
        </div>
        <div class="helper-list">
          <div class="helper-note">
            <strong>Security model</strong>
            <div class="muted">The frontend does not run SQL queries directly. Auth is delegated to Supabase, and table access is gated by database policies.</div>
          </div>
          <div class="helper-note">
            <strong>Session persistence</strong>
            <div class="muted">Your account stays signed in when the tab refreshes or the page comes back from the background, which is the standard SaaS behavior.</div>
          </div>
          <div class="helper-note">
            <strong>Social login note</strong>
            <div class="muted">Google and GitHub start working only after those providers are enabled in Supabase Auth. Right now: Google ${googleEnabled ? "enabled" : "disabled"}, GitHub ${githubEnabled ? "enabled" : "disabled"}.</div>
          </div>
        </div>
      </section>
      <aside class="auth-side">
        <div class="sidebar-card">
          <strong>What you get after sign in</strong>
          <div class="sidebar-copy">Customer records, sales pipeline, task management and billing views with one protected session.</div>
        </div>
        <div class="sidebar-card">
          <strong>Before you invite real users</strong>
          <div class="sidebar-copy">Enable email confirmation, add Google/GitHub provider credentials in Supabase, and keep role policies strict as the project grows.</div>
        </div>
      </aside>
      ${renderLoadingOverlay(state)}
      ${state.toast ? `<div class="toast" role="status" aria-live="polite">${state.toast}</div>` : ""}
    </main>
  `;
}

function renderApp(state) {
  document.body.dataset.theme = state.theme;
  const data = state.appData || mockData;

  root.innerHTML = `
    <div class="app-shell">
      ${renderSidebar(state)}
      <main class="main">
        ${renderTopbar(state)}
        ${renderView(state)}
        <div class="footer-note">Protected by Supabase Auth and database policies. Sign-out returns the user to the registration gate.</div>
      </main>
    </div>
    ${renderDrawer(data, state.drawer)}
    ${renderLoadingOverlay(state)}
    ${state.toast ? `<div class="toast" role="status" aria-live="polite">${state.toast}</div>` : ""}
  `;
}

function renderRoot(state) {
  if (!state.session) {
    root.innerHTML = renderAuthScreen(state);
    return;
  }

  renderApp(state);
}

store.subscribe(renderRoot);
renderRoot(store.state);

document.addEventListener("click", (event) => {
  const target = event.target.closest("[data-nav], [data-open-drawer], [data-close-drawer], [data-theme-toggle], [data-create-record], [data-signout], [data-toggle-auth], [data-sync-data], [data-oauth-provider]");
  if (!target) {
    return;
  }

  if (target.dataset.nav) {
    store.setState({
      activeView: target.dataset.nav,
      globalSearch: "",
      drawer: null
    });
    return;
  }

  if (target.dataset.openDrawer) {
    store.setState({
      drawer: {
        type: target.dataset.openDrawer,
        id: target.dataset.id
      }
    });
    return;
  }

  if (target.dataset.closeDrawer) {
    store.setState({ drawer: null });
    return;
  }

  if (target.dataset.themeToggle) {
    store.setState((state) => ({
      theme: state.theme === "dark" ? "light" : "dark"
    }));
    flashToast("Theme switched. In a production version this preference would be persisted.");
    return;
  }

  if (target.dataset.createRecord) {
    flashToast("Create flow placeholder: next step would be a validated modal and role-aware write permissions.");
    return;
  }

  if (target.dataset.signout) {
    signOut()
      .then(() => {
        store.setState({
          appData: null,
          session: null,
          drawer: null,
          loading: false,
          booting: false
        });
        flashToast("Signed out successfully.");
      })
      .catch((error) => {
        flashToast(error.message);
      });
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
      flashToast(`${target.dataset.oauthProvider} login is not enabled in Supabase yet.`);
      return;
    }

    signInWithOAuth(target.dataset.oauthProvider).catch((error) => {
      flashToast(error.message);
    });
  }
});

document.addEventListener("input", (event) => {
  const target = event.target;
  if (target.matches("[data-search-input='true']")) {
    store.setState({
      globalSearch: target.value
    });
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
  if (!form.matches("[data-auth-form='true']")) {
    return;
  }

  event.preventDefault();
  const email = form.elements.email.value.trim();
  const password = form.elements.password.value;
  const confirmPassword = form.elements.confirmPassword?.value || "";

  if (store.state.authMode === "signup" && password !== confirmPassword) {
    flashToast("Passwords do not match.");
    return;
  }

  try {
    store.setState({ loading: true });
    if (store.state.authMode === "signup") {
      await signUpWithPassword(email, password);
      flashToast("Account created. If email confirmation is enabled in Supabase, verify your inbox and then sign in.");
    } else {
      await signInWithPassword(email, password);
      flashToast("Signed in. Loading your protected workspace...");
    }
    await hydrateWorkspace();
  } catch (error) {
    store.setState({ loading: false, booting: false });
    flashToast(error.message);
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

document.addEventListener("drop", (event) => {
  const dropZone = event.target.closest("[data-drop-zone]");
  if (!dropZone || !store.state.session) {
    return;
  }

  event.preventDefault();
  const dealId = event.dataTransfer.getData("text/plain");
  const targetStage = dropZone.dataset.dropZone;
  const data = store.state.appData || mockData;
  const deal = data.deals.find((item) => item.id === dealId);

  if (!deal || deal.stage === targetStage) {
    return;
  }

  deal.stage = targetStage;
  renderRoot(store.state);
  flashToast(`Deal moved to ${targetStage}. Persisting this to Supabase would be the next CRUD step.`);
});

onAuthStateChange(async (session) => {
  if (!supabaseEnabled) {
    return;
  }

  if (!session) {
    store.setState({
      appData: null,
      backend: "live",
      configured: true,
      loading: false,
      booting: false,
      session: null,
      drawer: null
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

hydrateWorkspace();
