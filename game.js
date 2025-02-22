document.addEventListener('DOMContentLoaded', () => {
  const clickElement = document.querySelector('.clicks');

  if (!clickElement) {
    console.error('Click element not found');
    return;
  }

  function incrementClick() {
    clickElement.innerHTML = parseFloat(clickElement.innerHTML) + 1;
  }

  function saveGameState() {
    const clicks = clickElement.innerHTML;
    localStorage.setItem('clicks', clicks);
  }

  function loadGameState() {
    const clicks = localStorage.getItem('clicks');
    if (clicks !== null) {
      clickElement.innerHTML = clicks;
    }
  }

  document.querySelector('.click-button').addEventListener('click', incrementClick);

  // Load game state when the game starts
  loadGameState();

  // Autosave the game state every 5 seconds
  setInterval(saveGameState, 5000);
});
