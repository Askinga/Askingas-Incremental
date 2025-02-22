import Decimal from 'decimal.js';

document.addEventListener('DOMContentLoaded', () => {
  const clickElement = document.querySelector('.clicks');
  const clickButton = document.querySelector('.click-button');
  let clickMulti = new Decimal(1);
  let up1bought = 0;

  if (!clickElement) {
    console.error('Click element not found');
    return;
  }

  if (!clickButton) {
    console.error('Click button not found');
    return;
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

  function incrementClick() {
    let currentClicks = parseFloat(clickElement.innerHTML);
    if (up1bought >= 1) clickMulti = 2;
    if (isNaN(currentClicks)) {
      currentClicks = 1;
    }
    clickElement.innerHTML = currentClicks + clickMulti;
  }

  function buyUpgrade1() {
    if (up1bought < 1 && parseInt(clickElement.innerHTML) >= 75) {
      up1bought += 1;
      clickElement.innerHTML = parseInt(clickElement.innerHTML) - 75;
      saveUpgradeState();
    }
  }

  clickButton.addEventListener('click', incrementClick);

  // Load game state and upgrade state when the game starts
  loadGameState();
  loadUpgradeState();

  // Autosave the game state every 5 seconds
  setInterval(saveGameState, 5000);
});
