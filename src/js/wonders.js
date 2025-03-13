document.addEventListener('DOMContentLoaded', async () => {
  const supabase = window.supabaseClient;
  if (!supabase) return;

  async function loadPublicWonders() {
    const { data: entries, error } = await supabase
      .from('wonder_entries')
      .select('*')
      .eq('is_public', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading entries:', error);
      return;
    }

    const entriesContainer = document.getElementById('wonderEntries');
    entriesContainer.innerHTML = entries.map(entry => `
      <div class="wonder-entry">
        <div class="entry-content">${entry.content}</div>
        <div class="entry-footer">
          <span class="entry-date">
            ${new Date(entry.created_at).toLocaleDateString()} at 
            ${new Date(entry.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    `).join('');
  }

  loadPublicWonders();
}); 