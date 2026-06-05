import { badgeTone, escapeHtml, formatCompact, formatCurrency, formatDate, initials } from "../utils/format.js";

const dealStages = ["Discovery", "Qualified", "Proposal", "Negotiation"];
const createTypes = [
  { id: "customer", label: "Customer" },
  { id: "deal", label: "Deal" },
  { id: "task", label: "Task" },
  { id: "invoice", label: "Invoice" }
];

const safe = escapeHtml;

function renderBadge(value) {
  return `<span class="badge badge--${badgeTone(value)}">${safe(value)}</span>`;
}

function renderChart(values) {
  if (!values.length || values.every((value) => value === 0)) {
    return `
      <div class="empty-chart">
        <strong>No movement yet</strong>
        <div class="muted">Add your first records from Control Center and this trend panel will come alive.</div>
      </div>
    `;
  }

  const width = 560;
  const height = 220;
  const padding = 20;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;

  const points = values
    .map((value, index) => {
      const x = padding + (index * (width - padding * 2)) / (values.length - 1);
      const y = height - padding - ((value - min) / range) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(" ");

  const areaPath = `M ${padding},${height - padding} L ${points
    .split(" ")
    .join(" L ")} L ${width - padding},${height - padding} Z`;

  const circles = points
    .split(" ")
    .map((point) => {
      const [cx, cy] = point.split(",");
      return `<circle cx="${cx}" cy="${cy}" r="5"></circle>`;
    })
    .join("");

  const gridLines = [0, 1, 2, 3].map((step) => {
    const y = padding + (step * (height - padding * 2)) / 3;
    return `<line x1="${padding}" y1="${y}" x2="${width - padding}" y2="${y}"></line>`;
  });

  return `
    <div class="chart">
      <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Workspace growth trend">
        <defs>
          <linearGradient id="revenueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#7ef2cf"></stop>
            <stop offset="100%" stop-color="#63b6ff"></stop>
          </linearGradient>
          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="rgba(126, 242, 207, 0.30)"></stop>
            <stop offset="100%" stop-color="rgba(126, 242, 207, 0.02)"></stop>
          </linearGradient>
        </defs>
        <g class="chart-grid">${gridLines.join("")}</g>
        <path class="chart-area" d="${areaPath}"></path>
        <polyline class="chart-path" points="${points}"></polyline>
        <g class="chart-points">${circles}</g>
      </svg>
      <div class="chart-footer">
        <div><span class="mini-label">Current volume</span><strong>${formatCompact(values.at(-1) * 1000)}</strong></div>
        <div><span class="mini-label">Workspace trend</span><strong>Live</strong></div>
        <div><span class="mini-label">Source</span><strong>Supabase</strong></div>
      </div>
    </div>
  `;
}

function getMetrics(data) {
  const totalArr = data.customers.reduce((sum, customer) => sum + customer.arr, 0);
  const totalPipeline = data.deals.reduce((sum, deal) => sum + deal.value, 0);
  const overdue = data.invoices.filter((invoice) => invoice.status === "Overdue").length;
  const activeCustomers = data.customers.length;

  return {
    totalArr,
    totalPipeline,
    overdue,
    activeCustomers
  };
}

function matchesSearch(value, search) {
  return value.toLowerCase().includes(search.toLowerCase());
}

function filterCustomers(data, state) {
  return data.customers.filter((customer) => {
    const searchText = `${customer.name} ${customer.owner} ${customer.region} ${customer.plan}`;
    const matchesStatus = state.filters.customers === "All" || customer.status === state.filters.customers;
    return matchesStatus && matchesSearch(searchText, state.globalSearch);
  });
}

function filterDeals(data, state) {
  return data.deals.filter((deal) => {
    const searchText = `${deal.company} ${deal.title} ${deal.owner} ${deal.type}`;
    const matchesStatus = state.filters.deals === "All" || deal.stage === state.filters.deals;
    return matchesStatus && matchesSearch(searchText, state.globalSearch);
  });
}

function filterTasks(data, state) {
  return data.tasks.filter((task) => {
    const searchText = `${task.title} ${task.assignee} ${task.customer} ${task.priority}`;
    const matchesStatus = state.filters.tasks === "All" || task.status === state.filters.tasks;
    return matchesStatus && matchesSearch(searchText, state.globalSearch);
  });
}

function filterInvoices(data, state) {
  return data.invoices.filter((invoice) => {
    const searchText = `${invoice.company} ${invoice.id}`;
    const matchesStatus = state.filters.billing === "All" || invoice.status === state.filters.billing;
    return matchesStatus && matchesSearch(searchText, state.globalSearch);
  });
}

function isWorkspaceEmpty(data) {
  return !data.customers.length && !data.deals.length && !data.tasks.length && !data.invoices.length;
}

function renderDashboardHero(metrics, empty) {
  return `
    <section class="hero-banner">
      <div>
        <span class="label">Command layer</span>
        <h2>${empty ? "Build your workspace from zero with a guided control center." : "Operate your whole pipeline from a cinematic SaaS cockpit."}</h2>
        <p>
          ${empty
            ? "There are no shared demo rows anymore. This workspace belongs to the signed-in user only. Start by creating your first customer or deal in Control Center."
            : "Your records are private to this account, routed through Supabase Auth and row-level policies, and surfaced through one focused interface."}
        </p>
        <div class="guide-grid">
          <div class="guide-card"><strong>Step 1</strong><span>Open Control Center</span><p>Create the first customer, task or invoice from one place.</p></div>
          <div class="guide-card"><strong>Step 2</strong><span>Use the menu</span><p>Customers, Deals, Tasks and Billing mirror how a real workspace is organized.</p></div>
          <div class="guide-card"><strong>Step 3</strong><span>Use the profile corner</span><p>Session controls and logout confirmation now live in the top-right profile area.</p></div>
        </div>
      </div>
      <div class="hero-stats">
        <div class="hero-stat"><span class="label">Pipeline value</span><strong>${formatCurrency(metrics.totalPipeline)}</strong></div>
        <div class="hero-stat"><span class="label">Customer records</span><strong>${metrics.activeCustomers}</strong></div>
        <div class="hero-stat"><span class="label">Overdue invoices</span><strong>${metrics.overdue}</strong></div>
      </div>
    </section>
  `;
}

function renderEmptyWorkspace() {
  return `
    <section class="empty-workspace">
      <article class="empty-workspace__card">
        <strong>No records yet</strong>
        <p>Your dashboard starts intentionally clean. No seeded CRM rows are shown to new users anymore.</p>
      </article>
      <article class="empty-workspace__card">
        <strong>Where to add data</strong>
        <p>Open <span class="inline-accent">Control Center</span> from the menu and create your first customer, deal, task or invoice.</p>
      </article>
      <article class="empty-workspace__card">
        <strong>What disappears later</strong>
        <p>This onboarding panel is only a guide. As soon as you add real data, the dashboard switches into the full operational mode automatically.</p>
      </article>
    </section>
  `;
}

export function renderDashboard(data) {
  const metrics = getMetrics(data);
  const empty = isWorkspaceEmpty(data);
  const openTasks = data.tasks.filter((task) => task.status !== "Done").length;
  const atRisk = data.customers.filter((customer) => ["Watch", "Critical"].includes(customer.health)).length;
  const trendValues = data.deals.length ? data.deals.map((deal, index) => Math.max(12, deal.value / 1000 + index * 2)).slice(0, 7) : [];

  return `
    ${renderDashboardHero(metrics, empty)}
    ${
      empty
        ? renderEmptyWorkspace()
        : `
          <section class="metrics-grid">
            <article class="metric-card">
              <span class="metric-label">Customer ARR</span>
              <div class="metric-value">${formatCurrency(metrics.totalArr)}</div>
              <span class="metric-change">Private workspace data</span>
            </article>
            <article class="metric-card">
              <span class="metric-label">Weighted pipeline</span>
              <div class="metric-value">${formatCurrency(metrics.totalPipeline)}</div>
              <span class="metric-change">Live from your deals</span>
            </article>
            <article class="metric-card">
              <span class="metric-label">Open execution tasks</span>
              <div class="metric-value">${openTasks}</div>
              <span class="metric-change ${atRisk ? "is-negative" : ""}">${atRisk ? `${atRisk} accounts need attention` : "No risky accounts flagged"}</span>
            </article>
            <article class="metric-card">
              <span class="metric-label">Invoices tracked</span>
              <div class="metric-value">${data.invoices.length}</div>
              <span class="metric-change">${metrics.overdue ? `${metrics.overdue} overdue` : "No overdue invoices"}</span>
            </article>
          </section>
          <section class="content-grid">
            <article class="panel">
              <div class="panel__header">
                <div>
                  <h3>Growth Signal</h3>
                  <p>This panel starts empty and grows only from records created by the current user.</p>
                </div>
                ${renderBadge("Live")}
              </div>
              ${renderChart(trendValues)}
            </article>
            <article class="activity-card">
              <div class="section-header">
                <div>
                  <h3>Recent Activity</h3>
                  <p>Latest actions inside this secure workspace.</p>
                </div>
              </div>
              <div class="activity-feed">
                ${
                  data.activity.length
                    ? data.activity
                        .map(
                          (item) => `
                          <div class="activity-item">
                            <div class="avatar">${safe(initials(item.actor || "You"))}</div>
                            <div>
                              <strong>${safe(item.actor || "You")}</strong>
                              <div>${safe(item.text)}</div>
                            </div>
                            <div class="muted">${safe(item.time || "Just now")}</div>
                          </div>
                        `
                        )
                        .join("")
                    : `<div class="empty-state">Activity feed will appear here once you begin creating or updating records.</div>`
                }
              </div>
            </article>
          </section>
        `
    }
  `;
}

export function renderStatusLabel(state) {
  if (state.loading) {
    return "Syncing workspace";
  }

  if (state.backend === "live") {
    return state.session?.user?.email ? `Supabase live | ${safe(state.session.user.email)}` : "Supabase live";
  }

  if (state.configured) {
    return "Supabase ready | idle";
  }

  return "Demo mode";
}

export function renderCustomers(data, state) {
  const rows = filterCustomers(data, state);

  return `
    <section class="summary-grid">
      <article class="summary-card"><span class="summary-label">Accounts tracked</span><div class="summary-value">${data.customers.length}</div></article>
      <article class="summary-card"><span class="summary-label">Paying accounts</span><div class="summary-value">${data.customers.filter((item) => item.status === "Customer").length}</div></article>
      <article class="summary-card"><span class="summary-label">Qualified leads</span><div class="summary-value">${data.customers.filter((item) => item.status === "Qualified").length}</div></article>
      <article class="summary-card"><span class="summary-label">At-risk health</span><div class="summary-value">${data.customers.filter((item) => ["Watch", "Critical"].includes(item.health)).length}</div></article>
    </section>
    <section class="table-card">
      <div class="section-header">
        <div>
          <h3>Customer Accounts</h3>
          <p>Every record below belongs to the currently authenticated user only.</p>
        </div>
        <div class="table-hint">${rows.length} visible account${rows.length === 1 ? "" : "s"}</div>
      </div>
      <div class="data-table">
        <div class="table-head">
          <div>Account</div>
          <div>Status</div>
          <div>Owner</div>
          <div>Plan</div>
          <div>ARR</div>
          <div>Health</div>
        </div>
        ${
          rows.length
            ? rows
                .map(
                  (customer) => `
                  <div class="table-row">
                    <div class="customer-cell">
                      <div class="avatar">${safe(initials(customer.name))}</div>
                      <button data-open-drawer="customer" data-id="${customer.id}">
                        <strong>${safe(customer.name)}</strong>
                        <div class="table-subtle">${safe(customer.region)} | ${customer.contacts} contacts</div>
                      </button>
                    </div>
                    <div>${renderBadge(customer.status)}</div>
                    <div>${safe(customer.owner)}</div>
                    <div>${safe(customer.plan)}</div>
                    <div>${formatCurrency(customer.arr)}</div>
                    <div>${renderBadge(customer.health)}</div>
                  </div>
                `
                )
                .join("")
            : `<div class="empty-state">No customer records yet. Open Control Center and create your first account.</div>`
        }
      </div>
    </section>
  `;
}

export function renderDeals(data, state) {
  const deals = filterDeals(data, state);

  return `
    <section class="summary-grid">
      <article class="summary-card"><span class="summary-label">Open pipeline</span><div class="summary-value">${formatCompact(deals.reduce((sum, deal) => sum + deal.value, 0))}</div></article>
      <article class="summary-card"><span class="summary-label">Enterprise motions</span><div class="summary-value">${deals.filter((deal) => deal.type === "Enterprise").length}</div></article>
      <article class="summary-card"><span class="summary-label">Negotiations</span><div class="summary-value">${deals.filter((deal) => deal.stage === "Negotiation").length}</div></article>
      <article class="summary-card"><span class="summary-label">Avg win probability</span><div class="summary-value">${deals.length ? Math.round(deals.reduce((sum, deal) => sum + deal.probability, 0) / deals.length) : 0}%</div></article>
    </section>
    <section class="kanban-grid">
      ${dealStages
        .map((stage) => {
          const stageDeals = deals.filter((deal) => deal.stage === stage);
          return `
            <article class="kanban-column" data-stage="${stage}">
              <div class="kanban-column__head">
                <div>
                  <strong>${stage}</strong>
                  <div class="muted">${stageDeals.length} deals</div>
                </div>
                ${renderBadge(stage)}
              </div>
              <div class="kanban-list" data-drop-zone="${stage}">
                ${
                  stageDeals.length
                    ? stageDeals
                        .map(
                          (deal) => `
                          <div class="deal-card" draggable="true" data-deal-id="${deal.id}">
                            <button data-open-drawer="deal" data-id="${deal.id}">
                              <div class="deal-card__header">
                                <div class="mini-avatar">${safe(initials(deal.company))}</div>
                                <div>
                                  <strong>${safe(deal.title)}</strong>
                                  <div class="table-subtle">${safe(deal.company)}</div>
                                </div>
                              </div>
                              <div class="deal-card__meta" style="margin-top:12px;">
                                <span>${formatCurrency(deal.value)}</span>
                                <span>${deal.probability}% likely</span>
                                <span>${formatDate(deal.dueDate)}</span>
                              </div>
                            </button>
                          </div>
                        `
                        )
                        .join("")
                    : `<div class="empty-state">No deals in ${stage.toLowerCase()} yet.</div>`
                }
              </div>
            </article>
          `;
        })
        .join("")}
    </section>
  `;
}

export function renderTasks(data, state) {
  const tasks = filterTasks(data, state);

  return `
    <section class="task-grid">
      <article class="table-card">
        <div class="section-header">
          <div>
            <h3>Execution Queue</h3>
            <p>Operational follow-through across your own workspace.</p>
          </div>
        </div>
        <div class="task-list">
          ${
            tasks.length
              ? tasks
                  .map(
                    (task) => `
                      <div class="task-row">
                        <div class="task-priority priority-${task.priority.toLowerCase()}"></div>
                        <button data-open-drawer="task" data-id="${task.id}">
                          <strong>${safe(task.title)}</strong>
                          <div class="task-meta">
                            <span>${safe(task.customer)}</span>
                            <span>${safe(task.assignee)}</span>
                            <span>${formatDate(task.dueDate)}</span>
                          </div>
                        </button>
                        <div>${renderBadge(task.status)}</div>
                      </div>
                    `
                  )
                  .join("")
              : `<div class="empty-state">No tasks yet. Add a first task in Control Center to build your workflow.</div>`
          }
        </div>
      </article>
      <div class="section-stack">
        <article class="summary-card">
          <span class="summary-label">Workload snapshot</span>
          <div class="summary-value">${tasks.filter((task) => task.status !== "Done").length}</div>
          <p class="muted">Use priorities to decide what should move first.</p>
        </article>
        <article class="activity-card">
          <div class="section-header">
            <div>
              <h3>Lane Mix</h3>
              <p>Shows whether your week is front-loaded or already completed.</p>
            </div>
          </div>
          <div class="key-metrics">
            ${["Today", "This Week", "Completed"]
              .map((lane) => {
                const count = tasks.filter((task) => task.lane === lane).length;
                return `<div class="metric-pill"><span>${safe(lane)}</span><strong>${count}</strong></div>`;
              })
              .join("")}
          </div>
        </article>
      </div>
    </section>
  `;
}

export function renderBilling(data, state) {
  const invoices = filterInvoices(data, state);
  const paidTotal = invoices.filter((invoice) => invoice.status === "Paid").reduce((sum, invoice) => sum + invoice.amount, 0);
  const pendingTotal = invoices.filter((invoice) => invoice.status !== "Paid").reduce((sum, invoice) => sum + invoice.amount, 0);

  return `
    <section class="billing-grid">
      <article class="billing-card"><span class="summary-label">Collected</span><div class="summary-value">${formatCurrency(paidTotal)}</div></article>
      <article class="billing-card"><span class="summary-label">Pending + overdue</span><div class="summary-value">${formatCurrency(pendingTotal)}</div></article>
      <article class="billing-card"><span class="summary-label">Overdue invoices</span><div class="summary-value">${invoices.filter((invoice) => invoice.status === "Overdue").length}</div></article>
      <article class="billing-card"><span class="summary-label">Invoices tracked</span><div class="summary-value">${invoices.length}</div></article>
    </section>
    <section class="billing-breakdown">
      <article class="table-card">
        <div class="section-header">
          <div>
            <h3>Invoice Ledger</h3>
            <p>Your billing section stays empty until you intentionally create invoices.</p>
          </div>
        </div>
        <div class="invoice-list">
          ${
            invoices.length
              ? invoices
                  .map(
                    (invoice) => `
                      <div class="invoice-row">
                        <div>
                          <strong>${safe(invoice.company)}</strong>
                          <div class="table-subtle">${safe(invoice.id)} | due ${formatDate(invoice.dueDate)}</div>
                        </div>
                        <div>${formatCurrency(invoice.amount)}</div>
                        <div>${renderBadge(invoice.status)}</div>
                      </div>
                    `
                  )
                  .join("")
              : `<div class="empty-state">No invoices yet. Create one from Control Center when you want to model a billing flow.</div>`
          }
        </div>
      </article>
      <article class="activity-card">
        <div class="section-header">
          <div>
            <h3>Billing Guidance</h3>
            <p>Simple hints so the product feels self-explanatory even on the first session.</p>
          </div>
        </div>
        <div class="helper-list">
          <div class="helper-note"><strong>Paid</strong><div class="muted">Use for settled invoices you want to keep in history.</div></div>
          <div class="helper-note"><strong>Pending</strong><div class="muted">Use for invoices that are sent but not yet collected.</div></div>
          <div class="helper-note"><strong>Overdue</strong><div class="muted">Use when you want the dashboard to surface risk more aggressively.</div></div>
        </div>
      </article>
    </section>
  `;
}

function renderCreateForm(state) {
  switch (state.createType) {
    case "deal":
      return `
        <form class="control-form" data-create-form="deal">
          <input name="company" placeholder="Company name" required />
          <input name="title" placeholder="Deal title" required />
          <input name="owner" placeholder="Deal owner" required />
          <input name="value" type="number" min="0" placeholder="Value in USD" required />
          <select name="stage">
            ${dealStages.map((stage) => `<option value="${stage}">${stage}</option>`).join("")}
          </select>
          <input name="dueDate" type="date" required />
          <input name="probability" type="number" min="0" max="100" value="55" required />
          <select name="type">
            <option value="New Biz">New Biz</option>
            <option value="Expansion">Expansion</option>
            <option value="Enterprise">Enterprise</option>
            <option value="Renewal">Renewal</option>
          </select>
          <button class="primary-button" type="submit">Create deal</button>
        </form>
      `;
    case "task":
      return `
        <form class="control-form" data-create-form="task">
          <input name="title" placeholder="Task title" required />
          <input name="customer" placeholder="Related customer" required />
          <input name="assignee" placeholder="Assignee" required />
          <select name="priority">
            <option value="High">High</option>
            <option value="Medium" selected>Medium</option>
            <option value="Low">Low</option>
          </select>
          <select name="status">
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Blocked">Blocked</option>
            <option value="Done">Done</option>
          </select>
          <input name="dueDate" type="date" required />
          <select name="lane">
            <option value="Today">Today</option>
            <option value="This Week" selected>This Week</option>
            <option value="Completed">Completed</option>
          </select>
          <button class="primary-button" type="submit">Create task</button>
        </form>
      `;
    case "invoice":
      return `
        <form class="control-form" data-create-form="invoice">
          <input name="company" placeholder="Company name" required />
          <input name="amount" type="number" min="0" placeholder="Amount in USD" required />
          <input name="dueDate" type="date" required />
          <select name="status">
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Overdue">Overdue</option>
          </select>
          <button class="primary-button" type="submit">Create invoice</button>
        </form>
      `;
    default:
      return `
        <form class="control-form" data-create-form="customer">
          <input name="name" placeholder="Customer display name" required />
          <input name="company" placeholder="Company name" required />
          <input name="owner" placeholder="Owner name" required />
          <select name="plan">
            <option value="Starter">Starter</option>
            <option value="Growth" selected>Growth</option>
            <option value="Enterprise">Enterprise</option>
          </select>
          <select name="status">
            <option value="New">New</option>
            <option value="Qualified">Qualified</option>
            <option value="Customer">Customer</option>
            <option value="Churned">Churned</option>
          </select>
          <input name="arr" type="number" min="0" placeholder="Annual recurring revenue" required />
          <select name="health">
            <option value="Warm">Warm</option>
            <option value="Strong">Strong</option>
            <option value="Watch">Watch</option>
            <option value="Critical">Critical</option>
          </select>
          <input name="contacts" type="number" min="1" value="1" required />
          <input name="region" placeholder="Region" required />
          <textarea name="notes" rows="4" placeholder="Short note about this customer"></textarea>
          <button class="primary-button" type="submit">Create customer</button>
        </form>
      `;
  }
}

export function renderControl(data, state) {
  const empty = isWorkspaceEmpty(data);

  return `
    <section class="control-layout">
      <article class="control-hero">
        <span class="label">Control Center</span>
        <h3>Everything starts here.</h3>
        <p>Instead of hardcoded demo rows, this workspace lets you create your own records. Add one entry and the dashboard immediately stops showing the setup-only guidance.</p>
        <div class="control-steps">
          <div class="control-step"><strong>Start with a customer</strong><span>Best first record if you want the app to make immediate sense.</span></div>
          <div class="control-step"><strong>Then add a deal or task</strong><span>This gives the pipeline and execution sections something real to render.</span></div>
          <div class="control-step"><strong>Use invoices last</strong><span>They make the billing area feel complete once the rest exists.</span></div>
        </div>
      </article>
      <article class="control-panel">
        <div class="section-header">
          <div>
            <h3>Create A Record</h3>
            <p>Select the type, fill the form, and the empty onboarding state will disappear automatically.</p>
          </div>
        </div>
        <div class="type-switcher">
          ${createTypes
            .map(
              (type) => `
                <button class="type-pill ${state.createType === type.id ? "is-active" : ""}" data-create-type="${type.id}" type="button">
                  ${safe(type.label)}
                </button>
              `
            )
            .join("")}
        </div>
        ${renderCreateForm(state)}
      </article>
      <article class="control-panel control-panel--meta">
        <div class="section-header">
          <div>
            <h3>Workspace Status</h3>
            <p>${empty ? "You are starting from a clean state." : "You already have live records in this workspace."}</p>
          </div>
        </div>
        <div class="key-metrics">
          <div class="metric-pill"><span>Customers</span><strong>${data.customers.length}</strong></div>
          <div class="metric-pill"><span>Deals</span><strong>${data.deals.length}</strong></div>
          <div class="metric-pill"><span>Tasks</span><strong>${data.tasks.length}</strong></div>
          <div class="metric-pill"><span>Invoices</span><strong>${data.invoices.length}</strong></div>
        </div>
      </article>
    </section>
  `;
}

export function renderDrawer(data, drawer) {
  if (!drawer) {
    return "";
  }

  let entity = null;
  let content = "";

  if (drawer.type === "customer") {
    entity = data.customers.find((item) => item.id === drawer.id);
    if (!entity) return "";
    content = `
      <div class="drawer-meta">
        <span>${safe(entity.owner)}</span>
        <span>${safe(entity.region)}</span>
        <span>${safe(entity.plan)}</span>
      </div>
      <div class="drawer__section">
        <h4>Account Snapshot</h4>
        <div class="key-metrics">
          <div class="metric-pill"><span>Status</span>${renderBadge(entity.status)}</div>
          <div class="metric-pill"><span>ARR</span><strong>${formatCurrency(entity.arr)}</strong></div>
          <div class="metric-pill"><span>Health</span>${renderBadge(entity.health)}</div>
          <div class="metric-pill"><span>Last activity</span><strong>${formatDate(entity.lastActivity)}</strong></div>
        </div>
      </div>
      <div class="drawer__section">
        <h4>Notes</h4>
        <p class="muted">${safe(entity.notes || "No notes yet.")}</p>
      </div>
    `;
  }

  if (drawer.type === "deal") {
    entity = data.deals.find((item) => item.id === drawer.id);
    if (!entity) return "";
    content = `
      <div class="drawer-meta">
        <span>${safe(entity.company)}</span>
        <span>${safe(entity.owner)}</span>
        <span>${safe(entity.type)}</span>
      </div>
      <div class="drawer__section">
        <h4>Deal Snapshot</h4>
        <div class="key-metrics">
          <div class="metric-pill"><span>Stage</span>${renderBadge(entity.stage)}</div>
          <div class="metric-pill"><span>Value</span><strong>${formatCurrency(entity.value)}</strong></div>
          <div class="metric-pill"><span>Probability</span><strong>${entity.probability}%</strong></div>
          <div class="metric-pill"><span>Due date</span><strong>${formatDate(entity.dueDate)}</strong></div>
        </div>
      </div>
      <div class="drawer__section">
        <h4>Why this matters</h4>
        <p class="muted">Drag and drop between stages gives the pipeline section a real workflow feel even before CRUD persistence is fully expanded.</p>
      </div>
    `;
  }

  if (drawer.type === "task") {
    entity = data.tasks.find((item) => item.id === drawer.id);
    if (!entity) return "";
    content = `
      <div class="drawer-meta">
        <span>${safe(entity.customer)}</span>
        <span>${safe(entity.assignee)}</span>
        <span>${safe(entity.lane)}</span>
      </div>
      <div class="drawer__section">
        <h4>Task Snapshot</h4>
        <div class="key-metrics">
          <div class="metric-pill"><span>Status</span>${renderBadge(entity.status)}</div>
          <div class="metric-pill"><span>Priority</span>${renderBadge(entity.priority)}</div>
          <div class="metric-pill"><span>Due date</span><strong>${formatDate(entity.dueDate)}</strong></div>
        </div>
      </div>
      <div class="drawer__section">
        <h4>Execution note</h4>
        <p class="muted">This drawer is where comments, assignee context and future checklist logic can grow later.</p>
      </div>
    `;
  }

  return `
    <div class="drawer__backdrop" data-close-drawer="true"></div>
    <aside class="drawer" aria-label="Detail drawer">
      <div class="drawer__header">
        <div>
          <h3>${safe(entity.title || entity.name)}</h3>
          <p class="muted">Detail drawer for fast context without leaving the current page.</p>
        </div>
        <button class="ghost-button" data-close-drawer="true">Close</button>
      </div>
      ${content}
    </aside>
  `;
}
