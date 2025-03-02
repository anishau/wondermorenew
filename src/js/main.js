const cosmicWonders = [
  {
    title: "Quantum Entanglement",
    description: "Where particles remain connected regardless of distance, dancing in perfect synchronicity across the cosmos.",
    gradient: "linear-gradient(45deg, #00f2fe, #4facfe)"
  },
  {
    title: "Dark Matter",
    description: "The invisible force that binds galaxies together, making up 85% of the universe's mass.",
    gradient: "linear-gradient(45deg, #434343, #000000)"
  },
  {
    title: "Nebulae",
    description: "Cosmic nurseries where stars are born, painting the darkness with brilliant colors.",
    gradient: "linear-gradient(45deg, #7303c0, #ec38bc, #fdeff9)"
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