document.addEventListener('DOMContentLoaded', async () => {
  const supabase = window.supabaseClient;
  if (!supabase) return;

  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    window.location.href = '/auth';
    return;
  }

  let currentTab = 'private';

  async function loadEntries(tab = 'private') {
    currentTab = tab;
    const { data: entries, error } = await supabase
      .from('wonder_entries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading entries:', error);
      return;
    }

    const filteredEntries = tab === 'private' 
      ? entries.filter(entry => entry.user_id === session.user.id)
      : entries.filter(entry => entry.is_public);

    const entriesContainer = document.getElementById('wonderEntries');
    entriesContainer.innerHTML = filteredEntries.map(entry => `
      <div class="wonder-entry" data-entry-id="${entry.id}">
        <div class="entry-content">${entry.content}</div>
        ${entry.is_public ? '<div class="entry-visibility">Public</div>' : ''}
        <div class="entry-footer">
          <span class="entry-date">
            ${new Date(entry.created_at).toLocaleDateString()} at 
            ${new Date(entry.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          ${entry.user_id === session.user.id ? 
            `<button class="delete-entry" aria-label="Delete entry">×</button>` : 
            ''}
        </div>
      </div>
    `).join('');

    // Add delete handlers
    document.querySelectorAll('.delete-entry').forEach(button => {
      button.addEventListener('click', handleDelete);
    });
  }

  async function handleDelete(event) {
    const entry = event.target.closest('.wonder-entry');
    const entryId = entry.dataset.entryId;
    
    if (confirm('Are you sure you want to delete this moment of wonder?')) {
      const { error } = await supabase
        .from('wonder_entries')
        .delete()
        .eq('id', entryId);

      if (error) {
        console.error('Error deleting entry:', error);
        showError('Failed to delete entry');
      } else {
        entry.style.opacity = '0';
        setTimeout(() => {
          entry.remove();
          showSuccess('Entry deleted');
        }, 300);
      }
    }
  }

  async function handleWonderSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const content = form.wonderEntry.value;
    const isPublic = form.isPublic.checked;

    const { error } = await supabase
      .from('wonder_entries')
      .insert([
        { 
          content, 
          user_id: session.user.id,
          is_public: isPublic
        }
      ]);

    if (error) {
      console.error('Error saving entry:', error);
      showError('Failed to save your moment of wonder');
    } else {
      form.reset();
      loadEntries(currentTab);
      showSuccess('Your moment of wonder has been recorded');
    }
  }

  // Add tab switching functionality
  document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      loadEntries(button.dataset.tab);
    });
  });

  function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'journal-error';
    errorDiv.textContent = message;
    document.querySelector('.journal-container').prepend(errorDiv);
    setTimeout(() => errorDiv.remove(), 5000);
  }

  function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'journal-success';
    successDiv.textContent = message;
    document.querySelector('.journal-container').prepend(successDiv);
    setTimeout(() => successDiv.remove(), 5000);
  }

  // Initialize form handler and load entries
  const wonderForm = document.getElementById('wonderForm');
  if (wonderForm) {
    wonderForm.addEventListener('submit', handleWonderSubmit);
    loadEntries('private');
  }
}); 