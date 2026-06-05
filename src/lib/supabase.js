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
  const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
  if (error) {
    throw error;
  }
}

export async function signUpWithPassword(email, password) {
  const { error } = await supabaseClient.auth.signUp({ email, password });
  if (error) {
    throw error;
  }
}

export async function signOut() {
  const { error } = await supabaseClient.auth.signOut();
  if (error) {
    throw error;
  }
}

export async function signInWithOAuth(provider) {
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

async function selectAll(table) {
  const { data, error } = await supabaseClient.from(table).select("*");
  if (error) {
    throw error;
  }
  return data;
}

export async function fetchWorkspaceData() {
  const [customers, deals, tasks, invoices, activity] = await Promise.all([
    selectAll("customers"),
    selectAll("deals"),
    selectAll("tasks"),
    selectAll("invoices"),
    selectAll("activity")
  ]);

  return {
    customers,
    deals,
    tasks,
    invoices,
    activity,
    revenueTrend: [72, 78, 84, 87, 96, 109, 116, 129, 141, 148, 162, 176],
    churnTrend: [4.8, 4.1, 3.9, 3.7, 3.5, 3.6, 3.3, 3.1, 2.9, 2.8, 2.6, 2.4]
  };
}
