document.addEventListener('DOMContentLoaded', () => {
  const clickElement = document.querySelector('.clicks');
  let clickMulti = new Decimal(1); // Ensure Decimal is imported

  if (!clickElement) {
    console.error('Click element not found');
    return;
  }

  function incrementClick() {
    let currentClicks = new Decimal(parseFloat(clickElement.innerHTML));
    if (up1bought >= 1) clickMulti = 2;
    if (isNaN(currentClicks)) {
      currentClicks = new Decimal(0);
    }
    clickElement.innerHTML = currentClicks + clickMulti;
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

  const clickButton = document.querySelector('.click-button');
  if (clickButton) {
    clickButton.addEventListener('click', incrementClick);
  } else {
    console.error('Click button not found');
  }

  // Load game state when the game starts
  loadGameState();

  // Autosave the game state every 5 seconds
  setInterval(saveGameState, 5000);
});
