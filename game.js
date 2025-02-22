let player = {
  	clicks: 0
}

function Click(){
  player.clicks = player.clicks.add(1);
}

function displayText() {
  var text = 'You have ' format(player.clicks) + ' Clicks'
  text.style.display = "block";
}
