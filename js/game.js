document.addEventListener('DOMContentLoaded', async () => {
  const getElement = (selector) => {
    const element = document.querySelector(selector);
    if (!element) {
      throw new Error(`Element not found: ${selector}`);
    }
    return element;
  };

  const mainUpgrades = [
    { id: 1, description: 'x2 Clicks', cost: new Decimal(75) },
    { id: 2, description: 'x2 Clicks and 1 Click per Second', cost: new Decimal(300) },
    { id: 3, description: 'x1.75 Clicks and x5 Clicks per Second', cost: new Decimal(700) },
    { id: 4, description: 'x2.5 Clicks and x3 Clicks per Second', cost: new Decimal(1500) },
    { id: 5, description: 'x2.25 Clicks and x2.75 Click per Second', cost: new Decimal(4250) },
    { id: 6, description: 'x4 Clicks and x5 Clicks per Second', cost: new Decimal(10000) },
    { id: 7, description: 'x3.25 Clicks and x3 Clicks per Second', cost: new Decimal(50000) },
    { id: 8, description: 'x5 Clicks and x2.8 Click per Second', cost: new Decimal(225000) },
    { id: 9, description: 'x6 Clicks and x2.5 Click per Second', cost: new Decimal("1e6") },
    { id: 10, description: 'x6.66 Clicks and Clicks per Second', cost: new Decimal("6.66e6") },
    { id: 11, description: 'x5 Clicks and x10 Click per Second', cost: new Decimal("3.75e7") },
    { id: 12, description: 'x10 Clicks and x5 Clicks per Second', cost: new Decimal("2e8") },
  ];

  const prestigeUpgrades = [
    { id: 13, description: 'x5 Clicks', cost: 1 },
    { id: 14, description: 'x3 Clicks', cost: 2 },
    { id: 15, description: 'x10 Clicks', cost: 5 },
  ];

  const renderUpgrades = (containerId, upgrades) => {
    const container = document.getElementById(containerId);
    container.replaceChildren(); // More efficient than clearing `innerHTML`
    upgrades.forEach(upgrade => {
      const button = document.createElement('button');
      button.id = `upgrade${upgrade.id}`;
      button.className = `up${upgrade.id}`;
      if(upgrades = prestigeUpgrades) {
      button.textContent = `Upgrade ${upgrade.id}: ${upgrade.description}. Cost: ${format(upgrade.cost)} PP`;
      } else {
      button.textContent = `Upgrade ${upgrade.id}: ${upgrade.description}. Cost: ${format(upgrade.cost)} Clicks`;
      }
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
    buttons: mainUpgrades.concat(prestigeUpgrades).map(upgrade => getElement(`#upgrade${upgrade.id}`)),
    cpsElement: getElement('.cps'),
  };

  const STORAGE_KEYS = {
    CLICK: 'clicks',
    PP: 'PPts',
    CPS: 'cps',
    LAST_TIME: 'lastTime',
    ...Object.fromEntries([...mainUpgrades, ...prestigeUpgrades].map(u => [u.key, u.key])),
  };

  const gameState = {
    clickMulti: new Decimal(1),
    prestigeClickMulti: new Decimal(1),
    PPts: new Decimal(0),
    clickCount: new Decimal(0),
    cps: new Decimal(0),
    passiveIncome: new Decimal(0),
    lastTime: new Decimal(Date.now()),
    ...Object.fromEntries([...mainUpgrades, ...prestigeUpgrades].map(u => [u.key, new Decimal(0)])),
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

  const updateElementText = (element, value) => {
    element.innerText = value.toString();
  };

  const checkUpgradeRequirements = () => {
    mainUpgrades.concat(prestigeUpgrades).forEach((upgrade, index) => {
      const button = elements.buttons[index];
      const cost = upgrade.isPP ? gameState.PPts : gameState.clickCount;
      const meetsRequirements = cost.gte(upgrade.baseCost) && gameState[upgrade.key].lessThan(1);
      button.classList.toggle('requirements-met', meetsRequirements);
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
        gameState.cps = gameState.cps.add(upgrade.cpsAdd); // Removed redundant multiplication
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
