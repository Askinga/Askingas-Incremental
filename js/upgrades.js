let up1bought = 0;

function saveGameState2() {
  try {
    localStorage.setItem('up1bought', up1bought);
  } catch (e) {
    console.error('Failed to save upgrade state', e);
  }
}

function loadGameState2() {
  try {
    const savedUp1bought = localStorage.getItem('up1bought');
    if (savedUp1bought !== null) {
      up1bought = parseInt(savedUp1bought);
    }
  } catch (e) {
    console.error('Failed to load upgrade state', e);
  }
}

function buyUpgrade1() {
  if (up1bought < 1 && parseInt(clickElement.innerHTML) >= 75) {
    up1bought += 1;
    clickElement.innerHTML = parseInt(clickElement.innerHTML) - 75;
    saveGameState2();  // Add this line to save the upgrade state
  }
}

// Call loadGameState2 when the game starts
loadGameState2();
