export function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    maximumFractionDigits: 0,
    style: "currency"
  }).format(value);
}

export function formatCompact(value) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 1,
    notation: "compact"
  }).format(value);
}

export function formatDate(value) {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short"
  }).format(new Date(`${value}T12:00:00`));
}

export function initials(value) {
  return value
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function badgeTone(value) {
  const normalized = value.toLowerCase();

  if (["paid", "customer", "done", "strong", "active"].includes(normalized)) {
    return "success";
  }

  if (["pending", "qualified", "warm", "proposal", "medium"].includes(normalized)) {
    return "warning";
  }

  if (["overdue", "blocked", "critical", "churned", "high"].includes(normalized)) {
    return "danger";
  }

  return "info";
}
