document.addEventListener('DOMContentLoaded', async () => {
  const getElement = (selector) => {
    const element = document.querySelector(selector);
    if (!element) {
      throw new Error(`Element not found: ${selector}`);
    }
    return element;
  };

  const elements = {
    clickElement: getElement('.clicks'),
    clickButton: getElement('.click-button'),
    up1Button: getElement('#upgrade1'),
    up2Button: getElement('#upgrade2'),
    up3Button: getElement('#upgrade3'),
    cpsElement: getElement('.cps'),
    loadingScreen: getElement('#loading-screen')
  };

  const storageKeys = {
    CLICK: 'clicks',
    UPGRADE1: 'up1bought',
    UPGRADE2: 'up2bought',
    UPGRADE3: 'up3bought',
    CPS: 'cps',
    LAST_TIME: 'lastTime'
  };

  const gameState = {
    clickMulti: 1,
    up1Bought: 0,
    up2Bought: 0,
    up3Bought: 0,
    clickCount: 0,
    cpsClicks: 0,
    lastTime: Date.now(),
    cps: 0,
    passiveIncome: 0
  };

  const saveState = (key, value) => {
    try {
      localStorage.setItem(key, value.toString());
    } catch (e) {
      console.error(`Failed to save ${key}`, e);
    }
  };

  const loadState = async (key, defaultValue) => {
    try {
      const value = localStorage.getItem(key);
      return value !== null ? parseFloat(value) : defaultValue;
    } catch (e) {
      console.error(`Failed to load ${key}`, e);
      return defaultValue;
    }
  };

  const updateElementText = (element, value) => {
    element.innerText = value.toString();
  };

  const saveGameState = () => {
  const saveUpgradeState = () => {
  try {
    saveState(storageKeys.UPGRADE1, gameState.up1Bought);
    saveState(storageKeys.UPGRADE2, gameState.up2Bought);
    saveState(storageKeys.UPGRADE3, gameState.up3Bought);
    console.log("Upgrade states saved successfully.");
  } catch (error) {
    console.error("Error saving upgrade states:", error);
  }
};

const loadUpgradeState = async () => {
  try {
    const [up1Bought, up2Bought, up3Bought] = await Promise.all([
      loadState(storageKeys.UPGRADE1, 0),
      loadState(storageKeys.UPGRADE2, 0),
      loadState(storageKeys.UPGRADE3, 0)
    ]);
    gameState.up1Bought = up1Bought;
    gameState.up2Bought = up2Bought;
    gameState.up3Bought = up3Bought;

    if (gameState.up3Bought >= 1) {
      elements.up3Button.classList.add('bought');
      gameState.clickMulti *= 1.75;
      gameState.cps *= 5;
      gameState.passiveIncome *= 5;
    }

    console.log("Upgrade states loaded successfully.");
    return { up1Bought, up2Bought, up3Bought };
  } catch (error) {
    console.error("Error loading upgrade states:", error);
    return { up1Bought: 0, up2Bought: 0, up3Bought: 0 };
  }
};

  const saveUpgradeState = () => {
    saveState(storageKeys.UPGRADE1, gameState.up1Bought);
    saveState(storageKeys.UPGRADE2, gameState.up2Bought);
    saveState(storageKeys.UPGRADE3, gameState.up3Bought);
  };

  const loadUpgradeState = async () => {
    const [up1Bought, up2Bought, up3Bought] = await Promise.all([
      loadState(storageKeys.UPGRADE1, 0),
      loadState(storageKeys.UPGRADE2, 0),
      loadState(storageKeys.UPGRADE3, 0)
    ]);
    return { up1Bought, up2Bought, up3Bought };
  };

  const incrementClick = () => {
    gameState.clickCount += gameState.clickMulti;
    updateElementText(elements.clickElement, gameState.clickCount);
    checkUpgradeRequirements();
    saveGameState();
  };

  const buyUpgrade = (upgradeKey, cost, multiplier, element) => {
    if (gameState[upgradeKey] < 1 && gameState.clickCount >= cost) {
      gameState[upgradeKey] += 1;
      gameState.clickCount -= cost;
      gameState.clickMulti *= multiplier;
      updateElementText(elements.clickElement, gameState.clickCount);
      saveUpgradeState();
      saveGameState();
      element.classList.add('bought');
      checkUpgradeRequirements();
      updateCPS();
    }
  };

  const handlePassiveIncome = () => {
    gameState.clickCount += gameState.passiveIncome;
    updateElementText(elements.clickElement, gameState.clickCount);
    saveGameState();
  };

  const updateCPS = () => {
    const now = Date.now();
    const elapsedSeconds = (now - gameState.lastTime) / 1000;
    const totalClicks = gameState.cpsClicks + gameState.passiveIncome * elapsedSeconds;
    const cpsDisplay = (totalClicks / elapsedSeconds).toFixed(2);
    updateElementText(elements.cpsElement, `CPS: ${cpsDisplay}`);
    gameState.cpsClicks = 0;
    gameState.lastTime = now;
  };

  const checkUpgradeRequirements = () => {
    elements.up1Button.classList.toggle('requirements-met', gameState.clickCount >= 75 && gameState.up1Bought < 1);
    elements.up2Button.classList.toggle('requirements-met', gameState.clickCount >= 300 && gameState.up2Bought < 1);
    elements.up3Button.classList.toggle('requirements-met', gameState.clickCount >= 700 && gameState.up3Bought < 1);
  };

  elements.clickButton.addEventListener('click', incrementClick);
  elements.up1Button.addEventListener('click', () => buyUpgrade('up1Bought', 75, 2, elements.up1Button));
  elements.up2Button.addEventListener('click', () => buyUpgrade('up2Bought', 300, 2, elements.up2Button));
  elements.up3Button.addEventListener('click', () => buyUpgrade('up3Bought', 700, 2, elements.up3Button));

  const initializeGame = async () => {
    try {
      const [{ clickCount, cps, lastTime }, { up1Bought, up2Bought }] = await Promise.all([
        loadGameState(),
        loadUpgradeState()
      ]);
      gameState.clickCount = clickCount;
      gameState.cps = cps;
      gameState.lastTime = lastTime;
      gameState.up1Bought = up1Bought;
      gameState.up2Bought = up2Bought;

      if (gameState.up1Bought >= 1) {
        elements.up1Button.classList.add('bought');
        gameState.clickMulti *= 2;
      }
      if (gameState.up2Bought >= 1) {
        elements.up2Button.classList.add('bought');
        gameState.clickMulti *= 2;
        gameState.cps += 1;
        gameState.passiveIncome += 1;
      }
      if (gameState.up3Bought >= 1) {
        elements.up3Button.classList.add('bought');
        gameState.clickMulti *= 1.75;
        gameState.cps *= 5;
        gameState.passiveIncome *= 5;
      }

      updateElementText(elements.clickElement, gameState.clickCount);
      updateCPS();
      checkUpgradeRequirements();
      console.log("Game initialized successfully");
    } catch (e) {
      console.error("Error during game initialization", e);
    } finally {
      hideLoadingScreen();
    }
  };

  function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    loadingScreen.style.animation = 'fadeOut 1s forwards';
    loadingScreen.addEventListener('animationend', () => {
      loadingScreen.style.display = 'none';
    });
  }

  await initializeGame();

  setInterval(saveGameState, 5000);
  setInterval(updateCPS, 1000);
  setInterval(handlePassiveIncome, 1000);
});
