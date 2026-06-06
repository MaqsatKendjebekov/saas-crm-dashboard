const config = window.SUPABASE_CONFIG || {};
export const oauthConfig = config.oauth || { google: false, github: false };

export const supabaseEnabled = Boolean(config.url && config.anonKey && window.supabase);

export const supabaseClient = supabaseEnabled
  ? window.supabase.createClient(config.url, config.anonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    })
  : null;

function ensureClient() {
  if (!supabaseClient) {
    throw new Error("Supabase client is not configured.");
  }
}

function getProjectRef() {
  if (!config.url) {
    return "";
  }

  const match = config.url.match(/^https:\/\/([^.]+)\.supabase\.co/i);
  return match ? match[1] : "";
}

function clearAuthStorage() {
  const projectRef = getProjectRef();
  const matchers = [
    "supabase.auth.token",
    "sb-",
    projectRef ? `sb-${projectRef}` : ""
  ].filter(Boolean);

  [window.localStorage, window.sessionStorage].forEach((storage) => {
    const keysToRemove = [];

    for (let index = 0; index < storage.length; index += 1) {
      const key = storage.key(index);
      if (!key) {
        continue;
      }

      if (matchers.some((matcher) => key.startsWith(matcher) || key.includes(matcher))) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach((key) => storage.removeItem(key));
  });
}

export async function getSession() {
  if (!supabaseClient) {
    return null;
  }

  const { data, error } = await supabaseClient.auth.getSession();
  if (error) {
    throw error;
  }

  return data.session;
}

export function onAuthStateChange(callback) {
  if (!supabaseClient) {
    return () => {};
  }

  const { data } = supabaseClient.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });

  return () => data.subscription.unsubscribe();
}

export async function signInWithPassword(email, password) {
  ensureClient();
  const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
  if (error) {
    throw error;
  }
}

export async function signUpWithPassword(email, password) {
  ensureClient();
  const { error } = await supabaseClient.auth.signUp({ email, password });
  if (error) {
    throw error;
  }
}

export async function signOut() {
  ensureClient();
  let lastError = null;

  try {
    const { error } = await supabaseClient.auth.signOut({ scope: "global" });
    if (error) {
      lastError = error;
    }
  } catch (error) {
    lastError = error;
  }

  if (lastError) {
    try {
      const { error } = await supabaseClient.auth.signOut({ scope: "local" });
      if (error) {
        lastError = error;
      } else {
        lastError = null;
      }
    } catch (error) {
      lastError = error;
    }
  }

  clearAuthStorage();

  if (lastError) {
    const session = await getSession().catch(() => null);
    if (session) {
      throw lastError;
    }
  }
}

export async function signInWithOAuth(provider) {
  ensureClient();
  const { error } = await supabaseClient.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: window.location.href
    }
  });

  if (error) {
    throw error;
  }
}

export function isOAuthEnabled(provider) {
  return Boolean(oauthConfig[provider]);
}

async function selectAll(table, orderBy = "created_at", ascending = false) {
  ensureClient();
  const { data, error } = await supabaseClient.from(table).select("*").order(orderBy, { ascending });
  if (error) {
    throw error;
  }
  return data;
}

export async function fetchWorkspaceData() {
  const [customers, deals, tasks, invoices, activity] = await Promise.all([
    selectAll("customers", "created_at", false),
    selectAll("deals", "created_at", false),
    selectAll("tasks", "created_at", false),
    selectAll("invoices", "created_at", false),
    selectAll("activity", "created_at", false)
  ]);

  return {
    customers,
    deals,
    tasks,
    invoices,
    activity
  };
}

export async function insertRecord(table, payload) {
  ensureClient();
  const { data, error } = await supabaseClient.from(table).insert(payload).select().single();
  if (error) {
    throw error;
  }
  return data;
}

export async function updateDealStage(dealId, stage) {
  ensureClient();
  const { error } = await supabaseClient.from("deals").update({ stage }).eq("id", dealId);
  if (error) {
    throw error;
  }
}
