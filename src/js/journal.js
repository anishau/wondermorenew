const supabaseUrl = 'https://nfveukmhsblksbjzydvf.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5mdmV1a21oc2Jsa3Nianp5ZHZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3OTE5MjgsImV4cCI6MjA1NzM2NzkyOH0.IgsgT4EUAJ6q8--ZqZnYqlUOOMkoDU1mUROGKej2k9Q'
const supabase = supabase.createClient(supabaseUrl, supabaseKey)

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
  entriesContainer.innerHTML = entries.map(entry => `
    <div class="wonder-entry">
      <p class="entry-content">${entry.content}</p>
      <div class="entry-footer">
        <span class="entry-date">${new Date(entry.created_at).toLocaleDateString()}</span>
      </div>
    </div>
  `).join('')
}

function showError(message) {
  const errorDiv = document.createElement('div')
  errorDiv.className = 'journal-error'
  errorDiv.textContent = message
  document.querySelector('.journal-container').prepend(errorDiv)
  setTimeout(() => errorDiv.remove(), 5000)
}

function showSuccess(message) {
  const successDiv = document.createElement('div')
  successDiv.className = 'journal-success'
  successDiv.textContent = message
  document.querySelector('.journal-container').prepend(successDiv)
  setTimeout(() => successDiv.remove(), 5000)
}

document.addEventListener('DOMContentLoaded', () => {
  const wonderForm = document.getElementById('wonderForm')
  if (wonderForm) {
    wonderForm.addEventListener('submit', handleWonderSubmit)
    loadEntries()
  }
}) 