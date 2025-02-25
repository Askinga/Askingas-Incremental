import Decimal from 'decimal.js';

document.addEventListener('DOMContentLoaded', () => {
  const getElement = (selector) => {
    const element = document.querySelector(selector);
    if (!element) {
      throw new Error(`Element not found: ${selector}`);
    }
    return element;
  };

  try {
    const elements = {
      clickElement: getElement('.clicks'),
      clickButton: getElement('.click-button'),
      up1Button: getElement('#upgrade1'),
      up2Button: getElement('#upgrade2'),
      cpsElement: getElement('.cps'),
      loadingScreen: getElement('#loading-screen')
    };

    const storageKeys = {
      CLICK: 'clicks',
      UPGRADE1: 'up1bought',
      UPGRADE2: 'up2bought',
      CPS: 'cps',
      LAST_TIME: 'lastTime'
    };

    const gameState = {
      clickMulti: new Decimal(1),
      up1Bought: 0,
      up2Bought: 0,
      clickCount: new Decimal(0),
      cpsClicks: new Decimal(0),
      lastTime: Date.now(),
      cps: new Decimal(0),
      passiveIncome: new Decimal(0)
    };

    const saveState = (key, value) => {
      try {
        localStorage.setItem(key, value.toString());
      } catch (e) {
        console.error(`Failed to save ${key}`, e);
      }
    };

    const loadState = (key, defaultValue) => {
      try {
        const value = localStorage.getItem(key);
        return value !== null ? new Decimal(value) : defaultValue;
      } catch (e) {
        console.error(`Failed to load ${key}`, e);
        return defaultValue;
      }
    };

    const updateElementText = (element, value) => {
      element.innerText = value.toString();
    };

    const saveGameState = () => {
      saveState(storageKeys.CLICK, gameState.clickCount);
      saveState(storageKeys.CPS, gameState.cps);
      saveState(storageKeys.LAST_TIME, gameState.lastTime);
    };

    const loadGameState = () => {
      gameState.clickCount = loadState(storageKeys.CLICK, new Decimal(0));
      gameState.cps = loadState(storageKeys.CPS, new Decimal(0));
      gameState.lastTime = loadState(storageKeys.LAST_TIME, Date.now());
      updateElementText(elements.clickElement, gameState.clickCount);
    };

    const saveUpgradeState = () => {
      saveState(storageKeys.UPGRADE1, gameState.up1Bought);
      saveState(storageKeys.UPGRADE2, gameState.up2Bought);
    };

    const loadUpgradeState = () => {
      gameState.up1Bought = loadState(storageKeys.UPGRADE1, 0).toNumber();
      gameState.up2Bought = loadState(storageKeys.UPGRADE2, 0).toNumber();
      if (gameState.up1Bought >= 1) {
        elements.up1Button.classList.add('bought');
        gameState.clickMulti = gameState.clickMulti.times(2);
      }
      if (gameState.up2Bought >= 1) {
        elements.up2Button.classList.add('bought');
        gameState.clickMulti = gameState.clickMulti.times(2);
        gameState.cps = gameState.cps.plus(1);
        gameState.passiveIncome = gameState.passiveIncome.plus(1);
      }
    };

    const incrementClick = () => {
      gameState.clickCount = gameState.clickCount.plus(gameState.clickMulti);
      updateElementText(elements.clickElement, gameState.clickCount);
      checkUpgradeRequirements();
      saveGameState();
    };

    const buyUpgrade = (upgradeKey, cost, multiplier, element) => {
      if (gameState[upgradeKey] < 1 && gameState.clickCount.greaterThanOrEqualTo(cost)) {
        gameState[upgradeKey] += 1;
        gameState.clickCount = gameState.clickCount.minus(cost);
        gameState.clickMulti = gameState.clickMulti.times(multiplier);
        updateElementText(elements.clickElement, gameState.clickCount);
        saveUpgradeState();
        saveGameState();
        element.classList.add('bought');
        checkUpgradeRequirements();
      }
    };

    const handlePassiveIncome = () => {
      gameState.clickCount = gameState.clickCount.plus(gameState.passiveIncome);
      updateElementText(elements.clickElement, gameState.clickCount);
      saveGameState();
    };

    const updateCPS = () => {
      const now = Date.now();
      const elapsedSeconds = new Decimal((now - gameState.lastTime) / 1000);
      const totalClicks = gameState.cpsClicks.plus(gameState.passiveIncome.times(elapsedSeconds));
      const cpsDisplay = totalClicks.div(elapsedSeconds).toFixed(2);
      updateElementText(elements.cpsElement, `CPS: ${cpsDisplay}`);
      gameState.cpsClicks = new Decimal(0);
      gameState.lastTime = now;
    };

    const checkUpgradeRequirements = () => {
      elements.up1Button.classList.toggle('requirements-met', gameState.clickCount.greaterThanOrEqualTo(75) && gameState.up1Bought < 1);
      elements.up2Button.classList.toggle('requirements-met', gameState.clickCount.greaterThanOrEqualTo(300) && gameState.up2Bought < 1);
    };

    elements.clickButton.addEventListener('click', incrementClick);
    elements.up1Button.addEventListener('click', () => buyUpgrade('up1Bought', 75, 2, elements.up1Button));
    elements.up2Button.addEventListener('click', () => buyUpgrade('up2Bought', 300, 2, elements.up2Button));

    const initializeGame = () => {
      try {
        loadGameState();
        loadUpgradeState();
        updateCPS();
        checkUpgradeRequirements();
        elements.loadingScreen.style.display = 'none';
        console.log("Game initialized successfully");
      } catch (e) {
        console.error("Error during game initialization", e);
      }
    };

    initializeGame();
    setInterval(saveGameState, 5000);
    setInterval(updateCPS, 1000);
    setInterval(handlePassiveIncome, 1000);
  } catch (e) {
    console.error("Initialization error:", e);
  }
});
