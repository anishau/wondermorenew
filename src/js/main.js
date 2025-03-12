const cosmicWonders = [
  {
<<<<<<< HEAD
    title: "Light Study",
    description: "Notice the light where you are right now. What shapes it? How does it interact with surfaces? Follow a shadow's edge and wonder about the astronomical dance that drew it.",
    gradient: "linear-gradient(45deg, #f5f2eb, #eae6dd)"
  },
  {
    title: "Sound Meditation",
    description: "Close your eyes. What's the farthest sound you can hear? The closest? Notice how each sound has a texture, a story of friction and vibration waiting to be wondered about.",
    gradient: "linear-gradient(45deg, #eae6dd, #e5e1d8)"
  },
  {
    title: "Material Questions",
    description: "Choose any object near you. Where did its materials come from? Imagine the journey of its atoms from stars to this moment. What processes shaped it?",
    gradient: "linear-gradient(45deg, #e5e1d8, #f5f2eb)"
=======
    title: "Methods for Wonder",
    description: "Notice the light where you are right now. What shapes it? What causes the sun to be translated in this way? Why do the shadows look just so? Which parts of this process remain beyond the edge of your knowledge?",
    gradient: "linear-gradient(45deg, #eee5d8, #faf7f2)"
  },
  {
    title: "Practicing Awe",
    description: "When you reach the edge of your understanding, pause there. Notice the vastness of what you don't know. Let yourself feel small in the face of this unknowing. This is where wonder transforms into awe.",
    gradient: "linear-gradient(45deg, #f5efe7, #eee5d8)"
  },
  {
    title: "Daily Mysteries",
    description: "Even the most mundane moments contain infinite depth. A stranger's laugh, the pattern of cracks in the sidewalk, the way sunlight bends through your window - each is an invitation to wonder.",
    gradient: "linear-gradient(45deg, #eee5d8, #faf7f2)"
>>>>>>> ffd7b7ddd6f617682a30b5ff562feac62afca425
  }
];

let currentWonder = 0;

function updateWonder() {
  const wonderTitle = document.getElementById('wonderTitle')
  const wonderDescription = document.getElementById('wonderDescription')
  const wonderCard = document.querySelector('.wonderCard')
  
  if (wonderTitle && wonderDescription && wonderCard) {
    wonderTitle.textContent = cosmicWonders[currentWonder].title;
    wonderDescription.textContent = cosmicWonders[currentWonder].description;
    wonderCard.style.background = cosmicWonders[currentWonder].gradient;
  }
}

function nextWonder() {
  currentWonder = (currentWonder + 1) % cosmicWonders.length;
  updateWonder();
}

function previousWonder() {
  currentWonder = (currentWonder - 1 + cosmicWonders.length) % cosmicWonders.length;
  updateWonder();
}

// Initialize first wonder
document.addEventListener('DOMContentLoaded', updateWonder);

// Add this at the top of the file
document.addEventListener('DOMContentLoaded', function() {
  // Mobile dropdown toggle
  const dropdownButton = document.querySelector('.dropdown-button');
  const dropdown = document.querySelector('.dropdown');
  
  if (window.innerWidth <= 768) {
    dropdownButton.addEventListener('click', function(e) {
      e.preventDefault();
      dropdown.classList.toggle('active');
    });
  }
}); 