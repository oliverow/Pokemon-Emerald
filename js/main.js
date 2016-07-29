var c = document.getElementById('pane').getContext('2d');
var textures = new Image();
textures.src = 'img/backgrounds.png';
var sprites = new Image();
sprites.src = 'img/characterSprites.png';
var w = c.canvas.width;
var h = c.canvas.height;
var charX = 24*16;
var charY = 50*16;
var leftKeyDown = false;
var rightKeyDown = false;
var topKeyDown = false;
var botKeyDown = false;
var aKeyDown = false;
var enterKeyDown = false;
var direction = 0;
// Canvas code here
/*
var n = 0;
var m = 8;
var charX = 0;//845+120*n; // {0 <= n <= 2}
var charY = 90*m;//90*m; // {0 <= m <= 2}
*/
var charDir = 0;
var charState = 0;
var walking;
var mapNum = 0;
var message = "";
var currentMap = "mainMap";
var cid;
var monsterInfo;
var maps = {};
var mapNames = ["cave","downstair","hosipital","lab","mainMap","shop","upstair"];
for(var i = 0; i < mapNames.length; i++){
    var mapFile = fopen("maps/"+mapNames[i]+".json");
    var map = fread(mapFile);
    maps[mapNames[i]] = JSON.parse(map);
}

//keyboard events
    
var mapKeyDown = function(evt) {
    //go left
    if(evt.keyCode === 37) {
        direction = 1;
        leftKeyDown = true;
        evt.preventDefault();
    }
    //go right
    else if(evt.keyCode === 39) {
        direction = 2;
        rightKeyDown = true;   
        evt.preventDefault();    
    }
    //go up
    else if(evt.keyCode === 38) {
        direction = 3;
        topKeyDown = true;
        evt.preventDefault();
    }
    //turn down
    else if(evt.keyCode === 40) {
        direction = 4;
        botKeyDown = true;
        evt.preventDefault();
    }
    //A key
    else if(evt.keyCode === 65) {
        aKeyDown = true;
        evt.preventDefault();
    }
    //enter key
    else if(evt.keyCode === 13){
        enterKeyDown = true;
        evt.preventDefault();
    }
}
var mapKeyUp = function(evt) {
    //go left
    if(evt.keyCode === 37) {
        leftKeyDown = false;
        evt.preventDefault();
    }
    //go right
    else if(evt.keyCode === 39) {
        rightKeyDown = false;    
        evt.preventDefault();   
    }
    //go up
    else if(evt.keyCode === 38) {
        topKeyDown = false;
        evt.preventDefault();
    }
    //turn down
    else if(evt.keyCode === 40) {
        botKeyDown = false;
        evt.preventDefault();
    }
    //A key
    else if(evt.keyCode === 65) {
        aKeyDown = false;
        evt.preventDefault();
    }
    //enter key
    else if(evt.keyCode === 13){
        enterKeyDown = false;
        evt.preventDefault();
    }
};

function makeHttpObject() {
    try {
        return new XMLHttpRequest();
    } catch(error) {}
    try {
        return new ActiveXObject("Msxml2.XMLHTTP");
    } catch(error) {}
    try {
        return new ActiveXObject("Microsoft.XMLHTTP");
    } catch(error) {}
    throw new Error("Could not create HTTP request object.");
}

function fopen(file) {
    var request = makeHttpObject();
    request.open("GET", file, false);
    return request;
}

function fread(obj) {
    obj.send(null);
    return obj.responseText;
}

function displayMap(mapName){
    var map = maps[mapName]
    for(var j = 0; j < (map.layers).length; j++){
        if(map.layers[j].hasOwnProperty("data")){
            for(var i = 0; i < (map.layers[j].data).length; i++){
                var row = Math.floor((map.layers[j].data[i]-1)/61);
                var col = (map.layers[j].data[i]-1)%61;
                if(col !== -1 && row !== -1){
                    var srcX = (col)*17;
                    var srcY = (row)*17;
                    var destX = i%(map.width)*16;
                    var destY = Math.floor(i/map.width)*16;
                    c.drawImage(textures,srcX,srcY,16,16,destX-charX+w/2,destY-charY+h/2,16,16);
                }
            }
        }
    }
    mapMove(map); 
    checkMap(map);
}

function mapMove(map){
    var condition1 = charX-16>=0 && leftKeyDown===true && map.layers[1].data[Math.floor((charY*map.width+charX)/16-1)]===0;
    var condition2 = charX+16<=map.width*16 && rightKeyDown===true && map.layers[1].data[Math.floor((charY*map.width+charX)/16+1)]===0;
    var condition3 = charY-16>=0 && topKeyDown===true && map.layers[1].data[Math.floor((charY*map.width+charX)/16-map.width)]===0;
    var condition4 = charY+16<=map.height*16 && botKeyDown===true && map.layers[1].data[Math.floor((charY*map.width+charX)/16+map.width)]===0;
    if(condition1){
         charX = charX - 16;
    }
    else if(condition2){
         charX = charX + 16;
    }
    else if(condition3){
         charY = charY - 16;
    }
    else if(condition4){
         charY = charY + 16;
    } 
}

//c.drawImage(sprites,srcX,srcY,srcW,srcH,destX,destY,destW,destH);
//c.drawImage(sprites,charX+charDir,charY+walking*(charState+30),30,30,200,200,30,30);

function drawSprite(){
   if (leftKeyDown) {
    walking = 1;
    charState = (charState+30)%60;
    charDir = 30;
  } else if (rightKeyDown) {
    walking = 1;
    charState = (charState+30)%60;
    charDir = 90;
  } else if (topKeyDown) {
    walking = 1;
    charState = (charState+30)%60;
    charDir = 60;
  } else if (botKeyDown) {
    walking = 1;
    charState = (charState+30)%60;
    charDir = 0;
  }else {
    walking = 0;
    charState = 0;
  }
  c.drawImage(sprites,0+charDir,0+walking*(charState+30),30,30,120,88,30,30);
}

function checkMap(map){  
    if(isDoorDown(map)){
        currentMap = map.layers[2].objects[mapNum].properties.destination;
        charX = Number(map.layers[2].objects[mapNum].properties.desX);
        charY = Number(map.layers[2].objects[mapNum].properties.desY)+16;
    }
    else if(isDoorUp(map)){
        currentMap = map.layers[2].objects[mapNum].properties.destination;
        charX = Number(map.layers[2].objects[mapNum].properties.desX);
        charY = Number(map.layers[2].objects[mapNum].properties.desY)-16;
    }
    else if(isDoorRight(map)){
        currentMap = map.layers[2].objects[mapNum].properties.destination;
        charX = Number(map.layers[2].objects[mapNum].properties.desX)-16;
        charY = Number(map.layers[2].objects[mapNum].properties.desY);
    }
    else if(isDoorLeft(map)){
        currentMap = map.layers[2].objects[mapNum].properties.destination;
        charX = Number(map.layers[2].objects[mapNum].properties.desX)+16;
        charY = Number(map.layers[2].objects[mapNum].properties.desY);
    }
    else if(isOnTheMonsterFiled(map)){
        var randomNum = Math.random()*7;  
        if(randomNum <= monsterInfo.probability){
            var max = Number(monsterInfo.maxLevel);
            var min = Number(monsterInfo.minLevel);
            var level = Math.floor(Math.random() * (max - min) + min);
            var typeArr = monsterInfo.type.split(",");
            var typeNum = Math.floor(Math.random()*typeArr.length); 
            var type = typeArr[typeNum];
            //call Oliver's function,input(level,type); 
            document.onkeydown = fightKeyDown;
            document.onkeyup = fightKeyUp;
            document.getElementById("pane").classList.add("fight");
            console.log("A wild level "+level+" "+type+" type pokemon appeared!");  
            setTimeout(function(){meetWild(type, level)},100);
            leftKeyDown = false;
            rightKeyDown = false;
            topKeyDown = false;
            botKeyDown = false;
            aKeyDown = false;
            inFight = true;  
        }
    }
    else if(isNpcThere(map)){
        aKeyDown = false;
        typewriter.print(message);
    }
    else if(menu()){
        document.getElementById("selector").classList.remove("hidden");
        document.onkeydown = fightKeyDown;
        document.onkeyup = fightKeyUp;
        callMenu();
    }
}

function isDoorDown(map){
    if(botKeyDown === true){
        for(var i = 0; i < (map.layers[2].objects).length; i ++){           
            var minX = Number(map.layers[2].objects[i].x);
            var maxX = Number(map.layers[2].objects[i].x) + Number(map.layers[2].objects[i].width);
            var minY = Number(map.layers[2].objects[i].y);
            var maxY = Number(map.layers[2].objects[i].y) + Number(map.layers[2].objects[i].height);
            if(minX<= charX && charX <= maxX && minY <= charY + 16 && charY + 16 <= maxY){
                mapNum = i;
                return true;
            }
        }
        return false;
    }
}

function isDoorUp(map){
    if(topKeyDown === true){
        for(var i = 0; i < (map.layers[2].objects).length; i ++){
            var minX = Number(map.layers[2].objects[i].x);
            var maxX = Number(map.layers[2].objects[i].x) + Number(map.layers[2].objects[i].width);
            var minY = Number(map.layers[2].objects[i].y);
            var maxY = Number(map.layers[2].objects[i].y) + Number(map.layers[2].objects[i].height);
            if(minX<= charX && charX <= maxX && minY <= charY - 16 && charY - 16 <= maxY){            
                mapNum = i;
                return true;
            }
        }
        return false;
    } 
}

function isDoorRight(map){
    if(rightKeyDown === true){
        for(var i = 0; i < (map.layers[2].objects).length; i ++){
            var minX = Number(map.layers[2].objects[i].x);
            var maxX = Number(map.layers[2].objects[i].x) + Number(map.layers[2].objects[i].width);
            var minY = Number(map.layers[2].objects[i].y);
            var maxY = Number(map.layers[2].objects[i].y) + Number(map.layers[2].objects[i].height);
            if(minX<= charX + 16 && charX + 16 <= maxX && minY <= charY && charY <= maxY){            
                mapNum = i;
                return true;
            }
        }
        return false;
    } 
}

function isDoorLeft(map){
    if(leftKeyDown === true){
        for(var i = 0; i < (map.layers[2].objects).length; i ++){
            var minX = Number(map.layers[2].objects[i].x);
            var maxX = Number(map.layers[2].objects[i].x) + Number(map.layers[2].objects[i].width);
            var minY = Number(map.layers[2].objects[i].y);
            var maxY = Number(map.layers[2].objects[i].y) + Number(map.layers[2].objects[i].height);
            if(minX<= charX - 16 && charX - 16 <= maxX && minY <= charY && charY <= maxY){            
                mapNum = i;
                return true;
            }
        }
        return false;
    } 
}

function isNpcThere(map){
    if(aKeyDown === true && direction === 3){
        for(var i = 0; i < (map.layers).length; i++){
            if(map.layers[i].name === "people\/signs"){
                for(var j = 0; j < (map.layers[i].objects).length; j++){
                    var minX = Number(map.layers[i].objects[j].x);
                    var maxX = Number(map.layers[i].objects[j].x) + Number(map.layers[i].objects[j].width);
                    var minY = Number(map.layers[i].objects[j].y);
                    var maxY = Number(map.layers[i].objects[j].y) + Number(map.layers[i].objects[j].height);
                    if(minX<= charX && charX <= maxX && minY <= charY - 16 && charY - 16 <= maxY){
                        message = map.layers[i].objects[j].properties.message;
                        if(currentMap==="hosipital"){
                            hospital();
                            // will heal whatever you talk to
                        }
                        if(currentMap==="shop"){
                            document.getElementById("selector").classList.remove("hidden");
                            document.getElementById("money").classList.remove("hidden");
                            document.onkeydown = fightKeyDown;
                            document.onkeyup = fightKeyUp;
                            shopping();
                            //you can buy whatever you talk to
                        }
                        return true;
                    }
                }
            }
        }
        return false;
    }          
}

function isOnTheMonsterFiled(map){
    for(var i = 0; i < (map.layers).length; i++){
        if(map.layers[i].name === "monsterfield"){
            for(var j = 0; j < (map.layers[i].objects).length; j++){
                var minX = map.layers[i].objects[j].x;
                var maxX = map.layers[i].objects[j].x + map.layers[i].objects[j].width;
                var minY = map.layers[i].objects[j].y;
                var maxY = map.layers[i].objects[j].y + map.layers[i].objects[j].height;     
                if(minX <= charX && charX <= maxX && minY <= charY && charY <= maxY){
                    monsterInfo = map.layers[i].objects[j].properties;
                    return true;
                }
            }
        }
    }
}

function menu(){
    if(enterKeyDown === true){
        enterKeyDown = false;
        return true;
    }
}
function update(){
    c.clearRect(0,0,w,h);
    displayMap(currentMap);
    drawSprite();
    //c.strokeRect(128,96,16,16);
    clearTimeout(cid);
    if(!inFight){
        cid = setTimeout(update,100);
    }
}

document.onkeydown = mapKeyDown;
document.onkeyup = mapKeyUp;
update();



//Oliver's code

