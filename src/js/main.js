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
  document.getElementById('wonderTitle').textContent = cosmicWonders[currentWonder].title;
  document.getElementById('wonderDescription').textContent = cosmicWonders[currentWonder].description;
  document.querySelector('.wonderCard').style.background = cosmicWonders[currentWonder].gradient;
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