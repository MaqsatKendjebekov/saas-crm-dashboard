import { badgeTone, escapeHtml, formatCompact, formatCurrency, formatDate, initials } from "../utils/format.js";

const dealStages = ["Discovery", "Qualified", "Proposal", "Negotiation"];
const PAGE_SIZE = 6;
function getCopy(language = "en") {
  if (language === "ru") {
    return {
      createTypes: [
        { id: "customer", label: "Клиент", hint: "Профиль аккаунта" },
        { id: "deal", label: "Сделка", hint: "Движение в воронке" },
        { id: "task", label: "Задача", hint: "Рабочее действие" },
        { id: "invoice", label: "Счет", hint: "Платежная запись" }
      ],
      controlCenter: "Центр управления",
      everythingStarts: "Все начинается здесь.",
      createRecord: "Создать запись",
      editingNow: "Сейчас редактируешь",
      workspaceStatus: "Состояние пространства"
    };
  }

  return {
    createTypes: [
      { id: "customer", label: "Customer", hint: "Account profile" },
      { id: "deal", label: "Deal", hint: "Pipeline motion" },
      { id: "task", label: "Task", hint: "Execution item" },
      { id: "invoice", label: "Invoice", hint: "Billing entry" }
    ],
    controlCenter: "Control Center",
    everythingStarts: "Everything starts here.",
    createRecord: "Create A Record",
    editingNow: "Editing now",
    workspaceStatus: "Workspace Status"
  };
}

const safe = escapeHtml;

function getUiCopy(language = "en") {
  const base = getCopy(language);
  if (language === "ru") {
    return {
      ...base,
      noMovement: "Пока без движения",
      addFirstRecords: "Добавь первые записи, и график начнет заполняться.",
      currentVolume: "Текущий объем",
      workspaceTrend: "Тренд",
      source: "Источник",
      live: "Онлайн",
      commandLayer: "Рабочая зона",
      dashboardTitleEmpty: "Чистое приватное CRM-пространство.",
      dashboardTitleLive: "Спокойный обзор по текущему workspace.",
      dashboardBodyEmpty: "Начни с клиента или сделки, а дальше разделы сами станут понятнее.",
      dashboardBodyLive: "Все записи принадлежат только текущему аккаунту и загружаются из защищенного Supabase workspace.",
      pipelineValue: "Сумма воронки",
      customerRecords: "Клиентские записи",
      overdueInvoices: "Просроченные счета",
      noRecordsYet: "Записей пока нет",
      addDataLocation: "Где добавить данные",
      dashboardStartsClean: "Старт без общих тестовых строк.",
      openControlCenterShort: "Открой Control Center и создай первую запись.",
      customerArr: "ARR клиентов",
      privateWorkspaceData: "Приватные данные",
      weightedPipeline: "Взвешенная воронка",
      liveDeals: "По текущим сделкам",
      openExecutionTasks: "Открытые задачи",
      accountsNeedAttention: "аккаунтов требуют внимания",
      noRiskyAccounts: "Рисковых аккаунтов нет",
      invoicesTracked: "Счетов в системе",
      noOverdueInvoices: "Нет просроченных счетов",
      growthSignal: "Динамика",
      growthSignalBody: "Короткий обзор по текущим данным.",
      recentActivity: "Последняя активность",
      recentActivityBody: "Последние действия в аккаунте.",
      activityEmpty: "История появится после первых действий.",
      accountsTracked: "Всего аккаунтов",
      payingAccounts: "Платящие аккаунты",
      qualifiedLeads: "Квалифицированные лиды",
      atRiskHealth: "Риск по health",
      customerAccounts: "Клиентские аккаунты",
      customerAccountsBody: "Нажми на запись, чтобы открыть карточку справа.",
      account: "Аккаунт",
      status: "Статус",
      owner: "Ответственный",
      plan: "План",
      arr: "ARR",
      health: "Health",
      noCustomerRecords: "Пока нет клиентов.",
      visibleAccounts: "аккаунтов видно",
      openPipeline: "Открытая воронка",
      enterpriseMotions: "Enterprise сделки",
      negotiations: "Переговоры",
      avgWinProbability: "Средний шанс",
      dragHint: "перетащи для смены этапа",
      noDealsInStage: "Пока нет сделок на этапе",
      executionQueue: "Очередь задач",
      executionQueueBody: "Открой задачу для деталей или удаления.",
      noTasksYet: "Пока нет задач.",
      workloadSnapshot: "Срез нагрузки",
      workloadSnapshotBody: "Приоритеты помогают быстро понять фокус.",
      laneMix: "Распределение",
      laneMixBody: "Сколько задач в каждой полосе.",
      collected: "Собрано",
      pendingOverdue: "Pending + overdue",
      invoicesLedger: "Реестр счетов",
      invoicesLedgerBody: "Открой счет для деталей или удаления.",
      noInvoicesYet: "Пока нет счетов.",
      billingGuidance: "Статусы счетов",
      paidNote: "Оплачено",
      pendingNote: "Ожидает оплаты",
      overdueNote: "Просрочено",
      createDeal: "Создать сделку",
      createTask: "Создать задачу",
      createInvoice: "Создать счет",
      createCustomer: "Создать клиента",
      workspaceStart: "Создай запись здесь и возвращайся в разделы.",
      workspaceReady: "В этом пространстве уже есть рабочие данные.",
      customersShort: "Клиенты",
      dealsShort: "Сделки",
      tasksShort: "Задачи",
      invoicesShort: "Счета",
      close: "Закрыть",
      deleteRecord: "Удалить запись",
      noNotesYet: "Пока без заметок.",
      accountSnapshot: "Срез аккаунта",
      notes: "Заметки",
      dealSnapshot: "Срез сделки",
      taskSnapshot: "Срез задачи",
      invoiceSnapshot: "Срез счета",
      dueDate: "Срок",
      value: "Сумма",
      priority: "Приоритет",
      amount: "Сумма",
      page: "Страница",
      prev: "Назад",
      next: "Вперед",
      valueLabels: {
        All: "Все",
        Customer: "Клиент",
        Qualified: "Квалифицирован",
        New: "Новый",
        Churned: "Потерян",
        Discovery: "Изучение",
        Proposal: "Предложение",
        Negotiation: "Переговоры",
        Open: "Открыта",
        "In Progress": "В работе",
        Blocked: "Заблокирована",
        Done: "Готово",
        Paid: "Оплачен",
        Pending: "Ожидает",
        Overdue: "Просрочен",
        Warm: "Теплый",
        Strong: "Сильный",
        Watch: "Наблюдать",
        Critical: "Критично",
        High: "Высокий",
        Medium: "Средний",
        Low: "Низкий",
        Today: "Сегодня",
        "This Week": "На неделе",
        Completed: "Завершено",
        "New Biz": "Новый бизнес",
        Expansion: "Расширение",
        Renewal: "Продление"
      }
    };
  }

  return {
    ...base,
    noMovement: "No movement yet",
    addFirstRecords: "Add the first records and this trend will wake up.",
    currentVolume: "Current volume",
    workspaceTrend: "Trend",
    source: "Source",
    live: "Live",
    commandLayer: "Workspace",
    dashboardTitleEmpty: "A clean private CRM workspace.",
    dashboardTitleLive: "A quieter overview of your current workspace.",
    dashboardBodyEmpty: "Start with a customer or deal, then the rest of the sections become useful immediately.",
    dashboardBodyLive: "All records belong to the current account and load from your protected Supabase workspace.",
    pipelineValue: "Pipeline value",
    customerRecords: "Customer records",
    overdueInvoices: "Overdue invoices",
    noRecordsYet: "No records yet",
    addDataLocation: "Where to add data",
    dashboardStartsClean: "This dashboard starts clean with no shared demo rows.",
    openControlCenterShort: "Open Control Center and create the first real record.",
    customerArr: "Customer ARR",
    privateWorkspaceData: "Private workspace data",
    weightedPipeline: "Weighted pipeline",
    liveDeals: "Based on active deals",
    openExecutionTasks: "Open tasks",
    accountsNeedAttention: "accounts need attention",
    noRiskyAccounts: "No risky accounts",
    invoicesTracked: "Invoices tracked",
    noOverdueInvoices: "No overdue invoices",
    growthSignal: "Growth signal",
    growthSignalBody: "A compact view of current movement.",
    recentActivity: "Recent activity",
    recentActivityBody: "Latest actions inside this account.",
    activityEmpty: "Activity will appear after your first actions.",
    accountsTracked: "Accounts tracked",
    payingAccounts: "Paying accounts",
    qualifiedLeads: "Qualified leads",
    atRiskHealth: "At-risk health",
    customerAccounts: "Customer accounts",
    customerAccountsBody: "Open a record to inspect it in the drawer.",
    account: "Account",
    status: "Status",
    owner: "Owner",
    plan: "Plan",
    arr: "ARR",
    health: "Health",
    noCustomerRecords: "No customer records yet.",
    visibleAccounts: "visible accounts",
    openPipeline: "Open pipeline",
    enterpriseMotions: "Enterprise motions",
    negotiations: "Negotiations",
    avgWinProbability: "Avg probability",
    dragHint: "drag to move",
    noDealsInStage: "No deals in stage",
    executionQueue: "Execution queue",
    executionQueueBody: "Open any task for details or deletion.",
    noTasksYet: "No tasks yet.",
    workloadSnapshot: "Workload",
    workloadSnapshotBody: "Use priorities to keep focus obvious.",
    laneMix: "Lane mix",
    laneMixBody: "How tasks are distributed right now.",
    collected: "Collected",
    pendingOverdue: "Pending + overdue",
    invoicesLedger: "Invoice ledger",
    invoicesLedgerBody: "Open an invoice to inspect or remove it.",
    noInvoicesYet: "No invoices yet.",
    billingGuidance: "Invoice states",
    paidNote: "Paid",
    pendingNote: "Pending",
    overdueNote: "Overdue",
    createDeal: "Create deal",
    createTask: "Create task",
    createInvoice: "Create invoice",
    createCustomer: "Create customer",
    workspaceStart: "Create a record here, then continue in the main sections.",
    workspaceReady: "You already have live records in this workspace.",
    customersShort: "Customers",
    dealsShort: "Deals",
    tasksShort: "Tasks",
    invoicesShort: "Invoices",
    close: "Close",
    deleteRecord: "Delete record",
    noNotesYet: "No notes yet.",
    accountSnapshot: "Account snapshot",
    notes: "Notes",
    dealSnapshot: "Deal snapshot",
    taskSnapshot: "Task snapshot",
    invoiceSnapshot: "Invoice snapshot",
    dueDate: "Due date",
    value: "Value",
    priority: "Priority",
    amount: "Amount",
    page: "Page",
    prev: "Prev",
    next: "Next",
    valueLabels: {}
  };
}

function getViewCopy(language = "en") {
  const copy = getUiCopy(language);

  if (language === "ru") {
    return {
      ...copy,
      contactsShort: "конт.",
      likelyShort: "вероятность",
      dueInline: "срок",
      stageLabel: "Этап",
      probabilityLabel: "Вероятность",
      ofTotal: "из",
      recordTypeLabels: {
        customer: "клиент",
        deal: "сделка",
        task: "задача",
        invoice: "счет"
      }
    };
  }

  return {
    ...copy,
    contactsShort: "contacts",
    likelyShort: "likely",
    dueInline: "due",
    stageLabel: "Stage",
    probabilityLabel: "Probability",
    ofTotal: "of",
    recordTypeLabels: {
      customer: "customer",
      deal: "deal",
      task: "task",
      invoice: "invoice"
    }
  };
}

function translateValue(copy, value) {
  return copy.valueLabels?.[value] || value;
}

function renderBadge(value, copy = getViewCopy("en")) {
  return `<span class="badge badge--${badgeTone(value)}">${safe(translateValue(copy, value))}</span>`;
}

function paginate(rows, state, view) {
  const currentPage = state.pages?.[view] || 1;
  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const end = Math.min(rows.length, start + PAGE_SIZE);

  return {
    pageRows: rows.slice(start, start + PAGE_SIZE),
    currentPage: safePage,
    totalPages,
    totalRows: rows.length,
    startIndex: rows.length ? start + 1 : 0,
    endIndex: end
  };
}

function renderPagination(view, pageInfo, copy) {
  if (pageInfo.totalPages <= 1) {
    return "";
  }

  return `
    <div class="pagination">
      <button class="ghost-button pagination__button" data-page-dir="prev" data-page-view="${view}" type="button" ${pageInfo.currentPage === 1 ? "disabled" : ""}>${safe(copy.prev)}</button>
      <span class="pagination__label">${pageInfo.startIndex}-${pageInfo.endIndex} ${safe(copy.ofTotal)} ${pageInfo.totalRows}</span>
      <button class="ghost-button pagination__button" data-page-dir="next" data-page-view="${view}" type="button" ${pageInfo.currentPage === pageInfo.totalPages ? "disabled" : ""}>${safe(copy.next)}</button>
    </div>
  `;
}

function renderField(label, input, hint = "") {
  return `
    <label class="field-card">
      <span class="field-card__label">${safe(label)}</span>
      ${input}
      ${hint ? `<span class="field-card__hint">${safe(hint)}</span>` : ""}
    </label>
  `;
}

function renderChart(values, copy) {
  if (!values.length || values.every((value) => value === 0)) {
    return `
      <div class="empty-chart">
        <strong>${safe(copy.noMovement)}</strong>
        <div class="muted">${safe(copy.addFirstRecords)}</div>
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
      <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${safe(copy.workspaceTrend)}">
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
        <div><span class="mini-label">${safe(copy.currentVolume)}</span><strong>${formatCompact(values.at(-1) * 1000)}</strong></div>
        <div><span class="mini-label">${safe(copy.workspaceTrend)}</span><strong>${safe(copy.live)}</strong></div>
        <div><span class="mini-label">${safe(copy.source)}</span><strong>Supabase</strong></div>
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

function renderDashboardHero(metrics, empty, copy) {
  return `
    <section class="hero-banner">
      <div>
        <span class="label">${safe(copy.commandLayer)}</span>
        <h2>${safe(empty ? copy.dashboardTitleEmpty : copy.dashboardTitleLive)}</h2>
        <p>${safe(empty ? copy.dashboardBodyEmpty : copy.dashboardBodyLive)}</p>
      </div>
      <div class="hero-stats">
        <div class="hero-stat"><span class="label">${safe(copy.pipelineValue)}</span><strong>${formatCurrency(metrics.totalPipeline)}</strong></div>
        <div class="hero-stat"><span class="label">${safe(copy.customerRecords)}</span><strong>${metrics.activeCustomers}</strong></div>
        <div class="hero-stat"><span class="label">${safe(copy.overdueInvoices)}</span><strong>${metrics.overdue}</strong></div>
      </div>
    </section>
  `;
}

function renderEmptyWorkspace(copy) {
  return `
    <section class="empty-workspace">
      <article class="empty-workspace__card">
        <strong>${safe(copy.noRecordsYet)}</strong>
        <p>${safe(copy.dashboardStartsClean)}</p>
      </article>
      <article class="empty-workspace__card">
        <strong>${safe(copy.addDataLocation)}</strong>
        <p>${safe(copy.openControlCenterShort)}</p>
      </article>
    </section>
  `;
}

export function renderDashboard(data, state) {
  const copy = getViewCopy(state.language);
  const metrics = getMetrics(data);
  const empty = isWorkspaceEmpty(data);
  const openTasks = data.tasks.filter((task) => task.status !== "Done").length;
  const atRisk = data.customers.filter((customer) => ["Watch", "Critical"].includes(customer.health)).length;
  const trendValues = data.deals.length ? data.deals.map((deal, index) => Math.max(12, deal.value / 1000 + index * 2)).slice(0, 7) : [];

  return `
    ${renderDashboardHero(metrics, empty, copy)}
    ${
      empty
        ? renderEmptyWorkspace(copy)
        : `
          <section class="metrics-grid">
            <article class="metric-card">
              <span class="metric-label">${safe(copy.customerArr)}</span>
              <div class="metric-value">${formatCurrency(metrics.totalArr)}</div>
              <span class="metric-change">${safe(copy.privateWorkspaceData)}</span>
            </article>
            <article class="metric-card">
              <span class="metric-label">${safe(copy.weightedPipeline)}</span>
              <div class="metric-value">${formatCurrency(metrics.totalPipeline)}</div>
              <span class="metric-change">${safe(copy.liveDeals)}</span>
            </article>
            <article class="metric-card">
              <span class="metric-label">${safe(copy.openExecutionTasks)}</span>
              <div class="metric-value">${openTasks}</div>
              <span class="metric-change ${atRisk ? "is-negative" : ""}">${atRisk ? `${atRisk} ${safe(copy.accountsNeedAttention)}` : safe(copy.noRiskyAccounts)}</span>
            </article>
            <article class="metric-card">
              <span class="metric-label">${safe(copy.invoicesTracked)}</span>
              <div class="metric-value">${data.invoices.length}</div>
              <span class="metric-change">${metrics.overdue ? `${metrics.overdue}` : safe(copy.noOverdueInvoices)}</span>
            </article>
          </section>
          <section class="content-grid">
            <article class="panel">
              <div class="panel__header">
                <div>
                  <h3>${safe(copy.growthSignal)}</h3>
                  <p>${safe(copy.growthSignalBody)}</p>
                </div>
                ${renderBadge("Live", copy)}
              </div>
              ${renderChart(trendValues, copy)}
            </article>
            <article class="activity-card">
              <div class="section-header">
                <div>
                  <h3>${safe(copy.recentActivity)}</h3>
                  <p>${safe(copy.recentActivityBody)}</p>
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
                    : `<div class="empty-state">${safe(copy.activityEmpty)}</div>`
                }
              </div>
            </article>
          </section>
        `
    }
  `;
}

export function renderStatusLabel(state) {
  const isRu = state.language === "ru";
  if (state.loading) {
    return isRu ? "Синхронизация" : "Syncing workspace";
  }

  if (state.backend === "live") {
    return state.session?.user?.email ? `${isRu ? "Supabase онлайн" : "Supabase live"} | ${safe(state.session.user.email)}` : isRu ? "Supabase онлайн" : "Supabase live";
  }

  if (state.configured) {
    return isRu ? "Supabase готов" : "Supabase ready";
  }

  return isRu ? "Демо режим" : "Demo mode";
}

export function renderCustomers(data, state) {
  const copy = getViewCopy(state.language);
  const pageInfo = paginate(filterCustomers(data, state), state, "customers");
  const rows = pageInfo.pageRows;

  return `
    <section class="summary-grid">
      <article class="summary-card"><span class="summary-label">${safe(copy.accountsTracked)}</span><div class="summary-value">${data.customers.length}</div></article>
      <article class="summary-card"><span class="summary-label">${safe(copy.payingAccounts)}</span><div class="summary-value">${data.customers.filter((item) => item.status === "Customer").length}</div></article>
      <article class="summary-card"><span class="summary-label">${safe(copy.qualifiedLeads)}</span><div class="summary-value">${data.customers.filter((item) => item.status === "Qualified").length}</div></article>
      <article class="summary-card"><span class="summary-label">${safe(copy.atRiskHealth)}</span><div class="summary-value">${data.customers.filter((item) => ["Watch", "Critical"].includes(item.health)).length}</div></article>
    </section>
    <section class="table-card">
      <div class="section-header">
        <div>
          <h3>${safe(copy.customerAccounts)}</h3>
          <p>${safe(copy.customerAccountsBody)}</p>
        </div>
        <div class="table-hint">${filterCustomers(data, state).length} ${safe(copy.visibleAccounts)}</div>
      </div>
      <div class="data-table">
        <div class="table-head">
          <div>${safe(copy.account)}</div>
          <div>${safe(copy.status)}</div>
          <div>${safe(copy.owner)}</div>
          <div>${safe(copy.plan)}</div>
          <div>${safe(copy.arr)}</div>
          <div>${safe(copy.health)}</div>
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
                        <div class="table-subtle">${safe(customer.region)} | ${customer.contacts} ${safe(copy.contactsShort)}</div>
                      </button>
                    </div>
                    <div>${renderBadge(customer.status, copy)}</div>
                    <div>${safe(customer.owner)}</div>
                    <div>${safe(customer.plan)}</div>
                    <div>${formatCurrency(customer.arr)}</div>
                    <div>${renderBadge(customer.health, copy)}</div>
                  </div>
                `
                )
                .join("")
            : `<div class="empty-state">${safe(copy.noCustomerRecords)}</div>`
        }
      </div>
      ${renderPagination("customers", pageInfo, copy)}
    </section>
  `;
}

export function renderDeals(data, state) {
  const copy = getViewCopy(state.language);
  const filteredDeals = filterDeals(data, state);
  const pageInfo = paginate(filteredDeals, state, "deals");
  const deals = pageInfo.pageRows;

  return `
    <section class="summary-grid">
      <article class="summary-card"><span class="summary-label">${safe(copy.openPipeline)}</span><div class="summary-value">${formatCompact(filteredDeals.reduce((sum, deal) => sum + deal.value, 0))}</div></article>
      <article class="summary-card"><span class="summary-label">${safe(copy.enterpriseMotions)}</span><div class="summary-value">${filteredDeals.filter((deal) => deal.type === "Enterprise").length}</div></article>
      <article class="summary-card"><span class="summary-label">${safe(copy.negotiations)}</span><div class="summary-value">${filteredDeals.filter((deal) => deal.stage === "Negotiation").length}</div></article>
      <article class="summary-card"><span class="summary-label">${safe(copy.avgWinProbability)}</span><div class="summary-value">${filteredDeals.length ? Math.round(filteredDeals.reduce((sum, deal) => sum + deal.probability, 0) / filteredDeals.length) : 0}%</div></article>
    </section>
    <section class="kanban-grid">
      ${dealStages
        .map((stage) => {
          const stageDeals = deals.filter((deal) => deal.stage === stage);
          return `
            <article class="kanban-column" data-stage="${stage}">
              <div class="kanban-column__head">
                <div>
                  <strong>${safe(translateValue(copy, stage))}</strong>
                  <div class="muted">${stageDeals.length} | ${safe(copy.dragHint)}</div>
                </div>
                ${renderBadge(stage, copy)}
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
                                <span>${deal.probability}% ${safe(copy.likelyShort)}</span>
                                <span>${formatDate(deal.dueDate)}</span>
                              </div>
                            </button>
                          </div>
                        `
                        )
                        .join("")
                    : `<div class="empty-state">${safe(copy.noDealsInStage)}: ${safe(translateValue(copy, stage).toLowerCase())}</div>`
                }
              </div>
            </article>
          `;
        })
        .join("")}
    </section>
    ${renderPagination("deals", pageInfo, copy)}
  `;
}

export function renderTasks(data, state) {
  const copy = getViewCopy(state.language);
  const pageInfo = paginate(filterTasks(data, state), state, "tasks");
  const tasks = pageInfo.pageRows;

  return `
    <section class="task-grid">
      <article class="table-card">
        <div class="section-header">
          <div>
            <h3>${safe(copy.executionQueue)}</h3>
            <p>${safe(copy.executionQueueBody)}</p>
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
                        <div>${renderBadge(task.status, copy)}</div>
                      </div>
                    `
                  )
                  .join("")
              : `<div class="empty-state">${safe(copy.noTasksYet)}</div>`
          }
        </div>
        ${renderPagination("tasks", pageInfo, copy)}
      </article>
      <div class="section-stack">
        <article class="summary-card">
          <span class="summary-label">${safe(copy.workloadSnapshot)}</span>
          <div class="summary-value">${tasks.filter((task) => task.status !== "Done").length}</div>
          <p class="muted">${safe(copy.workloadSnapshotBody)}</p>
        </article>
        <article class="activity-card">
          <div class="section-header">
            <div>
              <h3>${safe(copy.laneMix)}</h3>
              <p>${safe(copy.laneMixBody)}</p>
            </div>
          </div>
          <div class="key-metrics">
            ${["Today", "This Week", "Completed"]
              .map((lane) => {
                const count = tasks.filter((task) => task.lane === lane).length;
                return `<div class="metric-pill"><span>${safe(translateValue(copy, lane))}</span><strong>${count}</strong></div>`;
              })
              .join("")}
          </div>
        </article>
      </div>
    </section>
  `;
}

export function renderBilling(data, state) {
  const copy = getViewCopy(state.language);
  const filteredInvoices = filterInvoices(data, state);
  const pageInfo = paginate(filteredInvoices, state, "billing");
  const invoices = pageInfo.pageRows;
  const paidTotal = filteredInvoices.filter((invoice) => invoice.status === "Paid").reduce((sum, invoice) => sum + invoice.amount, 0);
  const pendingTotal = filteredInvoices.filter((invoice) => invoice.status !== "Paid").reduce((sum, invoice) => sum + invoice.amount, 0);

  return `
    <section class="billing-grid">
      <article class="billing-card"><span class="summary-label">${safe(copy.collected)}</span><div class="summary-value">${formatCurrency(paidTotal)}</div></article>
      <article class="billing-card"><span class="summary-label">${safe(copy.pendingOverdue)}</span><div class="summary-value">${formatCurrency(pendingTotal)}</div></article>
      <article class="billing-card"><span class="summary-label">${safe(copy.overdueInvoices)}</span><div class="summary-value">${filteredInvoices.filter((invoice) => invoice.status === "Overdue").length}</div></article>
      <article class="billing-card"><span class="summary-label">${safe(copy.invoicesTracked)}</span><div class="summary-value">${filteredInvoices.length}</div></article>
    </section>
    <section class="billing-breakdown">
      <article class="table-card">
        <div class="section-header">
          <div>
            <h3>${safe(copy.invoicesLedger)}</h3>
            <p>${safe(copy.invoicesLedgerBody)}</p>
          </div>
        </div>
        <div class="invoice-list">
          ${
            invoices.length
              ? invoices
                  .map(
                    (invoice) => `
                      <div class="invoice-row">
                        <button class="invoice-row__main" data-open-drawer="invoice" data-id="${invoice.id}" type="button">
                          <strong>${safe(invoice.company)}</strong>
                          <div class="table-subtle">${safe(invoice.id)} | ${safe(copy.dueInline)} ${formatDate(invoice.dueDate)}</div>
                        </button>
                        <div>${formatCurrency(invoice.amount)}</div>
                        <div>${renderBadge(invoice.status, copy)}</div>
                      </div>
                    `
                  )
                  .join("")
              : `<div class="empty-state">${safe(copy.noInvoicesYet)}</div>`
          }
        </div>
        ${renderPagination("billing", pageInfo, copy)}
      </article>
      <article class="activity-card">
        <div class="section-header">
          <div>
            <h3>${safe(copy.billingGuidance)}</h3>
            <p>${safe(copy.invoicesLedgerBody)}</p>
          </div>
        </div>
        <div class="helper-list">
          <div class="helper-note"><strong>${safe(copy.paidNote)}</strong></div>
          <div class="helper-note"><strong>${safe(copy.pendingNote)}</strong></div>
          <div class="helper-note"><strong>${safe(copy.overdueNote)}</strong></div>
        </div>
      </article>
    </section>
  `;
}

function renderCreateForm(state) {
  const copy = getViewCopy(state.language);
  const isRu = state.language === "ru";
  const formCopy = isRu
    ? {
        company: "Компания",
        companyHint: "К какому аккаунту относится запись.",
        companyPlaceholder: "Northstar Labs",
        dealTitle: "Название сделки",
        dealTitleHint: "Короткое понятное имя возможности.",
        dealTitlePlaceholder: "Expansion package",
        owner: "Ответственный",
        ownerHint: "Кто ведет эту запись.",
        ownerPlaceholder: "Elena Torres",
        value: "Сумма",
        valueHint: "Ожидаемая сумма в USD.",
        stage: "Этап",
        stageHint: "Текущее место сделки в воронке.",
        dueDate: "Срок",
        dueDateHint: "Когда нужно вернуться к этой записи.",
        probability: "Вероятность",
        probabilityHint: "Оценка шанса от 0 до 100.",
        dealType: "Тип сделки",
        dealTypeHint: "Помогает отделять новые продажи от продлений и расширений.",
        taskTitle: "Название задачи",
        taskTitleHint: "Лучше всего работает короткая формулировка действия.",
        taskTitlePlaceholder: "Подготовить предложение к звонку",
        relatedCustomer: "Клиент",
        relatedCustomerHint: "С каким аккаунтом связана задача.",
        assignee: "Исполнитель",
        assigneeHint: "Кто отвечает за выполнение.",
        assigneePlaceholder: "Jade Carter",
        priority: "Приоритет",
        priorityHint: "Определяет срочность.",
        status: "Статус",
        statusHint: "Текущее состояние записи.",
        lane: "Полоса",
        laneHint: "Где задача будет показана в рабочем срезе.",
        amount: "Сумма",
        amountHint: "Сумма счета в USD.",
        invoiceStatusHint: "Как этот счет должен отображаться в биллинге.",
        customerName: "Имя клиента",
        customerNameHint: "Название, которое видно в карточках и таблицах.",
        plan: "Тариф",
        planHint: "На каком пакете находится клиент.",
        customerStatusHint: "Где клиент находится в жизненном цикле.",
        arrHint: "Годовая регулярная выручка в USD.",
        health: "Состояние",
        healthHint: "Насколько устойчивы отношения с клиентом.",
        contacts: "Контакты",
        contactsHint: "Сколько людей привязано к аккаунту.",
        region: "Регион",
        regionHint: "Помогает фильтровать клиентскую базу.",
        notes: "Заметки",
        notesHint: "Короткий контекст, который удобно увидеть позже.",
        notesPlaceholder: "Короткая заметка о клиенте"
      }
    : {
        company: "Company",
        companyHint: "Which account this record belongs to.",
        companyPlaceholder: "Northstar Labs",
        dealTitle: "Deal title",
        dealTitleHint: "Short readable name for the opportunity.",
        dealTitlePlaceholder: "Expansion package",
        owner: "Owner",
        ownerHint: "Who leads this record.",
        ownerPlaceholder: "Elena Torres",
        value: "Value",
        valueHint: "Expected amount in USD.",
        stage: "Stage",
        stageHint: "Current place in the pipeline.",
        dueDate: "Due date",
        dueDateHint: "When this record should move next.",
        probability: "Probability",
        probabilityHint: "Confidence level from 0 to 100.",
        dealType: "Deal type",
        dealTypeHint: "Separates new sales from renewals and expansions.",
        taskTitle: "Task title",
        taskTitleHint: "Short action-oriented wording works best here.",
        taskTitlePlaceholder: "Review proposal before call",
        relatedCustomer: "Customer",
        relatedCustomerHint: "Which account this task relates to.",
        assignee: "Assignee",
        assigneeHint: "Who owns the action item.",
        assigneePlaceholder: "Jade Carter",
        priority: "Priority",
        priorityHint: "Controls urgency.",
        status: "Status",
        statusHint: "Current state of the record.",
        lane: "Lane",
        laneHint: "Where the task appears in the workload view.",
        amount: "Amount",
        amountHint: "Invoice amount in USD.",
        invoiceStatusHint: "How finance should read this invoice.",
        customerName: "Customer name",
        customerNameHint: "Visible label used in cards and tables.",
        plan: "Plan",
        planHint: "Which package the customer is on.",
        customerStatusHint: "Where the account sits in the lifecycle.",
        arrHint: "Annual recurring revenue in USD.",
        health: "Health",
        healthHint: "How healthy the relationship currently feels.",
        contacts: "Contacts",
        contactsHint: "How many people are attached to the account.",
        region: "Region",
        regionHint: "Useful for segmenting the customer list.",
        notes: "Notes",
        notesHint: "Short context worth keeping for later.",
        notesPlaceholder: "Short note about this customer"
      };

  switch (state.createType) {
    case "deal":
      return `
        <form class="control-form" data-create-form="deal">
          <div class="form-note">${safe(copy.workspaceStart)}</div>
          <div class="field-grid">
            ${renderField(formCopy.company, `<input name="company" placeholder="${safe(formCopy.companyPlaceholder)}" required />`, formCopy.companyHint)}
            ${renderField(formCopy.dealTitle, `<input name="title" placeholder="${safe(formCopy.dealTitlePlaceholder)}" required />`, formCopy.dealTitleHint)}
            ${renderField(formCopy.owner, `<input name="owner" placeholder="${safe(formCopy.ownerPlaceholder)}" required />`, formCopy.ownerHint)}
            ${renderField(formCopy.value, `<input name="value" type="number" min="0" placeholder="12000" required />`, formCopy.valueHint)}
            ${renderField(
              formCopy.stage,
              `<select name="stage">${dealStages.map((stage) => `<option value="${stage}">${safe(translateValue(copy, stage))}</option>`).join("")}</select>`,
              formCopy.stageHint
            )}
            ${renderField(formCopy.dueDate, `<input name="dueDate" type="date" required />`, formCopy.dueDateHint)}
            ${renderField(formCopy.probability, `<input name="probability" type="number" min="0" max="100" value="55" required />`, formCopy.probabilityHint)}
            ${renderField(
              formCopy.dealType,
              `<select name="type">
                <option value="New Biz">${safe(translateValue(copy, "New Biz"))}</option>
                <option value="Expansion">${safe(translateValue(copy, "Expansion"))}</option>
                <option value="Enterprise">Enterprise</option>
                <option value="Renewal">${safe(translateValue(copy, "Renewal"))}</option>
              </select>`,
              formCopy.dealTypeHint
            )}
          </div>
          <button class="primary-button" type="submit">${safe(copy.createDeal)}</button>
        </form>
      `;
    case "task":
      return `
        <form class="control-form" data-create-form="task">
          <div class="form-note">${safe(copy.workspaceStart)}</div>
          <div class="field-grid">
            ${renderField(formCopy.taskTitle, `<input name="title" placeholder="${safe(formCopy.taskTitlePlaceholder)}" required />`, formCopy.taskTitleHint)}
            ${renderField(formCopy.relatedCustomer, `<input name="customer" placeholder="${safe(formCopy.companyPlaceholder)}" required />`, formCopy.relatedCustomerHint)}
            ${renderField(formCopy.assignee, `<input name="assignee" placeholder="${safe(formCopy.assigneePlaceholder)}" required />`, formCopy.assigneeHint)}
            ${renderField(
              formCopy.priority,
              `<select name="priority">
                <option value="High">${safe(translateValue(copy, "High"))}</option>
                <option value="Medium" selected>${safe(translateValue(copy, "Medium"))}</option>
                <option value="Low">${safe(translateValue(copy, "Low"))}</option>
              </select>`,
              formCopy.priorityHint
            )}
            ${renderField(
              formCopy.status,
              `<select name="status">
                <option value="Open">${safe(translateValue(copy, "Open"))}</option>
                <option value="In Progress">${safe(translateValue(copy, "In Progress"))}</option>
                <option value="Blocked">${safe(translateValue(copy, "Blocked"))}</option>
                <option value="Done">${safe(translateValue(copy, "Done"))}</option>
              </select>`,
              formCopy.statusHint
            )}
            ${renderField(formCopy.dueDate, `<input name="dueDate" type="date" required />`, formCopy.dueDateHint)}
            ${renderField(
              formCopy.lane,
              `<select name="lane">
                <option value="Today">${safe(translateValue(copy, "Today"))}</option>
                <option value="This Week" selected>${safe(translateValue(copy, "This Week"))}</option>
                <option value="Completed">${safe(translateValue(copy, "Completed"))}</option>
              </select>`,
              formCopy.laneHint
            )}
          </div>
          <button class="primary-button" type="submit">${safe(copy.createTask)}</button>
        </form>
      `;
    case "invoice":
      return `
        <form class="control-form" data-create-form="invoice">
          <div class="form-note">${safe(copy.workspaceStart)}</div>
          <div class="field-grid">
            ${renderField(formCopy.company, `<input name="company" placeholder="Orbit Education" required />`, formCopy.companyHint)}
            ${renderField(formCopy.amount, `<input name="amount" type="number" min="0" placeholder="1800" required />`, formCopy.amountHint)}
            ${renderField(formCopy.dueDate, `<input name="dueDate" type="date" required />`, formCopy.dueDateHint)}
            ${renderField(
              formCopy.status,
              `<select name="status">
                <option value="Pending">${safe(translateValue(copy, "Pending"))}</option>
                <option value="Paid">${safe(translateValue(copy, "Paid"))}</option>
                <option value="Overdue">${safe(translateValue(copy, "Overdue"))}</option>
              </select>`,
              formCopy.invoiceStatusHint
            )}
          </div>
          <button class="primary-button" type="submit">${safe(copy.createInvoice)}</button>
        </form>
      `;
    default:
      return `
        <form class="control-form" data-create-form="customer">
          <div class="form-note">${safe(copy.workspaceStart)}</div>
          <div class="field-grid">
            ${renderField(formCopy.customerName, `<input name="name" placeholder="${safe(formCopy.companyPlaceholder)}" required />`, formCopy.customerNameHint)}
            ${renderField(formCopy.company, `<input name="company" placeholder="Northstar Labs Inc." required />`, formCopy.companyHint)}
            ${renderField(formCopy.owner, `<input name="owner" placeholder="${safe(formCopy.ownerPlaceholder)}" required />`, formCopy.ownerHint)}
            ${renderField(
              formCopy.plan,
              `<select name="plan">
                <option value="Starter">Starter</option>
                <option value="Growth" selected>Growth</option>
                <option value="Enterprise">Enterprise</option>
              </select>`,
              formCopy.planHint
            )}
            ${renderField(
              formCopy.status,
              `<select name="status">
                <option value="New">${safe(translateValue(copy, "New"))}</option>
                <option value="Qualified">${safe(translateValue(copy, "Qualified"))}</option>
                <option value="Customer">${safe(translateValue(copy, "Customer"))}</option>
                <option value="Churned">${safe(translateValue(copy, "Churned"))}</option>
              </select>`,
              formCopy.customerStatusHint
            )}
            ${renderField("ARR", `<input name="arr" type="number" min="0" placeholder="24000" required />`, formCopy.arrHint)}
            ${renderField(
              formCopy.health,
              `<select name="health">
                <option value="Warm">${safe(translateValue(copy, "Warm"))}</option>
                <option value="Strong">${safe(translateValue(copy, "Strong"))}</option>
                <option value="Watch">${safe(translateValue(copy, "Watch"))}</option>
                <option value="Critical">${safe(translateValue(copy, "Critical"))}</option>
              </select>`,
              formCopy.healthHint
            )}
            ${renderField(formCopy.contacts, `<input name="contacts" type="number" min="1" value="1" required />`, formCopy.contactsHint)}
            ${renderField(formCopy.region, `<input name="region" placeholder="US West" required />`, formCopy.regionHint)}
            ${renderField(formCopy.notes, `<textarea name="notes" rows="4" placeholder="${safe(formCopy.notesPlaceholder)}"></textarea>`, formCopy.notesHint)}
          </div>
          <button class="primary-button" type="submit">${safe(copy.createCustomer)}</button>
        </form>
      `;
  }
}

export function renderControl(data, state) {
  const empty = isWorkspaceEmpty(data);
  const copy = getViewCopy(state.language);
  const activeType = copy.createTypes.find((type) => type.id === state.createType) || copy.createTypes[0];

  return `
    <section class="control-layout">
      <article class="control-hero">
        <span class="label">${safe(copy.controlCenter)}</span>
        <h3>${safe(copy.everythingStarts)}</h3>
        <p>${safe(copy.workspaceStart)}</p>
      </article>
      <article class="control-panel">
        <div class="section-header">
          <div>
            <h3>${safe(copy.createRecord)}</h3>
            <p>${safe(copy.workspaceStart)}</p>
          </div>
        </div>
        <div class="control-current">
          <span class="control-current__label">${safe(copy.editingNow)}</span>
          <strong>${safe(activeType.label)}</strong>
          <span>${safe(activeType.hint)}</span>
        </div>
        <div class="type-switcher">
          ${copy.createTypes
            .map(
              (type) => `
                <button class="type-pill ${state.createType === type.id ? "is-active" : ""}" data-create-type="${type.id}" type="button">
                  <span class="type-pill__title">${safe(type.label)}</span>
                  <span class="type-pill__hint">${safe(type.hint)}</span>
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
            <h3>${safe(copy.workspaceStatus)}</h3>
            <p>${safe(empty ? copy.workspaceStart : copy.workspaceReady)}</p>
          </div>
        </div>
        <div class="key-metrics">
          <div class="metric-pill"><span>${safe(copy.customersShort)}</span><strong>${data.customers.length}</strong></div>
          <div class="metric-pill"><span>${safe(copy.dealsShort)}</span><strong>${data.deals.length}</strong></div>
          <div class="metric-pill"><span>${safe(copy.tasksShort)}</span><strong>${data.tasks.length}</strong></div>
          <div class="metric-pill"><span>${safe(copy.invoicesShort)}</span><strong>${data.invoices.length}</strong></div>
        </div>
      </article>
    </section>
  `;
}

function renderDrawerActions(type, entity, language) {
  const copy = getViewCopy(language);
  const label = entity.title || entity.name || entity.company || entity.id;

  return `
    <div class="drawer__actions">
      <button class="ghost-button" data-close-drawer="true" type="button">${safe(copy.close)}</button>
      <button
        class="ghost-button danger-ghost-button"
        data-request-delete="${safe(type)}"
        data-id="${safe(entity.id)}"
        data-name="${safe(label)}"
        type="button"
      >
        ${safe(copy.deleteRecord)}
      </button>
    </div>
  `;
}

export function renderDrawer(data, drawer, language = "en") {
  if (!drawer) {
    return "";
  }

  let entity = null;
  let content = "";
  const copy = getViewCopy(language);

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
        <h4>${safe(copy.accountSnapshot)}</h4>
        <div class="key-metrics">
          <div class="metric-pill"><span>${safe(copy.status)}</span>${renderBadge(entity.status, copy)}</div>
          <div class="metric-pill"><span>ARR</span><strong>${formatCurrency(entity.arr)}</strong></div>
          <div class="metric-pill"><span>${safe(copy.health)}</span>${renderBadge(entity.health, copy)}</div>
          <div class="metric-pill"><span>${safe(copy.recentActivity)}</span><strong>${formatDate(entity.lastActivity)}</strong></div>
        </div>
      </div>
      <div class="drawer__section">
        <h4>${safe(copy.notes)}</h4>
        <p class="muted">${safe(entity.notes || copy.noNotesYet)}</p>
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
        <h4>${safe(copy.dealSnapshot)}</h4>
        <div class="key-metrics">
          <div class="metric-pill"><span>${safe(copy.stageLabel)}</span>${renderBadge(entity.stage, copy)}</div>
          <div class="metric-pill"><span>${safe(copy.value)}</span><strong>${formatCurrency(entity.value)}</strong></div>
          <div class="metric-pill"><span>${safe(copy.probabilityLabel)}</span><strong>${entity.probability}%</strong></div>
          <div class="metric-pill"><span>${safe(copy.dueDate)}</span><strong>${formatDate(entity.dueDate)}</strong></div>
        </div>
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
        <h4>${safe(copy.taskSnapshot)}</h4>
        <div class="key-metrics">
          <div class="metric-pill"><span>${safe(copy.status)}</span>${renderBadge(entity.status, copy)}</div>
          <div class="metric-pill"><span>${safe(copy.priority)}</span>${renderBadge(entity.priority, copy)}</div>
          <div class="metric-pill"><span>${safe(copy.dueDate)}</span><strong>${formatDate(entity.dueDate)}</strong></div>
        </div>
      </div>
    `;
  }

  if (drawer.type === "invoice") {
    entity = data.invoices.find((item) => item.id === drawer.id);
    if (!entity) return "";
    content = `
      <div class="drawer-meta">
        <span>${safe(entity.company)}</span>
        <span>${safe(entity.id)}</span>
        <span>${formatDate(entity.dueDate)}</span>
      </div>
      <div class="drawer__section">
        <h4>${safe(copy.invoiceSnapshot)}</h4>
        <div class="key-metrics">
          <div class="metric-pill"><span>${safe(copy.status)}</span>${renderBadge(entity.status, copy)}</div>
          <div class="metric-pill"><span>${safe(copy.amount)}</span><strong>${formatCurrency(entity.amount)}</strong></div>
          <div class="metric-pill"><span>${safe(copy.dueDate)}</span><strong>${formatDate(entity.dueDate)}</strong></div>
        </div>
      </div>
    `;
  }

  return `
    <div class="drawer__backdrop" data-close-drawer="true"></div>
    <aside class="drawer" aria-label="Detail drawer">
      <div class="drawer__header">
        <div>
          <h3>${safe(entity.title || entity.name || entity.company || entity.id)}</h3>
          <p class="muted">${safe(copy.customerAccountsBody)}</p>
        </div>
        <span class="drawer__eyebrow">${safe(copy.recordTypeLabels?.[drawer.type] || drawer.type)}</span>
      </div>
      ${content}
      ${renderDrawerActions(drawer.type, entity, language)}
    </aside>
  `;
}
