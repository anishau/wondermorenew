document.addEventListener('DOMContentLoaded', () => {
  if (!window.SUPABASE_CONFIG) {
    console.error('Supabase config not loaded');
    return;
  }

  const supabaseUrl = window.SUPABASE_CONFIG.url;
  const supabaseKey = window.SUPABASE_CONFIG.key;

  console.log('Supabase Config:', {
    url: supabaseUrl,
    keyLength: supabaseKey?.length || 0
  });

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase configuration')
    return
  }

  const supabase = window.supabase.createClient(supabaseUrl, supabaseKey)

  async function updateNavigation() {
    const { data: { session }, error } = await supabase.auth.getSession()
    const authLinks = document.getElementById('authLinks')
    
    if (session) {
      authLinks.innerHTML = `
        <a href="/journal" class="nav-link">Journal</a>
        <a href="#" class="nav-link" id="signOutLink">Sign Out</a>
      `
      // Add sign out handler
      document.getElementById('signOutLink').addEventListener('click', async (e) => {
        e.preventDefault()
        await supabase.auth.signOut()
        window.location.href = '/'
      })
    } else {
      authLinks.innerHTML = `<a href="/auth" class="nav-link">Sign In</a>`
      
      // Redirect if on journal page
      if (window.location.pathname === '/journal') {
        window.location.href = '/auth'
      }
    }
  }

  // Update navigation when auth state changes
  supabase.auth.onAuthStateChange((event, session) => {
    updateNavigation()
  })

  // Initial navigation update
  updateNavigation()

  // Auth functions
  async function checkCurrentSession() {
    const { data: { session }, error } = await supabase.auth.getSession()
    console.log('Current session:', session)
    if (session) {
      window.location.href = '/journal'
    }
  }

  // ... rest of your existing auth and journal functions ...

  // Initialize forms and check auth status
  const loginForm = document.querySelector('#loginForm')
  const signupForm = document.querySelector('#signupForm')
  const wonderForm = document.getElementById('wonderForm')

  console.log('Forms found:', {
    loginForm: !!loginForm,
    signupForm: !!signupForm
  })

  if (loginForm) {
    console.log('Login form found')
    loginForm.addEventListener('submit', handleLogin)
  }
  if (signupForm) {
    console.log('Signup form found')
    signupForm.addEventListener('submit', handleSignup)
  }
  if (wonderForm) {
    wonderForm.addEventListener('submit', handleWonderSubmit)
    loadEntries()
  }

  // Check auth status
  const isAuthPage = window.location.pathname === '/auth'
  if (isAuthPage) {
    checkCurrentSession()
  } else if (window.location.pathname === '/journal') {
    checkAuth()
  }

  async function handleSignup(event) {
    event.preventDefault()
    console.log('Signup attempt...')
    
    const form = event.target
    const email = form.querySelector('input[type="email"]').value
    const password = form.querySelector('input[type="password"]').value
    
    console.log('Attempting signup with:', { email })

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      })

      console.log('Signup response:', { data, error })

      if (error) {
        console.error('Signup error:', error)
        showError(error.message)
      } else {
        console.log('Signup successful:', data)
        showSuccess('Check your email to confirm your account')
      }
    } catch (err) {
      console.error('Unexpected error:', err)
      showError('An unexpected error occurred')
    }
  }

  async function handleLogin(event) {
    event.preventDefault()
    console.log('Login attempt...')
    
    const form = event.target
    const email = form.querySelector('input[type="email"]').value
    const password = form.querySelector('input[type="password"]').value
    
    console.log('Attempting login with:', { email })

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      console.log('Login response:', { data, error })

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
}) 