const cosmicWonders = [
  {
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