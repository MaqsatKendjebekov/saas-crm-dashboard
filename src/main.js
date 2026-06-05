import { data } from "./data/mockData.js";
import { store, views } from "./state.js";
import { renderBilling, renderCustomers, renderDashboard, renderDeals, renderDrawer, renderTasks } from "./components/views.js";

const root = document.getElementById("app");
let toastTimer = null;

function flashToast(message) {
  clearTimeout(toastTimer);
  store.setState({ toast: message });
  toastTimer = setTimeout(() => {
    store.setState({ toast: null });
  }, 2400);
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
        <div class="brand__mark">P</div>
        <div>
          <h1>Pulse CRM</h1>
          <p>Frontend portfolio SaaS</p>
        </div>
      </div>
      <div class="workspace-switcher">
        <strong>RevOps Workspace</strong>
        <div class="sidebar-copy">Admin access · 12 team members · 97.6% retention</div>
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
          <strong>Portfolio impact</strong>
          <div class="sidebar-copy">Shows dashboards, tables, filters, drawers, kanban interactions and product-focused UI.</div>
        </div>
        <div class="sidebar-card">
          <strong>Suggested next step</strong>
          <div class="sidebar-copy">Connect a real backend or Supabase layer and add auth, roles and optimistic updates.</div>
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

function renderApp(state) {
  document.body.dataset.theme = state.theme;

  root.innerHTML = `
    <div class="app-shell">
      ${renderSidebar(state)}
      <main class="main">
        ${renderTopbar(state)}
        ${renderView(state)}
        <div class="footer-note">Built as a frontend portfolio MVP with modular sections, dense UI, responsive layout and local mock state.</div>
      </main>
    </div>
    ${renderDrawer(data, state.drawer)}
    ${state.toast ? `<div class="toast" role="status" aria-live="polite">${state.toast}</div>` : ""}
  `;
}

store.subscribe(renderApp);
renderApp(store.state);

document.addEventListener("click", (event) => {
  const target = event.target.closest("[data-nav], [data-open-drawer], [data-close-drawer], [data-theme-toggle], [data-create-record]");
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
  }

  if (target.dataset.createRecord) {
    flashToast("Create flow placeholder: next upgrade would open a validated modal form.");
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
  if (!dropZone) {
    return;
  }

  event.preventDefault();
  const dealId = event.dataTransfer.getData("text/plain");
  const targetStage = dropZone.dataset.dropZone;
  const deal = data.deals.find((item) => item.id === dealId);

  if (!deal || deal.stage === targetStage) {
    return;
  }

  deal.stage = targetStage;
  renderApp(store.state);
  flashToast(`Deal moved to ${targetStage}. This is a good place for optimistic updates.`);
});
