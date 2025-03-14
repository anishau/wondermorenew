// Initialize Supabase client
function createSupabaseClient() {
  if (!window.SUPABASE_CONFIG) {
    console.error('Supabase config not loaded');
    return null;
  }

  const supabaseUrl = window.SUPABASE_CONFIG.url;
  const supabaseKey = window.SUPABASE_CONFIG.key;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase configuration');
    return null;
  }

  return window.supabase.createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: true, // Allow session persistence
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: window.localStorage // Use localStorage for session
    }
  });
}

window.supabaseClient = createSupabaseClient(); 