document.addEventListener('DOMContentLoaded', () => {
  const clickElement = document.querySelector('.clicks');

  if (!clickElement) {
    console.error('Click element not found');
    return;
  }

  function incrementClick() {
  let currentClicks = parseFloat(clickElement.innerHTML);
  if (isNaN(currentClicks)) {
    currentClicks = 0;
  }
  clickElement.innerHTML = currentClicks + 1;
  }

  function saveGameState() {
  try {
    const clicks = clickElement.innerHTML;
    localStorage.setItem('clicks', clicks);
  } catch (e) {
    console.error('Failed to save game state', e);
  }
}


  function loadGameState() {
  try {
    const clicks = localStorage.getItem('clicks');
    if (clicks !== null) {
      clickElement.innerHTML = clicks;
    }
  } catch (e) {
    console.error('Failed to load game state', e);
  }
}

  

  document.querySelector('.click-button').addEventListener('click', incrementClick);

  // Load game state when the game starts
  loadGameState();

  // Autosave the game state every 5 seconds
  setInterval(saveGameState, 5000);
});
