document.addEventListener('DOMContentLoaded', () => {
  const clickElement = document.querySelector('.clicks');
  const clickButton = document.querySelector('.click-button');
  const up1Button = document.querySelector('.upgrade1');
  const up2Button = document.querySelector('.upgrade2');
  const CLICK_STORAGE_KEY = 'clicks';
  const UPGRADE1_STORAGE_KEY = 'up1bought';
  const UPGRADE2_STORAGE_KEY = 'up2bought';
  let clickMulti = 1;
  let up1bought = 0;
  let up2bought = 0;

  if (!clickElement || !clickButton || !up1Button || !up2Button) {
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
      localStorage.setItem(UPGRADE2_STORAGE_KEY, up2bought);
    } catch (e) {
      console.error('Failed to save upgrade state', e);
    }
  }

  function loadUpgradeState() {
    try {
      const savedUp1bought = localStorage.getItem(UPGRADE1_STORAGE_KEY);
      const savedUp2bought = localStorage.getItem(UPGRADE2_STORAGE_KEY);
      if (savedUp1bought !== null) {
        up1bought = parseInt(savedUp1bought, 10);
        if (up1bought >= 1) {
          up1Button.classList.add('bought');
          clickMulti *= 2; // Apply multiplier for upgrade 1
        }
      }
      if (savedUp2bought !== null) {
        up2bought = parseInt(savedUp2bought, 10);
        if (up2bought >= 1) {
          up2Button.classList.add('bought');
          clickMulti *= 2; // Apply multiplier for upgrade 2
        }
      }
    } catch (e) {
      console.error('Failed to load upgrade state', e);
    }
  }

  function incrementClick() {
    let currentClicks = parseFloat(clickElement.innerHTML);
    if (isNaN(currentClicks)) {
      currentClicks = 0;
    }
    clickElement.innerHTML = currentClicks + clickMulti;
    console.log(`Clicks: ${clickElement.innerHTML}`); // Debugging
    saveGameState(); // Save game state after incrementing clicks
    checkUpgradeRequirements(); // Check requirements after incrementing clicks
  }

  function buyUpgrade1() {
    const currentClicks = parseInt(clickElement.innerHTML, 10);
    if (up1bought < 1 && currentClicks >= 75) {
      up1bought += 1;
      clickElement.innerHTML = currentClicks - 75;
      clickMulti *= 2; // Apply multiplier for upgrade 1
      saveUpgradeState();
      saveGameState(); // Save the updated clicks
    }
    if (up1bought >= 1) {
      up1Button.classList.add('bought');
    }
    checkUpgradeRequirements(); // Check requirements after buying upgrade
  }

  function buyUpgrade2() {
    const currentClicks = parseInt(clickElement.innerHTML, 10);
    if (up2bought < 1 && currentClicks >= 300) {
      up2bought += 1;
      clickElement.innerHTML = currentClicks - 300;
      clickMulti *= 2; // Apply multiplier for upgrade 2
      saveUpgradeState();
      saveGameState(); // Save the updated clicks
    }
    if (up2bought >= 1) {
      up2Button.classList.add('bought');
    }
    checkUpgradeRequirements(); // Check requirements after buying upgrade
  }

  function checkUpgradeRequirements() {
    const currentClicks = parseInt(clickElement.innerHTML, 10);
    if (currentClicks >= 75 && up1bought < 1) {
      up1Button.classList.add('requirements-met');
    } else {
      up1Button.classList.remove('requirements-met');
    }
    if (currentClicks >= 300 && up2bought < 1) {
      up2Button.classList.add('requirements-met');
    } else {
      up2Button.classList.remove('requirements-met');
    }
  }

  clickButton.addEventListener('click', incrementClick);
  up1Button.addEventListener('click', buyUpgrade1);
  up2Button.addEventListener('click', buyUpgrade2);

  loadGameState();
  loadUpgradeState();

  setInterval(saveGameState, 5000);
  checkUpgradeRequirements(); // Initial check when the game starts
});
