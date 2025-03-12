// Add debugging to see what values we're getting
const config = {
  url: 'https://{{ SUPABASE_URL }}',
  key: '{{ SUPABASE_ANON_KEY }}'
};

console.log('Raw config:', config);

// Check if variables were replaced
if (config.url.includes('{{')) {
  console.error('Environment variables not replaced during build!');
}

window.SUPABASE_CONFIG = config; 