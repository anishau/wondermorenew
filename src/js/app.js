document.addEventListener('DOMContentLoaded', () => {
  const supabase = window.supabaseClient;
  if (!supabase) return;

  async function updateNavigation() {
    const { data: { session }, error } = await supabase.auth.getSession()
    const authLinks = document.getElementById('authLinks')
    
    if (session) {
      authLinks.innerHTML = `
        <a href="/journal" class="nav-link">Journal</a>
        <a href="#" class="nav-link" id="signOutLink">Sign Out</a>
      `
      // Add sign out handler immediately after creating the link
      const signOutLink = document.getElementById('signOutLink');
      if (signOutLink) {
        signOutLink.addEventListener('click', async (e) => {
          e.preventDefault();
          try {
            const { error } = await supabase.auth.signOut();
            if (error) {
              console.error('Error signing out:', error);
            } else {
              console.log('Successfully signed out');
              window.location.href = '/';
            }
          } catch (err) {
            console.error('Unexpected error during sign out:', err);
          }
        });
      }
    } else {
      authLinks.innerHTML = `<a href="/auth" class="nav-link">Sign In</a>`
    }
  }

  // Update navigation when auth state changes
  supabase.auth.onAuthStateChange((event, session) => {
    console.log('Auth state changed:', event, session);
    updateNavigation();
    
    if (event === 'SIGNED_OUT') {
      window.location.href = '/';
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