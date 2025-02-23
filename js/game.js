document.addEventListener('DOMContentLoaded', () => {
  const clickElement = document.querySelector('.clicks');
  const clickButton = document.querySelector('.click-button');
  const up1Button = document.querySelector('#upgrade1');
  const up2Button = document.querySelector('#upgrade2');
  const cpsElement = document.querySelector('.cps');
  const CLICK_STORAGE_KEY = 'clicks';
  const UPGRADE1_STORAGE_KEY = 'up1bought';
  const UPGRADE2_STORAGE_KEY = 'up2bought';
  let clickMulti = 1;
  let up1bought = 0;
  let up2bought = 0;
  let clickCount = 0;
  let lastTime = Date.now();
  let cps = 0;

  if (!clickElement || !clickButton || !up1Button || !up2Button || !cpsElement) {
    console.error('Required DOM elements not found');
    return;
  }

  function saveGameState() {
    try {
      const clicks = clickElement.innerText;
      localStorage.setItem(CLICK_STORAGE_KEY, clicks);
    } catch (e) {
      console.error('Failed to save game state', e);
    }
  }

  function loadGameState() {
    try {
      const clicks = localStorage.getItem(CLICK_STORAGE_KEY);
      if (clicks !== null) {
        clickElement.innerText = clicks;
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
          clickMulti *= 2;
        }
      }
      if (savedUp2bought !== null) {
        up2bought = parseInt(savedUp2bought, 10);
        if (up2bought >= 1) {
          up2Button.classList.add('bought');
          clickMulti *= 2;
          cps += 1;
        }
      }
    } catch (e) {
      console.error('Failed to load upgrade state', e);
    }
  }

  function incrementClick() {
    let currentClicks = parseInt(clickElement.innerText, 10);
    if (isNaN(currentClicks)) {
      currentClicks = 0;
    }
    currentClicks += clickMulti;
    clickElement.innerText = currentClicks.toFixed(0);
    clickCount++;
    checkUpgradeRequirements();
    saveGameState();
  }

  function buyUpgrade1() {
    const currentClicks = parseInt(clickElement.innerText, 10);
    if (up1bought < 1 && currentClicks >= 75) {
      up1bought += 1;
      clickElement.innerText = currentClicks - 75;
      clickMulti *= 2;
      saveUpgradeState();
      saveGameState();
    }
    if (up1bought >= 1) {
      up1Button.classList.add('bought');
    }
    checkUpgradeRequirements();
  }

  function buyUpgrade2() {
    const currentClicks = parseInt(clickElement.innerText, 10);
    if (up2bought < 1 && currentClicks >= 300) {
      up2bought += 1;
      clickElement.innerText = currentClicks - 300;
      clickMulti *= 2;
      cps += 1;
      saveUpgradeState();
      saveGameState();
    }
    if (up2bought >= 1) {
      up2Button.classList.add('bought');
    }
    checkUpgradeRequirements();
  }

  function checkUpgradeRequirements() {
    const currentClicks = parseInt(clickElement.innerText, 10);
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

  function updateCPS() {
    const now = Date.now();
    const elapsedSeconds = (now - lastTime) / 1000;
    const cpsDisplay = (clickCount / elapsedSeconds + cps).toFixed(2);
    cpsElement.innerText = `CPS: ${cpsDisplay}`;
    clickCount = 0;
    lastTime = now;
  }

  clickButton.addEventListener('click', incrementClick);
  up1Button.addEventListener('click', buyUpgrade1);
  up2Button.addEventListener('click', buyUpgrade2);

  loadGameState();
  loadUpgradeState();

  setInterval(saveGameState, 5000);
  setInterval(updateCPS, 1000);
  checkUpgradeRequirements();
});
