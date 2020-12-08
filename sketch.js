//Create variables here
var dog, sadDog, happyDog, database, foodS, foodStock;
var fedTime, lastFed,foodObj,feed,addFood,currentTime; 
var gameState;
var readState;
var bedroom, garden, washroom;


function preload()
{
happyDog = loadImage("Images/dogImg1.png");
sadDog = loadImage("Images/dogImg.png");

garden = loadImage("Images/Garden.png");
washroom = loadImage("Images/Wash Room.png");
bedroom = loadImage("Images/Bed Room.png");
}

function setup() {
  database = firebase.database();

  createCanvas(400,500);
 

  dog = createSprite(200,410);
  dog.addImage(sadDog);
  dog.scale = 0.2;

  var foodStock = database.ref("Food");
  foodStock.on("value", readStock);

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });

  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  });
  foodObj = new food();

  feed=createButton("Feed the dog");
  feed.position(400,100);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(500,100);
  addFood.mousePressed(addFoods);
}


function draw() {  
  currentTime = hour();
  if (currentTime == (lastFed + 1)){
     update("Playing");
      foodObj.garden();
   } else if (currentTime == (lastFed + 2)){
    update("Sleeping");
    foodObj.bedroom();
   } else if (currentTime > (lastFed + 2) && currentTime <= (lastFed + 4)){
    update("Bathing");
    foodObj.washroom();
   } else {
    update("Hungry")
    foodObj.display();
   }
  
if(gameState != "Hungry"){
     feed.hide();
     addFood.hide();
     dog.remove();
   }else{
    feed.show();
    addFood.show();
    dog.addImage(happyDog);
   }

drawSprites();
  }
  function readStock(data){
    foodS=data.val();
    foodObj.updateFoodStock(foodS);
  }

function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour(),
    gameState:"Hungry"
  })
}
function addFoods(){
  foodS ++;
  database.ref('/').update({
    Food:foodS
  })
}

function update(state){
  database.ref('/').update({
    gameState:state
  })
}
