window.SUPABASE_CONFIG = {
  url: 'https://{{ SUPABASE_URL }}'.replace(/^https:\/\/https:\/\//, 'https://'),
  key: '{{ SUPABASE_ANON_KEY }}'
}; 