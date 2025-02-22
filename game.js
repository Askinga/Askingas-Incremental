document.querySelector('.clicks').addEventListener('click', () => {
  const clicks = document.querySelector('.clicks');
  clicks.innerHTML = parseFloat(clicks.innerHTML) + 1;
});
