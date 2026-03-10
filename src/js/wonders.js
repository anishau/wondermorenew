document.addEventListener('DOMContentLoaded', async () => {
  const supabase = window.supabaseClient;
  if (!supabase) return;

  function getInitialLayout(totalEntries) {
    const columns = window.innerWidth <= 768 ? 1 : window.innerWidth <= 1200 ? 2 : 3;
    const rows = Math.ceil(totalEntries / columns);
    let positions = [];
    
    for (let i = 0; i < totalEntries; i++) {
      positions.push({
        col: (i % columns) + 1,
        row: Math.floor(i / columns) + 1
      });
    }
    
    // Shuffle positions slightly for visual interest
    positions = positions.map(pos => ({
      ...pos,
      x: (Math.random() - 0.5) * 20, // Small random offset
      y: (Math.random() - 0.5) * 20
    }));
    
    return positions;
  }

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

    const positions = getInitialLayout(entries.length);
    const entriesContainer = document.getElementById('wonderEntries');
    entriesContainer.innerHTML = entries.map((entry, index) => {
      const pos = positions[index];
      return `
        <div class="wonder-entry" 
          data-x="${pos.x}" 
          data-y="${pos.y}"
          style="transform: translate(${pos.x}px, ${pos.y}px)"
        >
          <div class="entry-content">${entry.content}</div>
          <div class="entry-footer">
            <span class="entry-date">
              ${new Date(entry.created_at).toLocaleDateString()} at 
              ${new Date(entry.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      `;
    }).join('');

    // Initialize draggable
    interact('.wonder-entry').draggable({
      inertia: true,
      modifiers: [
        interact.modifiers.restrictRect({
          restriction: 'parent',
          endOnly: true
        })
      ],
      listeners: {
        start(event) {
          event.target.classList.add('dragging');
        },
        move(event) {
          const target = event.target;
          const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
          const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

          target.style.transform = `translate(${x}px, ${y}px)`;
          target.setAttribute('data-x', x);
          target.setAttribute('data-y', y);
        },
        end(event) {
          event.target.classList.remove('dragging');
        }
      }
    });
  }

  loadPublicWonders();

  // Reposition cards when window is resized
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(loadPublicWonders, 250);
  });
}); 