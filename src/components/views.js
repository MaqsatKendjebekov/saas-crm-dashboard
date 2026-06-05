import { badgeTone, formatCompact, formatCurrency, formatDate, initials } from "../utils/format.js";

const dealStages = ["Discovery", "Qualified", "Proposal", "Negotiation"];

function renderBadge(value) {
  return `<span class="badge badge--${badgeTone(value)}">${value}</span>`;
}

function renderChart(values) {
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
      <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Revenue growth trend">
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
        <div><span class="mini-label">Current run-rate</span><strong>${formatCompact(values.at(-1) * 1000)}</strong></div>
        <div><span class="mini-label">Last quarter</span><strong>+22.4%</strong></div>
        <div><span class="mini-label">Retention</span><strong>97.6%</strong></div>
      </div>
    </div>
  `;
}

function getMetrics(data) {
  const totalArr = data.customers.filter((customer) => customer.status === "Customer").reduce((sum, customer) => sum + customer.arr, 0);
  const totalPipeline = data.deals.reduce((sum, deal) => sum + deal.value, 0);
  const overdue = data.invoices.filter((invoice) => invoice.status === "Overdue").length;
  const activeCustomers = data.customers.filter((customer) => customer.status === "Customer").length;

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

function renderHero(metrics) {
  return `
    <section class="hero-banner">
      <div>
        <span class="label">Revenue command center</span>
        <h2>Operate the full customer lifecycle from one polished SaaS dashboard.</h2>
        <p>
          This MVP focuses on the work that actually matters in a frontend portfolio: dense data views, UX states,
          role-aware structure, filters, pipeline movement, billing visibility, and a layout that feels product-grade.
        </p>
      </div>
      <div class="hero-stats">
        <div class="hero-stat"><span class="label">Pipeline value</span><strong>${formatCurrency(metrics.totalPipeline)}</strong></div>
        <div class="hero-stat"><span class="label">Overdue invoices</span><strong>${metrics.overdue}</strong></div>
        <div class="hero-stat"><span class="label">Active customers</span><strong>${metrics.activeCustomers}</strong></div>
      </div>
    </section>
  `;
}

export function renderDashboard(data) {
  const metrics = getMetrics(data);
  const atRisk = data.customers.filter((customer) => ["Watch", "Critical"].includes(customer.health)).length;
  const openTasks = data.tasks.filter((task) => task.status !== "Done").length;

  return `
    ${renderHero(metrics)}
    <section class="metrics-grid">
      <article class="metric-card">
        <span class="metric-label">Monthly recurring revenue</span>
        <div class="metric-value">${formatCurrency(metrics.totalArr / 12)}</div>
        <span class="metric-change">+11.8% MoM</span>
      </article>
      <article class="metric-card">
        <span class="metric-label">Weighted pipeline</span>
        <div class="metric-value">${formatCurrency(metrics.totalPipeline)}</div>
        <span class="metric-change">+6 net new deals</span>
      </article>
      <article class="metric-card">
        <span class="metric-label">Open execution tasks</span>
        <div class="metric-value">${openTasks}</div>
        <span class="metric-change is-negative">${atRisk} accounts need attention</span>
      </article>
      <article class="metric-card">
        <span class="metric-label">Net revenue retention</span>
        <div class="metric-value">116%</div>
        <span class="metric-change">Expansion outpacing churn</span>
      </article>
    </section>
    <section class="content-grid">
      <article class="panel">
        <div class="panel__header">
          <div>
            <h3>Growth Momentum</h3>
            <p>Revenue trend paired with a retention-oriented go-to-market motion.</p>
          </div>
          ${renderBadge("Healthy")}
        </div>
        ${renderChart(data.revenueTrend)}
      </article>
      <article class="activity-card">
        <div class="section-header">
          <div>
            <h3>Live Activity Feed</h3>
            <p>Recent account and billing moves across the team.</p>
          </div>
        </div>
        <div class="activity-feed">
          ${data.activity
            .map(
              (item) => `
              <div class="activity-item">
                <div class="avatar">${initials(item.actor)}</div>
                <div>
                  <strong>${item.actor}</strong>
                  <div>${item.text}</div>
                </div>
                <div class="muted">${item.time}</div>
              </div>
            `
            )
            .join("")}
        </div>
      </article>
    </section>
  `;
}

export function renderStatusLabel(state) {
  if (state.loading) {
    return "Syncing workspace";
  }

  if (state.backend === "live") {
    return state.session?.user?.email ? `Supabase live · ${state.session.user.email}` : "Supabase live · public read";
  }

  if (state.configured) {
    return "Supabase ready · demo mode";
  }

  return "Demo mode";
}

export function renderCustomers(data, state) {
  const rows = filterCustomers(data, state);

  return `
    <section class="summary-grid">
      <article class="summary-card"><span class="summary-label">Accounts tracked</span><div class="summary-value">${data.customers.length}</div></article>
      <article class="summary-card"><span class="summary-label">Customers</span><div class="summary-value">${data.customers.filter((item) => item.status === "Customer").length}</div></article>
      <article class="summary-card"><span class="summary-label">Qualified leads</span><div class="summary-value">${data.customers.filter((item) => item.status === "Qualified").length}</div></article>
      <article class="summary-card"><span class="summary-label">At-risk health</span><div class="summary-value">${data.customers.filter((item) => ["Watch", "Critical"].includes(item.health)).length}</div></article>
    </section>
    <section class="table-card">
      <div class="section-header">
        <div>
          <h3>Customer Accounts</h3>
          <p>Searchable account list with lifecycle status, ARR and ownership.</p>
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
        ${rows.length
          ? rows
              .map(
                (customer) => `
                <div class="table-row">
                  <div class="customer-cell">
                    <div class="avatar">${initials(customer.name)}</div>
                    <button data-open-drawer="customer" data-id="${customer.id}">
                      <strong>${customer.name}</strong>
                      <div class="table-subtle">${customer.region} • ${customer.contacts} contacts</div>
                    </button>
                  </div>
                  <div>${renderBadge(customer.status)}</div>
                  <div>${customer.owner}</div>
                  <div>${customer.plan}</div>
                  <div>${formatCurrency(customer.arr)}</div>
                  <div>${renderBadge(customer.health)}</div>
                </div>
              `
              )
              .join("")
          : `<div class="empty-state">No accounts match the current search or filter.</div>`}
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
      <article class="summary-card"><span class="summary-label">Avg win probability</span><div class="summary-value">${Math.round(deals.reduce((sum, deal) => sum + deal.probability, 0) / Math.max(deals.length, 1))}%</div></article>
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
                              <div class="mini-avatar">${initials(deal.company)}</div>
                              <div>
                                <strong>${deal.title}</strong>
                                <div class="table-subtle">${deal.company}</div>
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
                    : `<div class="empty-state">Drop deals here</div>`
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
            <p>Cross-functional task view with assignees, deadlines and status.</p>
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
                      <strong>${task.title}</strong>
                      <div class="task-meta">
                        <span>${task.customer}</span>
                        <span>${task.assignee}</span>
                        <span>${formatDate(task.dueDate)}</span>
                      </div>
                    </button>
                    <div>${renderBadge(task.status)}</div>
                  </div>
                `
                  )
                  .join("")
              : `<div class="empty-state">No tasks match the current search or filter.</div>`
          }
        </div>
      </article>
      <div class="section-stack">
        <article class="summary-card">
          <span class="summary-label">Workload snapshot</span>
          <div class="summary-value">${tasks.filter((task) => task.status !== "Done").length}</div>
          <p class="muted">Open and in-progress execution items across CX, sales and billing.</p>
        </article>
        <article class="activity-card">
          <div class="section-header">
            <div>
              <h3>Lane Mix</h3>
              <p>How work is distributed through the week.</p>
            </div>
          </div>
          <div class="key-metrics">
            ${["Today", "This Week", "Completed"]
              .map((lane) => {
                const count = tasks.filter((task) => task.lane === lane).length;
                return `<div class="metric-pill"><span>${lane}</span><strong>${count}</strong></div>`;
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
      <article class="billing-card"><span class="summary-label">Collected this cycle</span><div class="summary-value">${formatCurrency(paidTotal)}</div></article>
      <article class="billing-card"><span class="summary-label">Pending + overdue</span><div class="summary-value">${formatCurrency(pendingTotal)}</div></article>
      <article class="billing-card"><span class="summary-label">Overdue invoices</span><div class="summary-value">${invoices.filter((invoice) => invoice.status === "Overdue").length}</div></article>
      <article class="billing-card"><span class="summary-label">Enterprise plans</span><div class="summary-value">${data.customers.filter((customer) => customer.plan === "Enterprise").length}</div></article>
    </section>
    <section class="billing-breakdown">
      <article class="table-card">
        <div class="section-header">
          <div>
            <h3>Invoice Ledger</h3>
            <p>Billing visibility with status filtering and due dates.</p>
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
                      <strong>${invoice.company}</strong>
                      <div class="table-subtle">${invoice.id} • due ${formatDate(invoice.dueDate)}</div>
                    </div>
                    <div>${formatCurrency(invoice.amount)}</div>
                    <div>${renderBadge(invoice.status)}</div>
                  </div>
                `
                  )
                  .join("")
              : `<div class="empty-state">No invoices match the current search or filter.</div>`
          }
        </div>
      </article>
      <article class="activity-card">
        <div class="section-header">
          <div>
            <h3>Subscription Highlights</h3>
            <p>High-level plan mix and upsell story.</p>
          </div>
        </div>
        <div class="key-metrics">
          <div class="metric-pill"><span>Starter</span><strong>${data.customers.filter((customer) => customer.plan === "Starter").length}</strong></div>
          <div class="metric-pill"><span>Growth</span><strong>${data.customers.filter((customer) => customer.plan === "Growth").length}</strong></div>
          <div class="metric-pill"><span>Enterprise</span><strong>${data.customers.filter((customer) => customer.plan === "Enterprise").length}</strong></div>
          <div class="metric-pill"><span>Expansion pipeline</span><strong>${formatCurrency(data.deals.filter((deal) => deal.type === "Expansion").reduce((sum, deal) => sum + deal.value, 0))}</strong></div>
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
        <span>${entity.owner}</span>
        <span>${entity.region}</span>
        <span>${entity.plan}</span>
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
        <p class="muted">${entity.notes}</p>
      </div>
    `;
  }

  if (drawer.type === "deal") {
    entity = data.deals.find((item) => item.id === drawer.id);
    if (!entity) return "";
    content = `
      <div class="drawer-meta">
        <span>${entity.company}</span>
        <span>${entity.owner}</span>
        <span>${entity.type}</span>
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
        <p class="muted">A clean drawer flow like this is useful in portfolio work because it shows dense detail without forcing route changes or modals for every object.</p>
      </div>
    `;
  }

  if (drawer.type === "task") {
    entity = data.tasks.find((item) => item.id === drawer.id);
    if (!entity) return "";
    content = `
      <div class="drawer-meta">
        <span>${entity.customer}</span>
        <span>${entity.assignee}</span>
        <span>${entity.lane}</span>
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
        <p class="muted">This panel is a good place for comments, checklists, audit history, or support context in a real implementation.</p>
      </div>
    `;
  }

  return `
    <div class="drawer__backdrop" data-close-drawer="true"></div>
    <aside class="drawer" aria-label="Detail drawer">
      <div class="drawer__header">
        <div>
          <h3>${entity.title || entity.name}</h3>
          <p class="muted">Detail drawer for fast context without leaving the page.</p>
        </div>
        <button class="ghost-button" data-close-drawer="true">Close</button>
      </div>
      ${content}
    </aside>
  `;
}
