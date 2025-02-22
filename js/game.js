import Decimal from 'decimal.js';

document.addEventListener('DOMContentLoaded', () => {
  const clickElement = document.querySelector('.clicks');
  const clickButton = document.querySelector('.click-button');
  const CLICK_STORAGE_KEY = 'clicks';
  const UPGRADE1_STORAGE_KEY = 'up1bought';
  let clickMulti = 1;
  let up1bought = 0;

  if (!clickElement || !clickButton) {
    console.error('Required DOM elements not found');
    return;
  }

  function saveGameState() {
    try {
      const clicks = clickElement.innerHTML;
      localStorage.setItem(CLICK_STORAGE_KEY, clicks);
    } catch (e) {
      console.error('Failed to save game state', e);
    }
  }

  function loadGameState() {
    try {
      const clicks = localStorage.getItem(CLICK_STORAGE_KEY);
      if (clicks !== null) {
        clickElement.innerHTML = clicks;
      }
    } catch (e) {
      console.error('Failed to load game state', e);
    }
  }

  function saveUpgradeState() {
    try {
      localStorage.setItem(UPGRADE1_STORAGE_KEY, up1bought);
    } catch (e) {
      console.error('Failed to save upgrade state', e);
    }
  }

  function loadUpgradeState() {
    try {
      const savedUp1bought = localStorage.getItem(UPGRADE1_STORAGE_KEY);
      if (savedUp1bought !== null) {
        up1bought = parseInt(savedUp1bought, 10);
      }
    } catch (e) {
      console.error('Failed to load upgrade state', e);
    }
  }

  function incrementClick() {
    let currentClicks = parseFloat(clickElement.innerHTML);
    if (isNaN(currentClicks)) {
      currentClicks = 1;
    }
    if (up1bought >= 1) clickMulti = 2;
    clickElement.innerHTML = currentClicks + clickMulti;
  }

  function buyUpgrade1() {
    const currentClicks = parseInt(clickElement.innerHTML, 10);
    if (up1bought < 1 && currentClicks >= 75) {
      up1bought += 1;
      clickElement.innerHTML = currentClicks - 75;
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
