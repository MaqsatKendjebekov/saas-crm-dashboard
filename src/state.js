export const views = {
  dashboard: "Dashboard",
  customers: "Customers",
  deals: "Deals",
  tasks: "Tasks",
  billing: "Billing"
};

export const store = {
  state: {
    activeView: "dashboard",
    appData: null,
    globalSearch: "",
    filters: {
      customers: "All",
      deals: "All",
      tasks: "All",
      billing: "All"
    },
    drawer: null,
    theme: "dark",
    toast: null,
    backend: "demo",
    configured: false,
    loading: true,
    booting: true,
    authMode: "signin",
    session: null
  },
  listeners: new Set(),
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  },
  setState(updater) {
    const nextState = typeof updater === "function" ? updater(this.state) : updater;
    this.state = {
      ...this.state,
      ...nextState,
      filters: {
        ...this.state.filters,
        ...(nextState.filters || {})
      }
    };
    this.listeners.forEach((listener) => listener(this.state));
  }
};
