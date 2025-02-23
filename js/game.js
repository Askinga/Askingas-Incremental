document.addEventListener('DOMContentLoaded', () => {
  const clickElement = document.querySelector('.clicks');
  const clickButton = document.querySelector('.click-button');
  const upgradeButton = document.querySelector('.upgrade');
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
        if (up1bought >= 1) {
          upgradeButton.classList.add('bought');
        }
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
    checkUpgradeRequirements(); // Check requirements after incrementing clicks
  }

  function buyUpgrade1() {
    const currentClicks = parseInt(clickElement.innerHTML, 10);
    if (up1bought < 1 && currentClicks >= 75) {
      up1bought += 1;
      clickElement.innerHTML = currentClicks - 75;
      saveUpgradeState();
    }
    if (up1bought >= 1) {
      upgradeButton.classList.add('bought');
    }
    checkUpgradeRequirements(); // Check requirements after buying upgrade
  }

  function checkUpgradeRequirements() {
    const currentClicks = parseInt(clickElement.innerHTML, 10);
    if (currentClicks >= 75 && up1bought < 1) {
      upgradeButton.classList.add('requirements-met');
    } else {
      upgradeButton.classList.remove('requirements-met');
    }
  }

  clickButton.addEventListener('click', incrementClick);
  upgradeButton.addEventListener('click', buyUpgrade1);

  loadGameState();
  loadUpgradeState();

  setInterval(saveGameState, 5000);
  checkUpgradeRequirements(); // Initial check when the game starts
});
