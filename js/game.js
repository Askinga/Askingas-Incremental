document.addEventListener('DOMContentLoaded', () => {
  const clickElement = document.querySelector('.clicks');
  let clickMulti = 1; // Ensure Decimal is imported
  let up1bought = 0; // Move this line above its usage

  if (!clickElement) {
    console.error('Click element not found');
    return;
  }

  function incrementClick() {
  let currentClicks = parseFloat(clickElement.innerHTML);
  if (up1bought >= 1) clickMulti = 2;
  if (isNaN(currentClicks)) {
    currentClicks = 1;
  }
  clickElement.innerHTML = currentClick + clickMulti; // Typo: should be currentClicks
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

  function saveUpgradeState() {
    try {
      localStorage.setItem('up1bought', up1bought);
    } catch (e) {
      console.error('Failed to save upgrade state', e);
    }
  }

  function loadUpgradeState() {
    try {
      const savedUp1bought = localStorage.getItem('up1bought');
      if (savedUp1bought !== null) {
        up1bought = parseInt(savedUp1bought);
      }
    } catch (e) {
      console.error('Failed to load upgrade state', e);
    }
  }

  function buyUpgrade1() {
  if (up1bought < 1 && parseInt(clickElement.innerHTML) >= 75) {
    up1bought += 1;
    clickElement.innerHTML = parseInt(clickElement.innerHTML) - 75;
    saveUpgradeState();
  }
  }
  // Call loadUpgradeState when the game starts
  loadUpgradeState();
});
