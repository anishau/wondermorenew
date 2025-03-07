const cosmicWonders = [
  {
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