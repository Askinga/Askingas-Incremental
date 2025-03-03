document.addEventListener('DOMContentLoaded', async () => {
  const getElement = (selector) => {
    const element = document.querySelector(selector);
    if (!element) {
      throw new Error(`Element not found: ${selector}`);
    }
    return element;
  };

	function toScientificNotation(input) {
    // Check if the input is in the form of a number followed by "B"
    if (typeof input === 'string' && input.endsWith('B')) {
        // Remove "B" and convert to a number
        input = parseFloat(input.slice(0, -1)) * 1e9;
    } else if (typeof input === 'string') {
        // Check if it's just a regular number
        input = parseFloat(input);
    }

    // Convert the number to scientific notation with 2 decimal places
    return input.toExponential(2);
  }
  const elements = {
    clickElement: getElement('.clicks'),
    PPElement: getElement('.prestige'),
    prestigeElement: getElement('.prestigepoints'),
    clickButton: getElement('.click-button'),
    prestigeButton: getElement('.prestige-button'),
    up1Button: getElement('#upgrade1'),
    up2Button: getElement('#upgrade2'),
    up3Button: getElement('#upgrade3'),
    up4Button: getElement('#upgrade4'),
    up5Button: getElement('#upgrade5'),
    up6Button: getElement('#upgrade6'),
    up7Button: getElement('#upgrade7'),
    up8Button: getElement('#upgrade8'),
    up9Button: getElement('#upgrade9'),
    up10Button: getElement('#upgrade10'),
    up11Button: getElement('#upgrade11'),  
    up12Button: getElement('#upgrade12'),
    tabMain: getElement('#main-tab'),
    tabPrestige: getElement('#prestige-tab'),
    cpsElement: getElement('.cps'),
    loadingScreen: getElement('#loading-screen')
  };

  const storageKeys = {
    CLICK: 'clicks',
    PP: 'PPts',
    UPGRADE1: 'up1bought',
    UPGRADE2: 'up2bought',
    UPGRADE3: 'up3bought',
    UPGRADE4: 'up4bought',
    UPGRADE5: 'up5bought',
    UPGRADE6: 'up6bought',
    UPGRADE7: 'up7bought',
    UPGRADE8: 'up8bought',
    UPGRADE9: 'up9bought',
    UPGRADE10: 'up10bought',
    UPGRADE11: 'up11bought',
    UPGRADE12: 'up12bought',
    CPS: 'cps',
    LAST_TIME: 'lastTime'
  };

  const gameState = {
    clickMulti: new Decimal(1),
    PPts: new Decimal(0),
    up1Bought: new Decimal(0),
    up2Bought: new Decimal(0),
    up3Bought: new Decimal(0),
    up4Bought: new Decimal(0),
    up5Bought: new Decimal(0),
    up6Bought: new Decimal(0),
    up7Bought: new Decimal(0),
    up8Bought: new Decimal(0),
    up9Bought: new Decimal(0),
    up10Bought: new Decimal(0),
    up11Bought: new Decimal(0),
    up12Bought: new Decimal(0),
    clickCount: new Decimal(0),
    cpsClicks: new Decimal(0),
    tabMain: true,
    tabPrestige: false,
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
    return value !== null && !isNaN(value) ? new Decimal(value) : new Decimal(defaultValue);
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
    saveState(storageKeys.UPGRADE5, gameState.up5Bought);
    saveState(storageKeys.UPGRADE6, gameState.up6Bought);
    saveState(storageKeys.UPGRADE7, gameState.up7Bought);
    saveState(storageKeys.UPGRADE8, gameState.up8Bought);
    saveState(storageKeys.UPGRADE9, gameState.up9Bought);
    saveState(storageKeys.UPGRADE10, gameState.up10Bought);
    saveState(storageKeys.UPGRADE11, gameState.up11Bought);
    saveState(storageKeys.UPGRADE12, gameState.up12Bought);
  };

  const loadUpgradeState = async () => {
    try {
      const [up1Bought, up2Bought, up3Bought, up4Bought, up5Bought, up6Bought, up7Bought, up8Bought, up9Bought, up10Bought, up11Bought, up12Bought] = await Promise.all([
        loadState(storageKeys.UPGRADE1, 0),
        loadState(storageKeys.UPGRADE2, 0),
        loadState(storageKeys.UPGRADE3, 0),
        loadState(storageKeys.UPGRADE4, 0),
        loadState(storageKeys.UPGRADE5, 0),
        loadState(storageKeys.UPGRADE6, 0),
        loadState(storageKeys.UPGRADE7, 0),
        loadState(storageKeys.UPGRADE8, 0),
        loadState(storageKeys.UPGRADE9, 0),
	loadState(storageKeys.UPGRADE10, 0),
        loadState(storageKeys.UPGRADE11, 0),
	loadState(storageKeys.UPGRADE12, 0)
      ]);
      gameState.up1Bought = up1Bought;
      gameState.up2Bought = up2Bought;
      gameState.up3Bought = up3Bought;
      gameState.up4Bought = up4Bought;
      gameState.up5Bought = up5Bought;
      gameState.up6Bought = up6Bought;
      gameState.up7Bought = up7Bought;
      gameState.up8Bought = up8Bought;
      gameState.up9Bought = up9Bought;
      gameState.up10Bought = up10Bought;
      gameState.up11Bought = up11Bought;
      gameState.up12Bought = up12Bought;
      return { up1Bought, up2Bought, up3Bought, up4Bought, up5Bought, up6Bought, up7Bought, up8Bought, up9Bought, up10Bought, up11Bought, up12Bought };
    } catch (e) {
      console.error("Error loading upgrade states:", e);
      return { up1Bought: new Decimal(0), up2Bought: new Decimal(0), up3Bought: new Decimal(0), up4Bought: new Decimal(0), up5Bought: new Decimal(0), up6Bought: new Decimal(0), up7Bought: new Decimal(0), up8Bought: new Decimal(0), up9Bought: new Decimal(0), up10Bought: new Decimal(0), up11Bought: new Decimal(0), up12Bought: new Decimal(0) };
    }
  };

  const incrementClick = () => {
    gameState.clickCount = gameState.clickCount.add(gameState.clickMulti);
    updateElementText(elements.clickElement, 'You have ' + format(gameState.clickCount) + ' Clicks');
    checkUpgradeRequirements();
    saveGameState();
    updateElementText(elements.PPElement, 'You have ' + format(gameState.PPts) + ' PP');
    toScientificNotation(new Decimal(gameState.clickCount));
    updatePP();
  };
  
  const buyUpgrade = (upgradeKey, cost, multiplier, cpsMulti, cpsAdd, element) => {
    if (gameState[upgradeKey].lessThan(1) && gameState.clickCount.gte(cost)) {
      gameState[upgradeKey] = gameState[upgradeKey].add(1);
      gameState.clickCount = gameState.clickCount.sub(cost);
      gameState.clickMulti = gameState.clickMulti.times(multiplier);
      gameState.cps = gameState.cps.add(cpsAdd);
      gameState.passiveIncome = gameState.passiveIncome.add(cpsAdd);
      gameState.cps = gameState.cps.times(cpsMulti);
      gameState.passiveIncome = gameState.passiveIncome.times(cpsMulti);
      updateElementText(elements.clickElement, 'You have ' + format(gameState.clickCount) + ' Clicks');
      saveUpgradeState();
      saveGameState();
      element.classList.add('bought');
      checkUpgradeRequirements();
      checkPrestigeTab();
      updateCPS();
      updatePP();
    }
  };

  const handlePassiveIncome = () => {
    gameState.clickCount = gameState.clickCount.add(gameState.passiveIncome);
    updateElementText(elements.clickElement, 'You have ' + format(gameState.clickCount) + ' Clicks');
    updatePP();
    saveGameState();
    checkPrestigeTab();
  };

  const updatePP = () => {
  	const resetAmount = new Decimal(gameState.clickCount.add(1).div(1e10).pow(0.075));
	updateElementText(elements.prestigeElement, format(resetAmount));
  }
	
  const updateCPS = () => {
    const now = new Decimal(Date.now());
    const elapsedSeconds = now.sub(gameState.lastTime).div(1000);
    const totalClicks = gameState.cpsClicks.add(gameState.passiveIncome.times(elapsedSeconds));
    const cpsDisplay = totalClicks.div(elapsedSeconds).toFixed(2);
    updateElementText(elements.cpsElement, 'CPS: ' + format(cpsDisplay));
    gameState.cpsClicks = new Decimal(0);
    gameState.lastTime = now;
  };
	
  const checkUpgradeRequirements = () => {
    elements.up1Button.classList.toggle('requirements-met', gameState.clickCount.gte(75) && gameState.up1Bought.lessThan(1));
    elements.up2Button.classList.toggle('requirements-met', gameState.clickCount.gte(300) && gameState.up2Bought.lessThan(1));
    elements.up3Button.classList.toggle('requirements-met', gameState.clickCount.gte(700) && gameState.up3Bought.lessThan(1));
    elements.up4Button.classList.toggle('requirements-met', gameState.clickCount.gte(1500) && gameState.up4Bought.lessThan(1));
    elements.up5Button.classList.toggle('requirements-met', gameState.clickCount.gte(4250) && gameState.up5Bought.lessThan(1));
    elements.up6Button.classList.toggle('requirements-met', gameState.clickCount.gte(10000) && gameState.up6Bought.lessThan(1));
    elements.up7Button.classList.toggle('requirements-met', gameState.clickCount.gte(50000) && gameState.up7Bought.lessThan(1));
    elements.up8Button.classList.toggle('requirements-met', gameState.clickCount.gte(225000) && gameState.up8Bought.lessThan(1));
    elements.up9Button.classList.toggle('requirements-met', gameState.clickCount.gte(1e6) && gameState.up9Bought.lessThan(1));
    elements.up10Button.classList.toggle('requirements-met', gameState.clickCount.gte(6.66e6) && gameState.up10Bought.lessThan(1));
    elements.up11Button.classList.toggle('requirements-met', gameState.clickCount.gte(3.75e7) && gameState.up11Bought.lessThan(1));
    elements.up12Button.classList.toggle('requirements-met', gameState.clickCount.gte(2.00e8) && gameState.up12Bought.lessThan(1));
  };

  const prestigeReset = () => {
	let resetAmount = new Decimal(gameState.clickCount.add(1).div(1e10).pow(0.075));
	if (resetAmount.gte(1)) {
	    if(!confirm('Are you sure you want to prestige for ' + format(resetAmount) + ' PP?')) return
	    doPrestigeReset();
	}
  };

  const mainTab = () => {
	gameState.tabMain = true;
	gamestate.tabPrestige = false;
  };

  const prestigeTab = () => {
	gameState.tabMain = false;
	gamestate.tabPrestige = true;
  };
	
  const doPrestigeReset = () => {
	  let resetAmount = new Decimal(gameState.clickCount.add(1).div(1e10).pow(0.075));
	  gameState.PPts = gameState.PPts.add(resetAmount);
	  gameState.clickCount = new Decimal(0);
	  gameState.clickMulti = new Decimal(1);
	  gameState.cps = new Decimal(0);
	  gameState.passiveIncome = new Decimal(0);
	  gameState.up1Bought = new Decimal(0);
	  gameState.up2Bought = new Decimal(0);
	  gameState.up3Bought = new Decimal(0);
	  gameState.up4Bought = new Decimal(0);
	  gameState.up5Bought = new Decimal(0);
	  gameState.up6Bought = new Decimal(0);
	  gameState.up7Bought = new Decimal(0);
  	  gameState.up8Bought = new Decimal(0);
	  gameState.up9Bought = new Decimal(0);
	  gameState.up10Bought = new Decimal(0);
	  gameState.up11Bought = new Decimal(0);
	  gameState.up12Bought = new Decimal(0);
	  updatePP();
	  updateElementText(elements.PPElement, 'You have ' + format(gameState.PPts) + ' PP');
  };
	  
  elements.clickButton.addEventListener('click', incrementClick);
  elements.prestigeButton.addEventListener('click', prestigeReset);
  elements.up1Button.addEventListener('click', () => buyUpgrade('up1Bought', new Decimal(75), new Decimal(2), new Decimal(1), new Decimal(0), elements.up1Button));
  elements.up2Button.addEventListener('click', () => buyUpgrade('up2Bought', new Decimal(300), new Decimal(2), new Decimal(1), new Decimal(1), elements.up2Button)); // <-- Add this closing parenthesis
  elements.up3Button.addEventListener('click', () => buyUpgrade('up3Bought', new Decimal(700), new Decimal(1.75), new Decimal(5), new Decimal(0), elements.up3Button));  
  elements.up4Button.addEventListener('click', () => buyUpgrade('up4Bought', new Decimal(1500), new Decimal(2.5), new Decimal(3), new Decimal(0), elements.up4Button));
  elements.up5Button.addEventListener('click', () => buyUpgrade('up5Bought', new Decimal(4250), new Decimal(2.25), new Decimal(2.75), new Decimal(0), elements.up5Button));
  elements.up6Button.addEventListener('click', () => buyUpgrade('up6Bought', new Decimal(10000), new Decimal(4), new Decimal(5), new Decimal(0), elements.up6Button));
  elements.up7Button.addEventListener('click', () => buyUpgrade('up7Bought', new Decimal(50000), new Decimal(3.25), new Decimal(3), new Decimal(0), elements.up7Button));
  elements.up8Button.addEventListener('click', () => buyUpgrade('up8Bought', new Decimal(225000), new Decimal(5), new Decimal(2.8), new Decimal(0), elements.up8Button));
  elements.up9Button.addEventListener('click', () => buyUpgrade('up9Bought', new Decimal(1e6), new Decimal(6), new Decimal(2.5), new Decimal(0), elements.up9Button));
  elements.up10Button.addEventListener('click', () => buyUpgrade('up10Bought', new Decimal(6.66e6), new Decimal(6.66), new Decimal(6.66), new Decimal(0), elements.up10Button));
  elements.up11Button.addEventListener('click', () => buyUpgrade('up11Bought', new Decimal(3.75e7), new Decimal(5), new Decimal(10), new Decimal(0), elements.up11Button));
  elements.up12Button.addEventListener('click', () => buyUpgrade('up12Bought', new Decimal(2.00e8), new Decimal(10), new Decimal(5), new Decimal(0), elements.up12Button));
	

  const saveGameState = () => {
    saveState(storageKeys.CLICK, gameState.clickCount);
    saveState(storageKeys.PP, gameState.PPts);
    saveState(storageKeys.CPS, gameState.cps);
    saveState(storageKeys.LAST_TIME, gameState.lastTime);
  };

const addCPS = (upgradeKey, number, cost) => {
   if (gameState[upgradeKey].lessThan(1) && gameState.clickCount.gte(cost)) { 
    gameState.cps = gameState.cps.add(number);
    gameState.passiveIncome = gameState.passiveIncome.add(number);
    updateCPS();
   }
  };

  const loadGameState = async () => {
    try {
      const [clickCount, PPts, cps, lastTime] = await Promise.all([
        loadState(storageKeys.CLICK, 0),
	loadState(storageKeys.PP, 0),
        loadState(storageKeys.CPS, 0),
        loadState(storageKeys.LAST_TIME, Date.now())
      ]);
      gameState.clickCount = clickCount;
      gameState.cps = cps;
      gameState.PPts = PPts;
      gameState.lastTime = lastTime;
      return { clickCount, PPts, cps, lastTime };
    } catch (e) {
      console.error("Error loading game state:", e);
      return { clickCount: new Decimal(0), PPts: new Decimal(0), cps: new Decimal(0), lastTime: new Decimal(Date.now()) };
    }
  };

  const initializeGame = async () => {
    try {
      const [{ clickCount, PPts, cps, lastTime }, { up1Bought, up2Bought, up3Bought, up4Bought, up5Bought, up6Bought, up7Bought, up8Bought, up9Bought, up10Bought, up11Bought, up12Bought }] = await Promise.all([
        loadGameState(),
        loadUpgradeState()
      ]);
      gameState.clickCount = clickCount;
      gameState.cps = cps;
      gameState.PPts = PPts;
      gameState.lastTime = lastTime;
      gameState.up1Bought = up1Bought;
      gameState.up2Bought = up2Bought;
      gameState.up3Bought = up3Bought;
      gameState.up4Bought = up4Bought;
      gameState.up5Bought = up5Bought;
      gameState.up6Bought = up6Bought;
      gameState.up7Bought = up7Bought;
      gameState.up8Bought = up8Bought;
      gameState.up9Bought = up9Bought;
      gameState.up10Bought = up10Bought;
      gameState.up11Bought = up11Bought;
      gameState.up12Bought = up12Bought;

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
      if (gameState.up5Bought.gte(1)) {
        elements.up5Button.classList.add('bought');
        gameState.clickMulti = gameState.clickMulti.times(2.25);
        gameState.cps = gameState.cps.times(2.75);
        gameState.passiveIncome = gameState.passiveIncome.times(2.75);
      }
      if (gameState.up6Bought.gte(1)) {
        elements.up6Button.classList.add('bought');
        gameState.clickMulti = gameState.clickMulti.times(4);
        gameState.cps = gameState.cps.times(5);
        gameState.passiveIncome = gameState.passiveIncome.times(5);
      }
      if (gameState.up7Bought.gte(1)) {
        elements.up7Button.classList.add('bought');
        gameState.clickMulti = gameState.clickMulti.times(3.25);
        gameState.cps = gameState.cps.times(2.8);
        gameState.passiveIncome = gameState.passiveIncome.times(2.8);
      }
      if (gameState.up8Bought.gte(1)) {
        elements.up8Button.classList.add('bought');
        gameState.clickMulti = gameState.clickMulti.times(5);
        gameState.cps = gameState.cps.times(2.8);
        gameState.passiveIncome = gameState.passiveIncome.times(2.8);
      }
      if (gameState.up9Bought.gte(1)) {
        elements.up9Button.classList.add('bought');
        gameState.clickMulti = gameState.clickMulti.times(6);
        gameState.cps = gameState.cps.times(2.5);
        gameState.passiveIncome = gameState.passiveIncome.times(2.5);
      }
      if (gameState.up10Bought.gte(1)) {
        elements.up10Button.classList.add('bought');
        gameState.clickMulti = gameState.clickMulti.times(6.66);
        gameState.cps = gameState.cps.times(6.66);
        gameState.passiveIncome = gameState.passiveIncome.times(6.66);
      }
      if (gameState.up11Bought.gte(1)) {
        elements.up11Button.classList.add('bought');
        gameState.clickMulti = gameState.clickMulti.times(5);
        gameState.cps = gameState.cps.times(10);
        gameState.passiveIncome = gameState.passiveIncome.times(10);
      }
      if (gameState.up12Bought.gte(1)) {
        elements.up12Button.classList.add('bought');
        gameState.clickMulti = gameState.clickMulti.times(10);
        gameState.cps = gameState.cps.times(5);
        gameState.passiveIncome = gameState.passiveIncome.times(5);
      }
      updateElementText(elements.clickElement, 'You have ' + format(gameState.clickCount) + ' Clicks');
      updateCPS();
      updatePP();
      checkUpgradeRequirements();
      checkPrestigeTab();
      mainTab();
      updateElementText(elements.PPElement, 'You have ' + format(gameState.PPts) + ' PP');
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
function checkPrestigeTab() {
  	const prestigeTab = document.getElementById('prestige-tab');
	if(gameState.clickCount.gte(1e10)) {
	prestigeTab.style.display = 'block';
    }
}
	
  await initializeGame();

  setInterval(saveGameState, 5000);
  setInterval(updateCPS, 1000);
  setInterval(handlePassiveIncome, 1000);
  setInterval(checkUpgradeRequirements, 1000);
   
});
