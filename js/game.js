document.addEventListener('DOMContentLoaded', async () => {
  const getElement = (selector) => {
    const element = document.querySelector(selector);
    if (!element) {
      throw new Error(`Element not found: ${selector}`);
    }
    return element;
  };

  const upgrades = [
    { key: 'up1Bought', baseCost: 75, multiplier: 2, cpsMulti: 1, cpsAdd: 0 },
    { key: 'up2Bought', baseCost: 300, multiplier: 2, cpsMulti: 1, cpsAdd: 1 },
    { key: 'up3Bought', baseCost: 700, multiplier: 1.75, cpsMulti: 5, cpsAdd: 0 },
    { key: 'up4Bought', baseCost: 1500, multiplier: 2.5, cpsMulti: 3, cpsAdd: 0 },
    { key: 'up5Bought', baseCost: 4250, multiplier: 2.25, cpsMulti: 2.75, cpsAdd: 0 },
    { key: 'up6Bought', baseCost: 10000, multiplier: 4, cpsMulti: 5, cpsAdd: 0 },
    { key: 'up7Bought', baseCost: 50000, multiplier: 3.25, cpsMulti: 3, cpsAdd: 0 },
    { key: 'up8Bought', baseCost: 225000, multiplier: 5, cpsMulti: 2.8, cpsAdd: 0 },
    { key: 'up9Bought', baseCost: 1e6, multiplier: 6, cpsMulti: 2.5, cpsAdd: 0 },
    { key: 'up10Bought', baseCost: 6.66e6, multiplier: 6.66, cpsMulti: 6.66, cpsAdd: 0 },
    { key: 'up11Bought', baseCost: 3.75e7, multiplier: 5, cpsMulti: 10, cpsAdd: 0 },
    { key: 'up12Bought', baseCost: 2.00e8, multiplier: 10, cpsMulti: 5, cpsAdd: 0 },
    { key: 'up13Bought', baseCost: 1, multiplier: 5, cpsMulti: 0, cpsAdd: 0, isPP: true },
    { key: 'up14Bought', baseCost: 2, multiplier: 3, cpsMulti: 0, cpsAdd: 0, isPP: true },
  ];

  const elements = {
    clickElement: getElement('.clicks'),
    PPElement: getElement('.prestige'),
    prestigeElement: getElement('.prestigepoints'),
    clickButton: getElement('.click-button'),
    prestigeButton: getElement('.prestige-button'),
    buttons: upgrades.map((_, index) => getElement(`#upgrade${index + 1}`)),
    cpsElement: getElement('.cps'),
    loadingScreen: getElement('#loading-screen'),
  };

  const storageKeys = {
    CLICK: 'clicks',
    PP: 'PPts',
    CPS: 'cps',
    LAST_TIME: 'lastTime',
  };

  upgrades.forEach((upgrade) => {
    storageKeys[upgrade.key] = upgrade.key;
  });

  const gameState = {
    clickMulti: new Decimal(1),
    prestigeClickMulti: new Decimal(1),
    PPts: new Decimal(0),
    clickCount: new Decimal(0),
    cps: new Decimal(0),
    passiveIncome: new Decimal(0),
    lastTime: new Decimal(Date.now()),
  };

  upgrades.forEach((upgrade) => {
    gameState[upgrade.key] = new Decimal(0);
  });

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
      return value !== null && !isNaN(value) ? new Decimal(value) : new Decimal(defaultValue);
    } catch (e) {
      console.error(`Failed to load ${key}`, e);
      return new Decimal(defaultValue);
    }
  };

  const saveGameState = () => {
    Object.keys(storageKeys).forEach((key) => saveState(storageKeys[key], gameState[key]));
  };

  const loadGameState = async () => {
    const promises = Object.keys(storageKeys).map((key) => loadState(storageKeys[key], 0));
    const results = await Promise.all(promises);
    Object.keys(storageKeys).forEach((key, index) => {
      gameState[key] = results[index];
    });
  };

  const updateElementText = (element, value) => {
    element.innerText = value.toString();
  };

  const checkUpgradeRequirements = () => {
    upgrades.forEach((upgrade, index) => {
      const button = elements.buttons[index];
      const cost = upgrade.isPP ? gameState.PPts : gameState.clickCount;
      button.classList.toggle('requirements-met', cost.gte(upgrade.baseCost) && gameState[upgrade.key].lessThan(1));
    });
  };

  const buyUpgrade = (upgrade, element) => {
    const currency = upgrade.isPP ? gameState.PPts : gameState.clickCount;
    const cost = new Decimal(upgrade.baseCost);

    if (currency.gte(cost) && gameState[upgrade.key].lessThan(1)) {
      gameState[upgrade.key] = gameState[upgrade.key].add(1);
      if (upgrade.isPP) {
        gameState.PPts = gameState.PPts.sub(cost);
        gameState.prestigeClickMulti = gameState.prestigeClickMulti.times(upgrade.multiplier);
      } else {
        gameState.clickCount = gameState.clickCount.sub(cost);
        gameState.clickMulti = gameState.clickMulti.times(upgrade.multiplier);
        gameState.cps = gameState.cps.add(upgrade.cpsAdd).times(upgrade.cpsMulti);
        gameState.passiveIncome = gameState.passiveIncome.add(upgrade.cpsAdd).times(upgrade.cpsMulti);
      }
      element.classList.add('bought');
      saveGameState();
      checkUpgradeRequirements();
    }
  };

  const initializeGame = async () => {
    await loadGameState();
    upgrades.forEach((upgrade, index) => {
      const element = elements.buttons[index];
      element.addEventListener('click', () => buyUpgrade(upgrade, element));
    });
    checkUpgradeRequirements();
  };

  // Periodic Updates
  setInterval(saveGameState, 5000);
  setInterval(checkUpgradeRequirements, 1000);

  await initializeGame();
});
