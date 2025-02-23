document.addEventListener('DOMContentLoaded', () => {
  const elements = {
    clickElement: document.querySelector('.clicks'),
    clickButton: document.querySelector('.click-button'),
    up1Button: document.querySelector('#upgrade1'),
    up2Button: document.querySelector('#upgrade2'),
    cpsElement: document.querySelector('.cps'),
    loadingScreen: document.getElementById('loading-screen')
  };

  const storageKeys = {
    CLICK_STORAGE_KEY: 'clicks',
    UPGRADE1_STORAGE_KEY: 'up1bought',
    UPGRADE2_STORAGE_KEY: 'up2bought',
    CPS_STORAGE_KEY: 'cps',
    LAST_TIME_STORAGE_KEY: 'lastTime'
  };

  let gameState = {
    clickMulti: new Decimal(1),
    up1bought: 0,
    up2bought: 0,
    clickCount: new Decimal(0),
    cpsClicks: new Decimal(0),
    lastTime: Date.now(),
    cps: new Decimal(0),
    passiveIncome: new Decimal(0)
  };

  function saveGameState() {
    try {
      localStorage.setItem(storageKeys.CLICK_STORAGE_KEY, gameState.clickCount.toString());
      localStorage.setItem(storageKeys.CPS_STORAGE_KEY, gameState.cps.toString());
      localStorage.setItem(storageKeys.LAST_TIME_STORAGE_KEY, gameState.lastTime.toString());
    } catch (e) {
      console.error('Failed to save game state', e);
    }
  }

  function loadGameState() {
    try {
      const clicks = localStorage.getItem(storageKeys.CLICK_STORAGE_KEY);
      const cps = localStorage.getItem(storageKeys.CPS_STORAGE_KEY);
      const lastTime = localStorage.getItem(storageKeys.LAST_TIME_STORAGE_KEY);
      if (clicks !== null) {
        gameState.clickCount = new Decimal(clicks);
        elements.clickElement.innerText = gameState.clickCount.toString();
      }
      if (cps !== null) {
        gameState.cps = new Decimal(cps);
      }
      if (lastTime !== null) {
        gameState.lastTime = new Decimal(lastTime);
      }
    } catch (e) {
      console.error('Failed to load game state', e);
    }
  }

  function saveUpgradeState() {
    try {
      localStorage.setItem(storageKeys.UPGRADE1_STORAGE_KEY, gameState.up1bought.toString());
      localStorage.setItem(storageKeys.UPGRADE2_STORAGE_KEY, gameState.up2bought.toString());
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
          gameState.clickMulti = gameState.clickMulti.times(2);
        }
      }
      if (savedUp2bought !== null) {
        gameState.up2bought = parseInt(savedUp2bought, 10);
        if (gameState.up2bought >= 1) {
          elements.up2Button.classList.add('bought');
          gameState.clickMulti = gameState.clickMulti.times(2);
          gameState.cps = gameState.cps.plus(1);
          gameState.passiveIncome = gameState.passiveIncome.plus(1); // Increment passive income
        }
      }
    } catch (e) {
      console.error('Failed to load upgrade state', e);
    }
  }

  function incrementClick() {
    gameState.clickCount = gameState.clickCount.plus(gameState.clickMulti);
    elements.clickElement.innerText = gameState.clickCount.toString();
    checkUpgradeRequirements();
    saveGameState();
  }

  function buyUpgrade1() {
    if (gameState.up1bought < 1 && gameState.clickCount.greaterThanOrEqualTo(75)) {
      gameState.up1bought += 1;
      gameState.clickCount = gameState.clickCount.minus(75);
      gameState.clickMulti = gameState.clickMulti.times(2);
      elements.clickElement.innerText = gameState.clickCount.toString();
      saveUpgradeState();
      saveGameState();
      elements.up1Button.classList.add('bought');
    }
    checkUpgradeRequirements();
  }

  function buyUpgrade2() {
    if (gameState.up2bought < 1 && gameState.clickCount.greaterThanOrEqualTo(300)) {
      gameState.up2bought += 1;
      gameState.clickCount = gameState.clickCount.minus(300);
      gameState.clickMulti = gameState.clickMulti.times(2);
      gameState.cps = gameState.cps.plus(1);
      gameState.passiveIncome = gameState.passiveIncome.plus(1);
      elements.clickElement.innerText = gameState.clickCount.toString();
      saveUpgradeState();
      saveGameState();
      elements.up2Button.classList.add('bought');
    }
    checkUpgradeRequirements();
  }

  function handlePassiveIncome() {
    gameState.clickCount = gameState.clickCount.plus(gameState.passiveIncome);
    elements.clickElement.innerText = gameState.clickCount.toString();
    saveGameState();
  }

  function updateCPS() {
    const now = Date.now();
    const elapsedSeconds = new Decimal((now - gameState.lastTime) / 1000);
    const totalClicks = gameState.cpsClicks.plus(gameState.passiveIncome.times(elapsedSeconds));
    const cpsDisplay = totalClicks.div(elapsedSeconds).toFixed(2);
    elements.cpsElement.innerText = `CPS: ${cpsDisplay}`;
    gameState.cpsClicks = new Decimal(0);
    gameState.lastTime = now;
  }

  function checkUpgradeRequirements() {
    if (gameState.clickCount.greaterThanOrEqualTo(75) && gameState.up1bought < 1) {
      elements.up1Button.classList.add('requirements-met');
    } else {
      elements.up1Button.classList.remove('requirements-met');
    }
    if (gameState.clickCount.greaterThanOrEqualTo(300) && gameState.up2bought < 1) {
      elements.up2Button.classList.add('requirements-met');
    } else {
      elements.up2Button.classList.remove('requirements-met');
    }
  }

  elements.clickButton.addEventListener('click', incrementClick);
  elements.up1Button.addEventListener('click', buyUpgrade1);
  elements.up2Button.addEventListener('click', buyUpgrade2);

  loadGameState();
  loadUpgradeState();

  setInterval(saveGameState, 5000);
  setInterval(updateCPS, 1000);
  setInterval(handlePassiveIncome, 1000); // Handle passive income every second
  updateCPS();
  checkUpgradeRequirements();

  // Hide the loading screen once everything is loaded
  setTimeout(() => {
    elements.loadingScreen.style.display = 'none';
  }, 1000); // Adding a delay to ensure all elements are loaded
});
