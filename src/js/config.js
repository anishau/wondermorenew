<<<<<<< HEAD
window.SUPABASE_CONFIG = {
  url: 'https://{{ SUPABASE_URL }}',  // Vercel will replace this with the actual URL
  key: '{{ SUPABASE_ANON_KEY }}'
}; 
=======
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
>>>>>>> ffd7b7ddd6f617682a30b5ff562feac62afca425
