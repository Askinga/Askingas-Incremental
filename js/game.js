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
    up4Button: getElement('#upgrade4'),
    cpsElement: getElement('.cps'),
    loadingScreen: getElement('#loading-screen')
  };

  const storageKeys = {
    CLICK: 'clicks',
    UPGRADE1: 'up1bought',
    UPGRADE2: 'up2bought',
    UPGRADE3: 'up3bought',
    UPGRADE4: 'up4bought',
    CPS: 'cps',
    LAST_TIME: 'lastTime'
  };

  const gameState = {
    clickMulti: new Decimal(1),
    up1Bought: new Decimal(0),
    up2Bought: new Decimal(0),
    up3Bought: new Decimal(0),
    up4Bought: new Decimal(0),
    clickCount: new Decimal(0),
    cpsClicks: new Decimal(0),
    lastTime: new Decimal(Date.now()),
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

  const loadState = async (key, defaultValue) => {
    try {
      const value = localStorage.getItem(key);
      return value !== null ? new Decimal(value) : new Decimal(defaultValue);
    } catch (e) {
      console.error(`Failed to load ${key}`, e);
      return new Decimal(defaultValue);
    }
  };

  const updateElementText = (element, value) => {
    element.innerText = value.toString();
  };

  const saveUpgradeState = () => {
    saveState(storageKeys.UPGRADE1, gameState.up1Bought);
    saveState(storageKeys.UPGRADE2, gameState.up2Bought);
    saveState(storageKeys.UPGRADE3, gameState.up3Bought);
    saveState(storageKeys.UPGRADE4, gameState.up4Bought);
  };

  const loadUpgradeState = async () => {
    try {
      const [up1Bought, up2Bought, up3Bought, up4Bought] = await Promise.all([
        loadState(storageKeys.UPGRADE1, 0),
        loadState(storageKeys.UPGRADE2, 0),
        loadState(storageKeys.UPGRADE3, 0),
        loadState(storageKeys.UPGRADE4, 0)
      ]);
      gameState.up1Bought = up1Bought;
      gameState.up2Bought = up2Bought;
      gameState.up3Bought = up3Bought;
      gameState.up4Bought = up4Bought;
      return { up1Bought, up2Bought, up3Bought, up4Bought };
    } catch (e) {
      console.error("Error loading upgrade states:", e);
      return { up1Bought: new Decimal(0), up2Bought: new Decimal(0), up3Bought: new Decimal(0), up4Bought: new Decimal(0) };
    }
  };

  const incrementClick = () => {
    gameState.clickCount = gameState.clickCount.add(gameState.clickMulti);
    updateElementText(elements.clickElement, gameState.clickCount);
    checkUpgradeRequirements();
    saveGameState();
  };

  const buyUpgrade = (upgradeKey, cost, multiplier, cpsMulti, element) => {
    if (gameState[upgradeKey].lessThan(1) && gameState.clickCount.gte(cost)) {
      gameState[upgradeKey] = gameState[upgradeKey].add(1);
      gameState.clickCount = gameState.clickCount.sub(cost);
      gameState.clickMulti = gameState.clickMulti.times(multiplier);
      gameState.cps = gameState.cps.times(cpsMulti)
      gameState.passiveIncome = gameState.passiveIncome.times(cpsMulti)
      updateElementText(elements.clickElement, gameState.clickCount);
      saveUpgradeState();
      saveGameState();
      element.classList.add('bought');
      checkUpgradeRequirements();
      updateCPS();
    }
  };

  const handlePassiveIncome = () => {
    gameState.clickCount = gameState.clickCount.add(gameState.passiveIncome);
    updateElementText(elements.clickElement, gameState.clickCount);
    saveGameState();
  };

  const updateCPS = () => {
    const now = new Decimal(Date.now());
    const elapsedSeconds = now.sub(gameState.lastTime).div(1000);
    const totalClicks = gameState.cpsClicks.add(gameState.passiveIncome.times(elapsedSeconds));
    const cpsDisplay = totalClicks.div(elapsedSeconds).toFixed(2);
    updateElementText(elements.cpsElement, `CPS: ${cpsDisplay}`);
    gameState.cpsClicks = new Decimal(0);
    gameState.lastTime = now;
  };

  const checkUpgradeRequirements = () => {
    elements.up1Button.classList.toggle('requirements-met', gameState.clickCount.gte(75) && gameState.up1Bought.lessThan(1));
    elements.up2Button.classList.toggle('requirements-met', gameState.clickCount.gte(300) && gameState.up2Bought.lessThan(1));
    elements.up3Button.classList.toggle('requirements-met', gameState.clickCount.gte(700) && gameState.up3Bought.lessThan(1));
    elements.up4Button.classList.toggle('requirements-met', gameState.clickCount.gte(1500) && gameState.up4Bought.lessThan(1));
  };

  elements.clickButton.addEventListener('click', incrementClick);
  elements.up1Button.addEventListener('click', () => buyUpgrade('up1Bought', new Decimal(75), new Decimal(2), new Decimal(1), elements.up1Button));
  elements.up2Button.addEventListener('click', () => buyUpgrade('up2Bought', new Decimal(300), new Decimal(2), new Decimal(1),elements.up2Button));
  elements.up2Button.addEventListener('click', () => addCPS('up2Bought', new Decimal(1), new Decimal(300)));
  elements.up3Button.addEventListener('click', () => buyUpgrade('up3Bought', new Decimal(700), new Decimal(1.75), new Decimal(5), elements.up3Button));
  elements.up4Button.addEventListener('click', () => buyUpgrade('up4Bought', new Decimal(1500), new Decimal(2.5), new Decimal(3), elements.up4Button));
  

  const saveGameState = () => {
    saveState(storageKeys.CLICK, gameState.clickCount);
    saveState(storageKeys.CPS, gameState.cps);
    saveState(storageKeys.LAST_TIME, gameState.lastTime);
  };

	const addCPS = (upgradeKey, number, cost) => {
   if (gameState[upgradeKey].lessThan(1) && gameState.clickCount.gte(cost)) { 
    gameState.cps = gameState.cps.add(number)
    gameState.passiveIncome = gameState.passiveIncome.add(number)
   }
  };
  
  const loadGameState = async () => {
    try {
      const [clickCount, cps, lastTime] = await Promise.all([
        loadState(storageKeys.CLICK, 0),
        loadState(storageKeys.CPS, 0),
        loadState(storageKeys.LAST_TIME, Date.now())
      ]);
      gameState.clickCount = clickCount;
      gameState.cps = cps;
      gameState.lastTime = lastTime;
      return { clickCount, cps, lastTime };
    } catch (e) {
      console.error("Error loading game state:", e);
      return { clickCount: new Decimal(0), cps: new Decimal(0), lastTime: new Decimal(Date.now()) };
    }
  };

  const initializeGame = async () => {
    try {
      const [{ clickCount, cps, lastTime }, { up1Bought, up2Bought, up3Bought, up4Bought }] = await Promise.all([
        loadGameState(),
        loadUpgradeState()
      ]);
      gameState.clickCount = clickCount;
      gameState.cps = cps;
      gameState.lastTime = lastTime;
      gameState.up1Bought = up1Bought;
      gameState.up2Bought = up2Bought;
      gameState.up3Bought = up3Bought;
      gameState.up4Bought = up4Bought;

      if (gameState.up1Bought.gte(1)) {
        elements.up1Button.classList.add('bought');
        gameState.clickMulti = gameState.clickMulti.times(2);
      }
      if (gameState.up2Bought.gte(1)) {
        elements.up2Button.classList.add('bought');
        gameState.clickMulti = gameState.clickMulti.times(2);
        gameState.cps = gameState.cps.add(1);
        gameState.passiveIncome = gameState.passiveIncome.add(1);
      }
      if (gameState.up3Bought.gte(1)) {
        elements.up3Button.classList.add('bought');
        gameState.clickMulti = gameState.clickMulti.times(1.75);
        gameState.cps = gameState.cps.times(5);
        gameState.passiveIncome = gameState.passiveIncome.times(5);
      }
      if (gameState.up4Bought.gte(1)) {
        elements.up4Button.classList.add('bought');
        gameState.clickMulti = gameState.clickMulti.times(2.5);
        gameState.cps = gameState.cps.times(3);
        gameState.passiveIncome = gameState.passiveIncome.times(3);
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
    if (loadingScreen) {
      loadingScreen.style.animation = 'fadeOut 1s forwards';
      loadingScreen.addEventListener('animationend', () => {
        loadingScreen.style.display = 'none';
      });
    } else {
      console.error('Loading screen element not found.');
    }
  }

  await initializeGame();

  setInterval(saveGameState, 5000);
  setInterval(updateCPS, 1000);
  setInterval(handlePassiveIncome, 1000);
  setInterval(checkUpgradeRequirements, 1000);
});
