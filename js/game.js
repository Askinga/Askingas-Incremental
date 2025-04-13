document.addEventListener('DOMContentLoaded', async () => {
  const getElement = (selector) => {
    const element = document.querySelector(selector);
    if (!element) {
      throw new Error(`Element not found: ${selector}`);
    }
    return element;
  };

  const mainUpgrades = [
    { id: 1, description: 'x2 Clicks', cost: new Decimal(75), multiplier: 2, cpsAdd: 0 },
    { id: 2, description: 'x2 Clicks and 1 Click per Second', cost: new Decimal(300), multiplier: 2, cpsAdd: 1 },
    { id: 3, description: 'x1.75 Clicks and +5 Clicks per Second', cost: new Decimal(700), multiplier: 1.75, cpsAdd: 5 },
    { id: 4, description: 'x2.5 Clicks and +3 Clicks per Second', cost: new Decimal(1500), multiplier: 2.5, cpsAdd: 3},
    // Add other upgrades here...
    { id: 5, description: 'x2.25 Clicks and +15 Click per Second', cost: new Decimal(4250), multiplier: 1.75, cpsAdd: 15},
    { id: 6, description: 'x4 Clicks and +50 Clicks per Second', cost: new Decimal(10000), multiplier: 4, cpsAdd: 50 },
    { id: 7, description: 'x3.25 Clicks and +150 Clicks per Second', cost: new Decimal(50000), multiplier: 3.25, cpsAdd: 150 },
    { id: 8, description: 'x5 Clicks and +300 Click per Second', cost: new Decimal(225000), multiplier: 5, cpsAdd: 300 },
    { id: 9, description: 'x6 Clicks and +750 Click per Second', cost: new Decimal("1e6"), multiplier: 6, cpsAdd: 750 },
    { id: 10, description: 'x6.66 Clicks and +5000 Clicks per Second', cost: new Decimal("6.66e6"), multiplier: 6.66, cpsAdd: 5000 },
    { id: 11, description: 'x5 Clicks and +50,000 Click per Second', cost: new Decimal("3.75e7"), multiplier: 5, cpsAdd: 50000 },
    { id: 12, description: 'x10 Clicks and +1,000,000 Clicks per Second', cost: new Decimal("2e8"), multiplier: 10, cpsAdd: 1000000 },
    // Add other upgrades here...
  ];

  const prestigeUpgrades = [
    { id: 13, description: 'x5 Clicks', cost: new Decimal(1), multiplier: 5, isPP: true },
    { id: 14, description: 'x3 Clicks', cost: new Decimal(2), multiplier: 3, isPP: true },
    { id: 15, description: 'x10 Clicks', cost: new Decimal(5), multiplier: 10, isPP: true },
  ];

  const renderUpgrades = (containerId, upgrades) => {
    const container = document.getElementById(containerId);
    container.replaceChildren();
    upgrades.forEach((upgrade) => {
      const button = document.createElement('button');
      button.id = `upgrade${upgrade.id}`;
      button.className = `up${upgrade.id}`;
      button.textContent = `Upgrade ${upgrade.id}: ${upgrade.description}. Cost: ${format(upgrade.cost)} ${
        upgrade.isPP ? 'PP' : 'Clicks'
      }`;
      container.appendChild(button);
    });
  };

  // Rendering upgrades
  renderUpgrades('main-upgrades', mainUpgrades);
  renderUpgrades('prestige-upgrades', prestigeUpgrades);

  const elements = {
    clickElement: getElement('.clicks'),
    PPElement: getElement('.prestige'),
    prestigeElement: getElement('.prestigepoints'),
    clickButton: getElement('.click-button'),
    prestigeButton: getElement('.prestige-button'),
    buttons: mainUpgrades.concat(prestigeUpgrades).map((upgrade) => getElement(`#upgrade${upgrade.id}`)),
    cpsElement: getElement('.cps'),
  };

  const STORAGE_KEYS = {
    CLICK: 'clicks',
    PP: 'PPts',
    CPS: 'cps',
    LAST_TIME: 'lastTime',
    ...Object.fromEntries([...mainUpgrades, ...prestigeUpgrades].map((u) => [`upgrade${u.id}`, `upgrade${u.id}`])),
  };

  const gameState = {
    clickMulti: new Decimal(1),
    prestigeClickMulti: new Decimal(1),
    PPts: new Decimal(0),
    clickCount: new Decimal(0),
    cps: new Decimal(0),
    passiveIncome: new Decimal(0),
    lastTime: new Decimal(Date.now()),
    ...Object.fromEntries([...mainUpgrades, ...prestigeUpgrades].map((u) => [`upgrade${u.id}`, new Decimal(0)])),
  };

  const saveState = (key, value) => {
    try {
      localStorage.setItem(key, value.toString());
    } catch (e) {
      console.error(`Failed to save ${key}:`, e.message);
    }
  };

  const loadState = async (key, defaultValue) => {
    try {
      const value = localStorage.getItem(key);
      return value !== null && !isNaN(Number(value)) ? new Decimal(value) : new Decimal(defaultValue);
    } catch (e) {
      console.error(`Failed to load ${key}:`, e.message);
      return new Decimal(defaultValue);
    }
  };

  const saveGameState = () => {
    Object.entries(STORAGE_KEYS).forEach(([key, storageKey]) => saveState(storageKey, gameState[key]));
  };

  const loadGameState = async () => {
    const promises = Object.entries(STORAGE_KEYS).map(([key, storageKey]) => loadState(storageKey, 0));
    const results = await Promise.all(promises);
    Object.keys(STORAGE_KEYS).forEach((key, i) => {
      gameState[key] = results[i];
    });
  };

  const checkUpgradeRequirements = () => {
    mainUpgrades.concat(prestigeUpgrades).forEach((upgrade, index) => {
      const button = elements.buttons[index];
      const cost = upgrade.isPP ? gameState.PPts : gameState.clickCount;
      const meetsRequirements = cost.gte(upgrade.cost) && gameState[`upgrade${upgrade.id}`].lessThan(1);
      button.classList.toggle('requirements-met', meetsRequirements);
    });
  };

  const buyUpgrade = (upgrade, element) => {
    const currency = upgrade.isPP ? gameState.PPts : gameState.clickCount;
    const cost = new Decimal(upgrade.cost);

    if (currency.gte(cost) && gameState[`upgrade${upgrade.id}`].lessThan(1)) {
      gameState[`upgrade${upgrade.id}`] = gameState[`upgrade${upgrade.id}`].add(1);
      if (upgrade.isPP) {
        gameState.PPts = gameState.PPts.sub(cost);
        gameState.prestigeClickMulti = gameState.prestigeClickMulti.times(upgrade.multiplier);
      } else {
        gameState.clickCount = gameState.clickCount.sub(cost);
        gameState.clickMulti = gameState.clickMulti.times(upgrade.multiplier);
        gameState.cps = gameState.cps.add(upgrade.cpsAdd || 0);
      }
      element.classList.add('bought');
      saveGameState();
      checkUpgradeRequirements();
    }
  };

  const initializeGame = async () => {
    await loadGameState();
    mainUpgrades.concat(prestigeUpgrades).forEach((upgrade, index) => {
      const element = elements.buttons[index];
      element.addEventListener('click', () => buyUpgrade(upgrade, element));
    });
    checkUpgradeRequirements();
  };

  // Periodic Updates
  const AUTO_SAVE_INTERVAL = 5000; // 5 seconds
  const UPGRADE_CHECK_INTERVAL = 1000; // 1 second

  setInterval(saveGameState, AUTO_SAVE_INTERVAL);
  setInterval(checkUpgradeRequirements, UPGRADE_CHECK_INTERVAL);

  await initializeGame();
});
