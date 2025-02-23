document.addEventListener('DOMContentLoaded', () => {
  const elements = {
    clickElement: document.querySelector('.clicks'),
    clickButton: document.querySelector('.click-button'),
    up1Button: document.querySelector('#upgrade1'),
    up2Button: document.querySelector('#upgrade2'),
    cpsElement: document.querySelector('.cps')
  };

  const storageKeys = {
    CLICK_STORAGE_KEY: 'clicks',
    UPGRADE1_STORAGE_KEY: 'up1bought',
    UPGRADE2_STORAGE_KEY: 'up2bought'
  };

  let gameState = {
    clickMulti: 1,
    up1bought: 0,
    up2bought: 0,
    clickCount: 0,
    lastTime: Date.now(),
    cps: 0
  };

  if (Object.values(elements).some(el => !el)) {
    console.error('Required DOM elements not found');
    return;
  }

  function saveGameState() {
    try {
      localStorage.setItem(storageKeys.CLICK_STORAGE_KEY, gameState.clickCount);
    } catch (e) {
      console.error('Failed to save game state', e);
    }
  }

  function loadGameState() {
    try {
      const clicks = localStorage.getItem(storageKeys.CLICK_STORAGE_KEY);
      if (clicks !== null) {
        gameState.clickCount = parseInt(clicks, 10);
        elements.clickElement.innerText = gameState.clickCount;
      }
    } catch (e) {
      console.error('Failed to load game state', e);
    }
  }

  function saveUpgradeState() {
    try {
      localStorage.setItem(storageKeys.UPGRADE1_STORAGE_KEY, gameState.up1bought);
      localStorage.setItem(storageKeys.UPGRADE2_STORAGE_KEY, gameState.up2bought);
    } catch (e) {
      console.error('Failed to save upgrade state', e);
    }
  }

  function loadUpgradeState() {
    try {
      const savedUp1bought = localStorage.getItem(storageKeys.UPGRADE1_STORAGE_KEY);
      const savedUp2bought = localStorage.getItem(storageKeys.UPGRADE2_STORAGE_KEY);
      if (savedUp1bought !== null) {
        gameState.up1bought = parseInt(savedUp1bought, 10);
        if (gameState.up1bought >= 1) {
          elements.up1Button.classList.add('bought');
          gameState.clickMulti *= 2;
        }
      }
      if (savedUp2bought !== null) {
        gameState.up2bought = parseInt(savedUp2bought, 10);
        if (gameState.up2bought >= 1) {
          elements.up2Button.classList.add('bought');
          gameState.clickMulti *= 2;
          gameState.cps += 1;
        }
      }
    } catch (e) {
      console.error('Failed to load upgrade state', e);
    }
  }

  function incrementClick() {
    gameState.clickCount += gameState.clickMulti;
    elements.clickElement.innerText = gameState.clickCount;
    checkUpgradeRequirements();
    saveGameState();
  }

  function buyUpgrade1() {
    if (gameState.up1bought < 1 && gameState.clickCount >= 75) {
      gameState.up1bought += 1;
      gameState.clickCount -= 75;
      gameState.clickMulti *= 2;
      elements.clickElement.innerText = gameState.clickCount;
      saveUpgradeState();
      saveGameState();
      elements.up1Button.classList.add('bought');
    }
    checkUpgradeRequirements();
  }

  function buyUpgrade2() {
    if (gameState.up2bought < 1 && gameState.clickCount >= 300) {
      gameState.up2bought += 1;
      gameState.clickCount -= 300;
      gameState.clickMulti *= 2;
      gameState.cps += 1;
      elements.clickElement.innerText = gameState.clickCount;
      saveUpgradeState();
      saveGameState();
      elements.up2Button.classList.add('bought');
    }
    checkUpgradeRequirements();
  }

  function checkUpgradeRequirements() {
    if (gameState.clickCount >= 75 && gameState.up1bought < 1) {
      elements.up1Button.classList.add('requirements-met');
    } else {
      elements.up1Button.classList.remove('requirements-met');
    }
    if (gameState.clickCount >= 300 && gameState.up2bought < 1) {
      elements.up2Button.classList.add('requirements-met');
    } else {
      elements.up2Button.classList.remove('requirements-met');
    }
  }

  function updateCPS() {
    const now = Date.now();
    const elapsedSeconds = (now - gameState.lastTime) / 1000;
    const cpsDisplay = (gameState.clickCount / elapsedSeconds + gameState.cps).toFixed(2);
    elements.cpsElement.innerText = `CPS: ${cpsDisplay}`;
    gameState.clickCount = 0;
    gameState.lastTime = now;
  }

  elements.clickButton.addEventListener('click', incrementClick);
  elements.up1Button.addEventListener('click', buyUpgrade1);
  elements.up2Button.addEventListener('click', buyUpgrade2);

  loadGameState();
  loadUpgradeState();

  setInterval(saveGameState, 5000);
  setInterval(updateCPS, 1000);
  checkUpgradeRequirements();
});
  
