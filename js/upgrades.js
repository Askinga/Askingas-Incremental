const up1bought = 0

function buyUpgrade1(){
  if(up1bought.lt(1) && clickElement.innerHTML.gte(75)){
    up1bought = up1bought.add(1)
    clickElement = clickElement.sub(75)
  }
}
