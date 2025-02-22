let up1bought = 0;

function buyUpgrade1() {
  if (up1bought < 1 && parseInt(clickElement.innerHTML) >= 75) {
    up1bought += 1;
    clickElement.innerHTML = parseInt(clickElement.innerHTML) - 75;
  }
}
