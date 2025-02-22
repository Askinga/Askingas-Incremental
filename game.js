let clickElement = document.querySelector('.clicks');

function incrementClick() {
  clickElement.innerHTML = parseFloat(clickElement.innerHTML) + 1;
};
