document.addEventListener('DOMContentLoaded', () => {
  const supabase = window.supabaseClient;
  if (!supabase) return;

  async function handleSignOut(e) {
    e.preventDefault();
    try {
      // First clear any session data
      await supabase.auth.signOut();
      
      // Clear any local storage data
      localStorage.clear();
      
      // Force a complete page reload and clear cache
      window.location.replace('/?t=' + new Date().getTime());
      
    } catch (err) {
      console.error('Error during sign out:', err);
      // If error, try a hard redirect
      window.location.href = '/';
    }
  }

  async function updateNavigation() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      const authLinks = document.getElementById('authLinks');
      
      if (session) {
        authLinks.innerHTML = `
          <a href="/wonders" class="nav-link">Public Wonders</a>
          <a href="/journal" class="nav-link">Journal</a>
          <button class="nav-link sign-out-button" id="signOutLink">Sign Out</button>
        `;
        
        // Add sign out handler
        const signOutLink = document.getElementById('signOutLink');
        if (signOutLink) {
          signOutLink.removeEventListener('click', handleSignOut); // Remove any existing listeners
          signOutLink.addEventListener('click', handleSignOut);
        }
      } else {
        authLinks.innerHTML = `
          <a href="/wonders" class="nav-link">Public Wonders</a>
          <a href="/auth" class="nav-link">Sign In</a>
        `;
      }
    } catch (err) {
      console.error('Error updating navigation:', err);
    }
  }

  // Update navigation when auth state changes
  supabase.auth.onAuthStateChange((event, session) => {
    console.log('Auth state changed:', event);
    if (event === 'SIGNED_OUT') {
      localStorage.clear();
      window.location.replace('/?t=' + new Date().getTime());
    } else {
      updateNavigation();
    }
  });

  // Initial navigation update
  updateNavigation();

  // Auth functions
  async function handleLogin(event) {
    event.preventDefault()
    console.log('Login attempt...')
    
    const form = event.target
    const email = form.querySelector('input[type="email"]').value
    const password = form.querySelector('input[type="password"]').value
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        console.error('Login error:', error)
        showError(error.message)
      } else {
        console.log('Login successful:', data)
        window.location.href = '/journal'
      }
    } catch (err) {
      console.error('Unexpected error:', err)
      showError('An unexpected error occurred')
    }
  }

  async function handleSignup(event) {
    event.preventDefault()
    
    const form = event.target
    const email = form.querySelector('input[type="email"]').value
    const password = form.querySelector('input[type="password"]').value
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      })

      if (error) {
        showError(error.message)
      } else {
        showSuccess('Check your email to confirm your account')
      }
    } catch (err) {
      console.error('Unexpected error:', err)
      showError('An unexpected error occurred')
    }
  }

  function showError(message) {
    const errorDiv = document.createElement('div')
    errorDiv.className = 'auth-error'
    errorDiv.textContent = message
    document.querySelector('.auth-container').prepend(errorDiv)
    setTimeout(() => errorDiv.remove(), 5000)
  }

  function showSuccess(message) {
    const successDiv = document.createElement('div')
    successDiv.className = 'auth-success'
    successDiv.textContent = message
    document.querySelector('.auth-container').prepend(successDiv)
    setTimeout(() => successDiv.remove(), 5000)
  }

  // Initialize forms
  const loginForm = document.querySelector('#loginForm')
  const signupForm = document.querySelector('#signupForm')

  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin)
  }
  if (signupForm) {
    signupForm.addEventListener('submit', handleSignup)
  }
}) 