// Wait for Supabase to load
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM Content Loaded');
  
  const supabaseUrl = window.SUPABASE_CONFIG.url
  const supabaseKey = window.SUPABASE_CONFIG.key

  console.log('Supabase Config:', {
    url: supabaseUrl,
    keyPreview: supabaseKey ? supabaseKey.substring(0, 10) + '...' : 'missing',
    urlValid: supabaseUrl && !supabaseUrl.includes('{{'),
    keyValid: supabaseKey && !supabaseKey.includes('{{')
  })

  try {
    const supabase = window.supabase.createClient(supabaseUrl, supabaseKey)
    
    // Test the connection
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        console.error('Connection test failed:', error)
      } else {
        console.log('Connection test successful')
      }
    })

    // Auth functions
    async function checkCurrentSession() {
      const { data: { session }, error } = await supabase.auth.getSession()
      console.log('Current session:', session)
      if (session) {
        window.location.href = '/journal'
      }
    }

    async function handleLogin(event) {
      event.preventDefault()
      const form = event.target
      const submitButton = form.querySelector('button')
      const email = form.querySelector('input[type="email"]').value
      const password = form.querySelector('input[type="password"]').value

      console.log('Attempting login...')
      submitButton.disabled = true
      submitButton.textContent = 'Signing in...'

      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        })

        if (error) {
          console.error('Login error:', error)
          if (error.message.includes('Email not confirmed')) {
            showError('Email not confirmed. Check your inbox or click below to resend confirmation.')
            // Add resend confirmation button
            const resendButton = document.createElement('button')
            resendButton.textContent = 'Resend Confirmation Email'
            resendButton.className = 'auth-resend-button'
            resendButton.onclick = async () => {
              const { error: resendError } = await supabase.auth.resend({
                type: 'signup',
                email: email
              })
              if (resendError) {
                showError(resendError.message)
              } else {
                showSuccess('Confirmation email resent. Please check your inbox.')
              }
            }
            form.appendChild(resendButton)
          } else {
            showError(error.message)
          }
        } else {
          console.log('Login successful:', data)
          window.location.href = '/journal'
        }
      } catch (err) {
        console.error('Login error:', err)
        showError('An unexpected error occurred. Please try again.')
      } finally {
        submitButton.disabled = false
        submitButton.textContent = 'Sign In'
      }
    }

    async function handleSignup(event) {
      event.preventDefault()
      
      // Check for internet connection
      if (!navigator.onLine) {
        showError('Please check your internet connection and try again')
        return
      }

      const form = event.target
      const submitButton = form.querySelector('button')
      const email = form.querySelector('input[type="email"]').value
      const password = form.querySelector('input[type="password"]').value

      console.log('Attempting signup...')
      
      // Disable the button while processing
      submitButton.disabled = true
      submitButton.textContent = 'Creating account...'

      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password
        })

        if (error) {
          console.error('Signup error:', error)
          if (error.message.includes('security purposes')) {
            showError('Please wait a minute before trying again')
          } else if (error.message.includes('fetch')) {
            showError('Connection error. Please check your internet and try again')
          } else {
            showError(error.message)
          }
        } else {
          console.log('Signup successful:', data)
          showSuccess('Check your email to confirm your account')
          // Keep the button disabled for 60 seconds
          setTimeout(() => {
            submitButton.disabled = false
            submitButton.textContent = 'Create Account'
          }, 60000)
        }
      } catch (err) {
        console.error('Signup error:', err)
        showError('Connection error. Please check your internet and try again')
      } finally {
        // Re-enable the button if there was an error
        if (!submitButton.textContent.includes('Creating')) {
          submitButton.disabled = false
          submitButton.textContent = 'Create Account'
        }
      }
    }

    // Journal functions
    async function handleWonderSubmit(event) {
      event.preventDefault()
      const form = event.target
      const content = form.wonderEntry.value

      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        window.location.href = '/auth'
        return
      }

      const { data, error } = await supabase
        .from('wonder_entries')
        .insert([
          { content, user_id: user.id }
        ])

      if (error) {
        showError(error.message)
      } else {
        form.reset()
        loadEntries()
        showSuccess('Your moment of wonder has been recorded')
      }
    }

    async function loadEntries() {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return

      const { data: entries, error } = await supabase
        .from('wonder_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        showError(error.message)
        return
      }

      const entriesContainer = document.getElementById('wonderEntries')
      if (entriesContainer) {
        entriesContainer.innerHTML = entries.map(entry => `
          <div class="wonder-entry">
            <p class="entry-content">${entry.content}</p>
            <div class="entry-footer">
              <span class="entry-date">${new Date(entry.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        `).join('')
      }
    }

    // Utility functions
    function showError(message) {
      const container = document.querySelector('.auth-container') || document.querySelector('.journal-container')
      if (container) {
        const errorDiv = document.createElement('div')
        errorDiv.className = 'auth-error'
        errorDiv.textContent = message
        container.prepend(errorDiv)
        setTimeout(() => errorDiv.remove(), 5000)
      }
    }

    function showSuccess(message) {
      const container = document.querySelector('.auth-container') || document.querySelector('.journal-container')
      if (container) {
        const successDiv = document.createElement('div')
        successDiv.className = 'auth-success'
        successDiv.textContent = message
        container.prepend(successDiv)
        setTimeout(() => successDiv.remove(), 5000)
      }
    }

    // Initialize forms
    const loginForm = document.querySelector('#loginForm')
    const signupForm = document.querySelector('#signupForm')
    const wonderForm = document.getElementById('wonderForm')

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

    // Add this at the top of your DOMContentLoaded event
    window.addEventListener('online', () => {
      showSuccess('Internet connection restored')
    })

    window.addEventListener('offline', () => {
      showError('Internet connection lost')
    })
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err)
  }
}) 