/* have a Pokemon
 *  [object,object,object]
 *  meet a monster
 *  random
 *  proper level
 *  enter fighting stage
 *  fight
 *  player turn
 *   attack
 *   monster
 *   backpack
 *   escape
 *  AI turn
 *   attack
 * win/lose
 *  HP decide
 * quit fight
 *  enter world stage
 * NPC/town
 *  mission
 *  building
 *  hospital
*/ 

//Global
var monsterBook = [];
var skillBook = [];
var itemBook = [];
var myMonster = [];
var myBag = [];
var myMoney = 1000;
var monsterA;
var monsterB;
var delay = 50;
var inFight = false;

//Images
var c = document.getElementById('pane').getContext('2d');

//Selection
var selected = 0;
var selections = [];
var fightKeyDown = function(evt) {
  if (evt.keyCode == 38 ) {    // Up arrow 
    selected--;
  }
  if (evt.keyCode == 40 ) {    // Down arrow     
    selected++;
  }
  if (evt.keyCode == 37 ) {    // Left arrow 
    selected--;
  }
  if (evt.keyCode == 39 ) {    // Right arrow      
    selected++;
  }
  if (evt.keyCode == 13 || evt.keyCode === 65) {    // Enter or A     
    selections[selected].func();
  }
  if(selected < 0){
    selected = 0;
  }
  if(selected >= selections.length){
    selected = selections.length - 1;
  }
  createList();
  evt.preventDefault();
};
var fightKeyUp = function(evt) {
  if (evt.keyCode == 38 ) {    // Up arrow 
  }
  if (evt.keyCode == 40 ) {    // Down arrow    
  }
  if (evt.keyCode == 37 ) {    // Left arrow 
  }
  if (evt.keyCode == 39 ) {    // Right arrow       
  }
  evt.preventDefault();  
};

function createList(){
  var list = document.getElementById("selector");
  list.innerHTML = "";
  for(var i = 0; i<selections.length; i++){
    var li = document.createElement("li");
    li.innerHTML = selections[i].name;
    if(i == selected){
      li.className = "selected";
    }
    list.appendChild(li);
  }
}

//add monsters and skills
function addMB(No,name,type,level,experience,HP,attack,defence,speed,status){
    this.No = No; 
    this.name = name;
    this.HP = Number(HP);
    this.type = type;
    this.level = Number(level);
    this.experience = Number(experience);
    this.attack = Number(attack);
    this.defence = Number(defence);
    this.speed = Number(speed);
    this.status = status;
    this.skill = [0,0,0,0];
    this.data = {
        dHP: Number(HP),
        dAttack: Number(attack),
        dDefence: Number(defence),
        dSpeed: Number(speed),
        dStatus: status
    };
    this.check = function(){
        switch(this.status){
            case "none":
                return 2;
                break;
            case "paralysis":
                var random = Math.random();
                if (random > 0.5){
                    return 1;
                }
                else{
                    return 2;
                }
                break;
            case "confusion":
                var random = Math.random();
                if (random > 0.75){
                    return 1;
                }
                else{
                    return 2;
                }
                break;
            case "sleep":
                return 1;
                break;
            case "burn":
                return 2;
                break;
            case "diving":
                return 2;
                break;
            case "flying":
                return 2;
                break;
            case "recharging":
                return 2;
                break;
        }
    }
    this.x = 256;
    this.y = 20;
    this.vx = 0;
    this.vy = 0;
    this.img = new Image();
    this.img.src = "img/"+No+".png";
    this.draw = function(){
        if(this.x > -64 && this.x < 256 && this.y > -64 && this.y < 192){
            c.drawImage(this.img,this.x,this.y);
            this.info();
        }
    }
    this.info = function(){
        c.fillStyle = "black";
        c.strokeRect(this.x,this.y-6,64,10);
        c.fillStyle = "#5fb75f";
        var percentage = 64*this.HP/this.data.dHP;
        if(percentage < 0){
            percentage = 0;
        }
        else if(percentage > 64){
            percentage = 64;
        }
        c.fillRect(this.x,this.y-6,percentage,10);
        c.fillStyle = "black";
        c.font = "10px arial";
        if(this.status === "none"){
            var string1 = this.name+"  Lv."+this.level;
        }
        else{
            var string1 = this.name+"  Lv."+this.level+"  "+this.status;
        }
        c.fillText(string1,this.x-10,this.y-10);
        c.font = "10px arial";
        var string2 = this.HP+"/"+this.data.dHP;
        c.fillText(string2,this.x+18,this.y+3);
    }
    this.move = function(x,y,speed){
        if(this.x < c.canvas.width/2){
            if(this.x === x && (this.y < y-10||this.y > y+10)){
                c.clearRect(0,0,c.canvas.width/2,c.canvas.height);
                this.y += speed;
                var _this = this;
                setTimeout(function(){_this.move(x,y,speed)},delay);
            }
            else if(this.y === y && (this.x < x-10||this.x > x+10)){
                c.clearRect(0,0,c.canvas.width/2,c.canvas.height);
                this.x += speed;
                var _this = this;
                setTimeout(function(){_this.move(x,y,speed)},delay);
            }
            else if((this.x < x-10 && this.y > y+10)||(this.x > x+10 && this.y < y-10)){
                c.clearRect(0,0,c.canvas.width/2,c.canvas.height);
                var dx = x-this.x;
                var dy = y-this.y;
                this.x += speed*dx/(dx+dy);
                this.y += speed*dy/(dx+dy);
                var _this = this;
                setTimeout(function(){_this.move(x,y,speed)},delay);
            }
        }
        else if(this.x > c.canvas.width/2){
            if(this.x === x && (this.y < y-10||this.y > y+10)){
                c.clearRect(c.canvas.width/2,0,c.canvas.width/2,c.canvas.height);
                this.y += speed;
                var _this = this;
                setTimeout(function(){_this.move(x,y,speed)},delay);
            }
            else if(this.y === y && (this.x < x-10||this.x > x+10)){
                c.clearRect(c.canvas.width/2,0,c.canvas.width/2,c.canvas.height);
                this.x += speed;
                var _this = this;
                setTimeout(function(){_this.move(x,y,speed)},delay);
            }
            else if((this.x < x-10 && this.y > y+10)||(this.x > x+10 && this.y < y-10)){
                c.clearRect(c.canvas.width/2,0,c.canvas.width/2,c.canvas.height);
                var dx = x-this.x;
                var dy = y-this.y;
                this.x += speed*dx/(dx+dy);
                this.y += speed*dy/(dx+dy);
                var _this = this;
                setTimeout(function(){_this.move(x,y,speed)},delay);
            }
        }
        this.draw();
    }
    this.appear = function(){
        if(this.x < 128){
            this.x = -64;
            this.y = 60;
        }
        if(this.x > 166){
            this.move(166,20,-2);
        }
        else if(this.x < 26){
            this.move(26,60,2);
        }
    }
    this.retreat = function(){
        if(this.y === 20){
            this.move(this.x,-74,-4);
        }
        else if(this.y === 60){
            this.move(this.x,202,4);
        }
    }
}

function textColor(input){
    switch(input){
        case "normal":
            return "gray";
            break;
        case "rock":
            return "olive";
            break;
        case "water":
            return "blue";
            break;
        case "fire":
            return "red";
            break;
        case "grass":
            return "green";
            break;
        case "bug":
            return "purple";
            break;
        case "flying":
            return "cyan";
            break;
        case "electric":
            return "yellow";
            break;
    }
}

function appear(monsterA,monsterB){
    monsterA.appear();
    monsterB.appear();
    monsterA.draw();
    monsterB.draw();
}

function retreat(monsterA){
    monsterA.retreat();
}

function print(monsterA,monsterB,skill){
    var direction;
    if(monsterA.x < monsterB.x){
        direction = 1;
    }
    else{
        direction = -1;
    }
    function paint(x,y,degree){
        if(x < 300 && x > -300){
            c.clearRect(0,0,c.canvas.width,c.canvas.height);
            c.save();
            monsterA.draw();
            monsterB.draw();
            c.translate(x,y);
            c.rotate(degree);
            var size = Math.floor(Number((1+skill.power/100)*15));
            if(skill.power === 0){
                size = 10;
            }
            c.font = size+"px arial";
            c.fillStyle = textColor(skill.type);
            c.fillText(skill.identifier,0,40);
            x += direction*8;
            y -= direction*2;
            c.restore();
            setTimeout(function(){paint(x,y,degree)},delay);
        }
    }
    paint(monsterA.x,monsterA.y,(23*Math.PI/12));
}

function info(monsterA,monsterB){
    monsterA.info();
    monsterB.info();
}

function addSk(type,identifier,pp,power,accuracy,priority,effectId,effectChance){
    this.type = type;
    this.identifier = identifier;
    this.pp = Number(pp);
    this.power = Number(power);
    this.accruacy = Number(accuracy);
    this.priority = priority;
    this.effectId = effectId;
    this.effectChance = Number(effectChance);
    this.dpp = Number(pp);
    this.dAccruacy = Number(accuracy);
}

function addIt(name,type,quantity,price){
    this.name = name;
    this.type = type;
    this.quantity = Number(quantity);
    this.price = Number(price);
}

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

var pokemonListfo = fopen("js/pokemon list");
var pokemonListfr = fread(pokemonListfo);
var pokemonList = pokemonListfr.split("\n");

function createMonsterBook(){
    for(var i = 0; i < pokemonList.length; i++){
        pokemonList[i] = pokemonList[i].split(",");
        monsterBook.push(new addMB(pokemonList[i][0],pokemonList[i][1],pokemonList[i][2],pokemonList[i][3],pokemonList[i][4],pokemonList[i][5],pokemonList[i][6],pokemonList[i][7],pokemonList[i][8],pokemonList[i][9]));
    }
}

var skillListfo = fopen("js/skill list");
var skillListfr = fread(skillListfo);
var skillList = skillListfr.split("\n");

function createSkillBook(){
    var tempBook = [];
    for(var i = 0; i < skillList.length; i++){
        skillList[i] = skillList[i].split(",");
        tempBook.push(new addSk(skillList[i][0],skillList[i][1],skillList[i][2],skillList[i][3],skillList[i][4],skillList[i][5],skillList[i][6],skillList[i][7]));
    }
    var hold = [tempBook[0]];
    for(var i = 1; i < skillList.length; i++){
        if(tempBook[i].type === tempBook[i-1].type){
            hold.push(tempBook[i]);
        }
        else{
            skillBook.push(hold);
            hold = [tempBook[i]];
        }
    }
    skillBook.push(hold);
}

var itemListfo = fopen("js/item list");
var itemListfr = fread(itemListfo);
var itemList = itemListfr.split("\n");

function createItemBook(){
    for(var i = 0; i < itemList.length; i++){
        itemList[i] = itemList[i].split(",");
        itemBook.push(new addIt(itemList[i][0],itemList[i][1],1,itemList[i][2]));
    }
}

createMonsterBook();
createSkillBook();
createItemBook();

var advantagefo = fopen("js/skill advantage");
var advantagefr = fread(advantagefo);
var advantageList = advantagefr.split("\n");
for(var i = 0; i < advantageList.length; i++){
    advantageList[i] = advantageList[i].split(",");
}

function advantage(skill,monsterB){
    var row = checkType(skill);
    var col = checkType(monsterB);
    var multiple = advantageList[row][col];
    if(multiple > 1){
        console.log("special effect");
    }
    else if(multiple < 1){
        console.log("little effect");
    }
    return multiple;
}








//Fight
var fightKey = true;

function meetWild(type,level){
    document.getElementById("selector").classList.remove("hidden");
    var wildMonster = mGenerator(type,level);
    fightKey = true;
    monsterA = myMonster[0];
    monsterB = wildMonster;
    appear(monsterA,monsterB);
    document.getElementById("HP1").innerHTML = monsterA.HP+"/"+monsterA.data.dHP+"      Status:"+monsterA.status;
    document.getElementById("HP2").innerHTML = monsterB.HP+"/"+monsterB.data.dHP+"      Status:"+monsterB.status;
    setTimeout(function(){fight(monsterA,wildMonster)},2500);
}

function fight(monsterA,monsterB){
    if(monsterA.speed >= monsterB.speed){
        turns = 1;
    }
    else{
        turns = 2;
    }
    console.log(1);
    if(monsterA.HP > 0 && monsterB.HP > 0 && fightKey){
        if(turns === 1){
            console.log(10);
            player(monsterA,monsterB);
        }
        else{
            console.log(400);
            AI(monsterB,monsterA);
        }
    }
}

function turn(monsterA,monsterB){
    if(endTurnCheck(monsterA,monsterB)){
        if(monsterA.HP > 0 && monsterB.HP > 0 && fightKey){
            if(monsterA.x < c.canvas.width/2){
                console.log(410);
                AI(monsterB,monsterA);
            }
            else{
                player(monsterB,monsterA);
            }
        }
        else{
            console.log("end");
        }
    }
}

function player(monsterA,monsterB){
    document.getElementById("HP1").innerHTML = monsterA.HP+"/"+monsterA.data.dHP+"      Status:"+monsterA.status;
    document.getElementById("HP2").innerHTML = monsterB.HP+"/"+monsterB.data.dHP+"      Status:"+monsterB.status;
    effectCheck(monsterA);
    console.log(2);
    playerTurn(monsterA,monsterB,monsterA.check());
}

function AI(monsterB,monsterA){
    document.getElementById("HP1").innerHTML = monsterA.HP+"/"+monsterA.data.dHP+"      Status:"+monsterA.status;
    document.getElementById("HP2").innerHTML = monsterB.HP+"/"+monsterB.data.dHP+"      Status:"+monsterB.status;
    effectCheck(monsterB);
    AISkill(monsterB,monsterA,monsterB.check());
}

function endTurnCheck(monsterA,monsterB){
    if(monsterA.x > c.canvas.width/2){
        var temp = monsterA;
        monsterA = monsterB;
        monsterB = temp;
    }
    info(monsterA,monsterB);
    if(monsterA.HP > monsterA.data.dHP){
        monsterA.HP = monsterA.data.dHP;
    }
    if(monsterB.HP > monsterB.data.dHP){
        monsterB.HP = monsterB.data.dHP;
    }
    if(monsterA.HP <= 0){
        monsterA.HP = 0;
        retreat(monsterA);
        function checkFaint(){
            var faint = true;
            for(var i = 0; i < myMonster.length; i++){
                if(myMonster[i].HP > 0){
                    faint = false;
                }
            }
            return faint;
        }
        if(checkFaint()){
            function move(){
                document.getElementById("Process").innerHTML = "";
                returnToMap();
                currentMap = mapNames[2];
                charX = 160;
                charY = 112;
                hospital();
                typewriter.print("All your pokemons are healed.");
            }
            setTimeout(move,2000);
        }
        else{
            playerChooseMonster(monsterA,monsterB);
        }
    }
    if(monsterB.HP <= 0){
        monsterB.HP = 0;
        retreat(monsterB);
        monsterA.experience += monsterB.experience;
        myMoney += monsterB.experience/5;
        document.getElementById("Process").innerHTML += "<br>"+monsterB.name+" is faint. "+monsterA.name+" gains "+monsterB.experience+" EXP";
        if(monsterA.experience > monsterA.level * monsterA.level){
            levelUp(monsterA);
        }
//         typewriter.print("<br>"+monsterB.name+" is faint. "+monsterA.name+" gains "+monsterB.experience+" EXP",returnToMap);
        else{
            selections = [];
            selections[0] = {
                name: "Battle ends. Return to world.",
                func: function(){
                    document.getElementById("Process").innerHTML = "";
                    returnToMap();
                }
            }
            selected = 0;
            createList();
        }
            return false;
    }
    return true;
}

function playerTurn(monsterA,monsterB,skip){
    console.log(3);
    selections = [
        {
            name: "Skill",
            func: function(){
                if(skip === 2){
                    playerChooseSkill(monsterA,monsterB);
                }
                else{
                    typewriter.print(monsterA.name+" is "+monsterA.status+". Cannot move.");
                    turn(monsterA,monsterB);
                }
            }
        },
        {
            name: "Pokemon",
            func: function(){playerChooseMonster(monsterA,monsterB)}
        },
        {
            name: "Backpack",
            func: function(){playerOpenBackpack(monsterA,monsterB)}
        },
        {
            name: "Escape",
            func: function(){playerEscape(monsterA,monsterB)}
        }
    ];
    selected = 0;
    createList();
}

function playerChooseSkill(monsterA,monsterB){
    console.log(4);
    function chooseSkill(choice){
        var chance = Math.random();
/*        if((monsterA.status === "paralysis" && chance > 0.7)||(monsterA.status === "sleep")){
            document.getElementById("Process").innerHTML += "<br>"+monsterA.name+"'s status is "+monsterA.status;
            playerTurn(monsterA,monsterB,monsterA.check());
        }
        else{
*/            if(monsterA.skill[choice] === monsterA.skill.length || monsterA.skill[choice].pp < 1){
                playerTurn(monsterA,monsterB,monsterA.check());
            }
            var skill = monsterA.skill[choice].identifier;
            skillReactor(skill,choice,monsterA,monsterB);
//        }
    }
    selections = [];
    for(var i = 0; i < monsterA.skill.length; i++){
        selections[i] = {
            name: monsterA.skill[i].identifier+"  pp:"+monsterA.skill[i].pp+"/"+monsterA.skill[i].dpp+"<br>",
            skill: i,
            func: function(){chooseSkill(this.skill)}
        }
    }
    var back = {
        name: "back",
        func: function(){playerTurn(monsterA,monsterB,monsterA.check())}
    }
    selections.push(back);
    selected = 0;
    createList();
}

function playerChooseMonster(monsterA,monsterB){
    function chooseMonster(input){
        if(input === 0){
            playerChooseMonster(monsterA,monsterB);
        }
        else if(input === myMonster.length){
            playerTurn(monsterA,monsterB,monsterA.check());
        }
        else{
            var delayControl = false;
            if(monsterA.y < 192){
                monsterA.retreat();
                delayControl = true;
            }
            var newMonster = myMonster[input];
            myMonster[input] = myMonster[0];
            myMonster[0] = newMonster;
            monsterA = newMonster;
            if(delayControl){
                setTimeout(function(){monsterA.appear()},2000);
            }
            else{
                monsterA.appear();
            }
            monsterA.draw();
            if(delayControl){
                setTimeout(function(){turn(monsterA,monsterB)},4000);
            }
            else{
                setTimeout(function(){turn(monsterA,monsterB)},2000);
            }
        }
    }
    selections = [];
    for(var i = 0; i < myMonster.length; i++){
        selections[i] = {
            name: myMonster[i].name+"  Lv."+myMonster[i].level+"  HP:"+myMonster[i].HP+"  Status:"+myMonster[i].status+"  Skills:"+myMonster[i].skill[0].identifier+" "+myMonster[i].skill[1].identifier+" "+myMonster[i].skill[2].identifier+" "+myMonster[i].skill[3].identifier+"\n",
            pokemon: i,
            func: function(){chooseMonster(this.pokemon)}
        }
    }
    if(monsterA.HP > 0){
        var back = {
            name: "back",
            func: function(){chooseMonster(myMonster.length)}
        }
        selections.push(back);
    }

    selected = 0;
    createList();
}

function playerOpenBackpack(monsterA,monsterB){
    function openBackpack(itemNum){
        if(itemNum === myBag.length){
            console.log(601);
            playerTurn(monsterA,monsterB,monsterA.check);
        }
        else{
            console.log(602);
            itemReactor(itemNum,monsterA,monsterB);
            if(myBag[itemNum].quantity < 1){
                myBag.splice(itemNum,1);
            }
        }
    }
    selections = [];
    for (var i = 0; i < myBag.length; i++){
        selections[i] = {
            name: myBag[i].name+"x"+myBag[i].quantity,
            item: i,
            func: function(){openBackpack(this.item)}
        }
    }
    var back = {
        name: "back",
        func: function(){playerTurn(monsterA,monsterB,monsterA.check())}
    }
    selections.push(back);

    selected = 0;
    createList();
}

function playerEscape(monsterA,monsterB){
    var chance = monsterA.level/monsterB.level;
    var escape = Math.random()*chance;
    if(escape > 0.5){
        fightKey = false;
        document.getElementById("Process").innerHTML += "<br>you escaped";
        selections = [];
        selections[0] = {
            name: "Battle ends. Return to world.",
            func: function(){
                document.getElementById("Process").innerHTML = "";
                returnToMap();
            }
        }
        selected = 0;
        createList();
    }
    else{
        document.getElementById("Process").innerHTML += "<br>fail to escape";
        turn(monsterA,monsterB);
    }
}

function AISkill(monsterB,monsterA,skip){
    if(skip === 2){
        var skillPicked;
        var picking = true;
        while(picking){
            var random = Math.floor(Math.random()*4);
            if(monsterB.skill[random] !== 0 && monsterB.skill[random].pp > 0){
                skillPicked = monsterB.skill[random].identifier;
                picking = false;
            }
        }
        skillReactor(skillPicked,random,monsterB,monsterA);
    }
    else{
        document.getElementById("Process").innerHTML += "<br>"+monsterB.name+"'s status is "+monsterA.status+"."+monsterB.name+" can't move.";
    }
}

function effectCheck(monster){
    switch(monster.status){
        case "none":
            break;
        case "paralysis":
            var random = Math.random();
            if (random > 0.5){
                console.log(monster.name + " is paralyzed. Skip this turn.");
            }
            break;
        case "confusion":
            var random = Math.random();
            if (random > 0.75){
                console.log(monster.name + " is confused. It attacks itself.");
                monster.HP -= Math.floor(monster.attack/monster.defence*monster.level);
            }
            break;
        case "sleep":
            console.log(monster.name + " is sleeping. Skip this turn.");
            break;
        case "burn":
            console.log(monster.name + " is burned");
            monster.HP -= Math.floor(monster.HP*0.1*advantage(monsterBook[3],monster));
            break;
    }
}

//Skill
function skillReactor(skill,choose,monsterA,monsterB){
    var delayControl = true;
    for(var i = 0; i < skillBook.length; i++){
        for(var j = 0; j < skillBook[i].length; j++){
            if(skillBook[i][j].identifier === skill){
                var accuracy1 = Math.random();
                if(accuracy1 < skillBook[i][j].accruacy){
                    if(monsterA.status !== "recharging" && !(monsterB.status === "diving" || monsterB.status === "flying")){
                        var damage = Number(Math.floor(advantage(skillBook[i][j],monsterB)*0.5*(monsterA.attack/(monsterB.defence))*skillBook[i][j].power/(monsterB.level/monsterA.level)));
                        //console.log("attacking multiples: "+advantage(skillBook[i][j],monsterB)+" "+(monsterA.attack/(monsterB.defence)));
                        monsterB.HP -= damage;
                        document.getElementById("Process").innerHTML += "<br>"+monsterA.name+" uses "+skillBook[i][j].identifier+" dealing "+damage+" points of damage to "+monsterB.name;
                        //typewriter.print(monsterA.name+" uses "+skillBook[i][j].identifier+" dealing "+damage+" points of damage to "+monsterB.name, false, true);
                        var accuracy2 = Math.random();
                        if(accuracy2 < skillBook[i][j].effectChance){
                            effectReactor(skillBook[i][j].effectId,i,j,monsterA,monsterB);
                        }
                        print(monsterA,monsterB,skillBook[i][j]);
                    }
                    else{
                        document.getElementById("Process").innerHTML += "<br>"+monsterA.name+" is recharging";
                        monsterA.status = "none";
                        delayControl = false;
                    }
                }
                else{
                    document.getElementById("Process").innerHTML += "<br>"+monsterA.name+" missed";
                    delayControl = false;
                }
                monsterA.skill[choose].pp --;
            }
        }
    }
    if(delayControl){
        setTimeout(function(){turn(monsterA,monsterB)},2000);
    }
    else{
        setTimeout(function(){turn(monsterA,monsterB)},500);
    }
}

function effectReactor(effect,i,j,monsterA,monsterB){
    switch(effect){
        case 0:
            break;
        case "pt":
            document.getElementById("Process").innerHTML += "<br>"+monsterB.name+" is paralyzed";
            monsterB.status = "paralysis";
            break;
        case "ct":
            document.getElementById("Process").innerHTML += "<br>"+monsterB.name+" is confused";
            monsterB.status = "confusion";
            break;
        case "st":
            document.getElementById("Process").innerHTML += "<br>"+monsterB.name+" falls asleep";
            monsterB.status = "sleep";
            break;
        case "bt":
            document.getElementById("Process").innerHTML += "<br>"+monsterB.name+" is burned";
            monsterB.status = "burn";
            break;
        case "xl":
            document.getElementById("Process").innerHTML += "<br>"+monsterA.name+" is going to recharge";
            monsterA.status = "recharging";
            break;
        case "la":
            document.getElementById("Process").innerHTML += "<br>"+monsterB.name+"'s accuracy is lowered";
            for(var i = 0; i < 4; i++){
                monsterB.skill[i].accruacy = monsterB.skill[i].accruacy*0.8;
            }
            break;
        case "rd":
            document.getElementById("Process").innerHTML += "<br>"+monsterA.name+"'s defense is raised";
            monsterA.defence = monsterA.defence * 1.4;
            break;
        case "ra":
            document.getElementById("Process").innerHTML += "<br>"+monsterA.name+"'s attack is raised";
            monsterA.attack = monsterA.attack * 1.4;
            break;
        case "rs":
            document.getElementById("Process").innerHTML += "<br>"+monsterA.name+"'s abilities are raised";
            monsterA.attack = monsterA.attack * 1.2;
            monsterA.defence = monsterA.defence * 1.2;
            monsterA.speed = monsterA.speed * 1.2;
            break;
        case "dp":
            document.getElementById("Process").innerHTML += "<br>"+monsterA.skill[i][j]+"'s power is doubled";
            monsterA.skill[i][j] = monsterA.skill[i][j]*2;
            break;
        case "dw":
            document.getElementById("Process").innerHTML += "<br>"+monsterA.name+" dives into the water";
            monsterA.status = "diving";
            break;
        case "fs":
            document.getElementById("Process").innerHTML += "<br>"+monsterA.name+" flies into the sky";
            monsterA.status = "flying";
            break;
        case "hp":
            document.getElementById("Process").innerHTML += "<br>"+monsterA.name+" absorbs health from "+monsterB.name;
            monsterA.HP += Math.floor(0.5*(monsterA.attack/monsterB.defence)*skillBook[i][j].power/(monsterB.level/monsterA.level));
            break;
    }
}

function setSkill(monster,skillPosi,type,skillNum){
    monster.skill[skillPosi] = skillBook[type][skillNum];
}

function wildSkill10(monster){
    var pickNormal = Math.floor(Math.random()*(monster.level/7+1)); 
    var equal1 = (monster.skill[1] === monster.skill[0]);
    var stop = true;
    setSkill(monster,0,0,pickNormal);
    setSkill(monster,1,0,pickNormal);
    while(equal1 && stop){
        pickNormal = Math.floor(Math.random()*(monster.level/7+1)); 
        setSkill(monster,1,0,pickNormal);
        equal1 = (monster.skill[1] === monster.skill[0]);
    }
}

function wildSkill20(monster){
    var pickNormal = Math.floor(Math.random()*(monster.level/7+1));
    var pickType = Math.floor(Math.random()*(monster.level/15));
    var equal2 = (monster.skill[0] === monster.skill[2] || monster.skill[1] === monster.skill[2]);
    wildSkill10(monster);
    var chance = Math.random();
    if(chance < 0.5){
        setSkill(monster,2,0,pickNormal);
        while(equal2){
            pickNormal = Math.floor(Math.random()*(monster.level/7+1)); 
            setSkill(monster,2,0,pickNormal);
            equal2 = (monster.skill[0] === monster.skill[2] || monster.skill[1] === monster.skill[2]);
        }
    }
    else{
        var type = checkType(monster);
        setSkill(monster,2,type,pickType);
        while(equal2){
            pickType = Math.floor(Math.random()*(monster.level/15));
            setSkill(monster,2,type,pickType);
            equal2 = (monster.skill[0] === monster.skill[2] || monster.skill[1] === monster.skill[2]);
        }
    }
}

function wildSkill100(monster){
    var pickType = Math.floor(Math.random()*(monster.level/15));
    var equal3 = (monster.skill[0] === monster.skill[3] || monster.skill[1] === monster.skill[3] ||monster.skill[2] === monster.skill[3]);
    wildSkill20(monster);
    var type = checkType(monster);
    setSkill(monster,3,type,pickType);
    while(equal3){
        pickType = Math.floor(Math.random()*(monster.level/15));
        setSkill(monster,3,type,pickType);
        equal3 = (monster.skill[0] === monster.skill[3] || monster.skill[1] === monster.skill[3] ||monster.skill[2] === monster.skill[3]);
    }
}

function wildSkill(monster){
    if(monster.level < 11){
        wildSkill10(monster);
    }
    else if(monster.level < 21){
        wildSkill20(monster);
    }
    else{
        wildSkill100(monster);
    }
}

function levelUpSkill(monster){
    var chance = Math.random();
    var randomSkill;
    var learned = true;
    if(chance > monster.level/70){
        while(learned){
            var pickNormal = Math.floor(Math.random()*(monster.level/7+1));
            randomSkill = skillBook[0][pickNormal];
            for(var i = 0; i < 4; i++){
                console.log(randomSkill);
                if(monster.skill[i].identifier === randomSkill.identifier){
                    learned = true;
                }
                else{
                    learned = false;
                    function learnSkill(pickPosi){
                        var oldSkill = monster.skill[pickPosi].identifier;
                        setSkill(monster,pickPosi,0,pickNormal);
                        typewriter.print(monster.name+" forgets "+oldSkill+" and...");
                        typewriter.print(" has learned "+monster.skill[pickPosi].identifier+".");
                        returnToMap();
                    }
                    selections = [
                        {
                            name: monster.name+" wants to learn "+randomSkill.identifier+"<br>Type:"+randomSkill.type+"  Power:"+randomSkill.power+"  PP:"+randomSkill.pp+"/"+randomSkill.dpp
                        }
                    ];
                    for(var j = 1; j <= monster.skill.length; j++){
                        selections[j] = {
                            name: monster.skill[j-1].identifier+"  Type:"+monster.skill[j-1].type+"  Power:"+monster.skill[j-1].power+"  PP:"+monster.skill[j-1].pp+"/"+monster.skill[j-1].dpp,
                            skill: j-1,
                            func: function(){learnSkill(this.skill)}
                        }
                    }
                    var giveUp = {
                        name: "give up this skill",
                        func: function(){
                            typewriter.print(monster.name+" give up this skill");
                            returnToMap()
                        }
                    }
                    selections.push(giveUp);
                    i = 4;
                    selected = 0;
                    createList();
                }
            }
        }
    }
    else{
        var type = checkType(monster);
        while(learned){
            var pickType = Math.floor(Math.random()*(monster.level/15));
            randomSkill = skillBook[type][pickType];
            for(var i = 0; i < 4; i++){
                console.log(randomSkill);
                if(monster.skill[i].identifier === randomSkill.identifier){
                    learned = true;
                }
                else{
                    learned = false;
                    function learnSkill(pickPosi){
                        var oldSkill = monster.skill[pickPosi].identifier;
                        setSkill(monster,pickPosi,type,pickType);
                        typewriter.print(monster.name+" forgets "+oldSkill+" and...");
                        typewriter.print(" has learned "+monster.skill[pickPosi].identifier+".");
                        returnToMap();
                    }
                    selections = [
                        {
                            name: monster.name+" wants to learn "+randomSkill.identifier+"  Type:"+randomSkill.type+"  Power:"+randomSkill.power+"  PP:"+randomSkill.dpp
                        }
                    ];
                    for(var j = 1; j <= monster.skill.length; j++){
                        selections[j] = {
                            name: monster.skill[j-1].identifier+"  Type:"+monster.skill[j-1].type+"  Power:"+monster.skill[j-1].power+"  PP:"+monster.skill[j-1].pp+"/"+monster.skill[j-1].dpp,
                            skill: j-1,
                            func: function(){learnSkill(this.skill)}
                        }
                    }
                    var giveUp = {
                        name: "give up this skill",
                        func: function(){
                            typewriter.print(monster.name+" give up this skill");
                            returnToMap()
                        }
                    }
                    selections.push(giveUp);
                    i = 4;
                    selected = 0;
                    createList();
                }
            }
        }
    }
    
}

function pickSkillString(monster,randomSkill){
    var string = monster.name+" wants to learn "+randomSkill.identifier+"  Type:"+randomSkill.type+"  Power:"+randomSkill.power+"  PP:"+randomSkill.dpp+"<br>Replace Skills?<br>";
    for(var i = 0; i < 4; i++){
        string += i+1+":"+monster.skill[i].identifier+"  Type:"+monster.skill[i].type+"  Power:"+monster.skill[i].power+"  PP:"+monster.skill[i].dpp+"<br>";
    }
    string += "0:Give up this new skill";
    return string;
}

function checkType(obj){
    switch(obj.type){
        case "normal":
            return 0;
            break;
        case "rock":
            return 1;
            break;
        case "water":
            return 2;
            break;
        case "fire":
            return 3;
            break;
        case "grass":
            return 4;
            break;
        case "bug":
            return 5;
            break;
        case "flying":
            return 6;
            break;
        case "electric":
            return 7;
            break;
    }
}


//Shop
function shopping(){
    updateMoney();
    selections = [
        {
            name: "Buy",
            func: function(){buying()}
        },
        {
            name: "Sell",
            func: function(){selling()}
        }
    ];
    var back = {
        name: "Exit",
        func: function(){returnToMap()}
    }
    selections.push(back);
    selected = 0;
    createList();
}

function updateMoney(){
    document.getElementById("myMoney").innerHTML = "$"+myMoney;
}

function buying(){
    function deal(i){
        if(myMoney > itemBook[i].price){
            var match = false;
            var posi;
            for(var j = 0; j < myBag.length; j++){
                if(myBag[j].name === itemBook[i].name){
                    match = true;
                    posi = j
                    myBag[j].quantity++;
                }
            }
            if(match){
                typewriter.print("You bought 1 "+itemBook[i].name+". You have "+myBag[posi].quantity+" "+myBag[posi].name+"s in your backpack now.");
            }
            else{
                typewriter.print("You bought 1 "+itemBook[i].name+".");
                myBag.push(itemBook[i]);
            }
            myMoney -= itemBook[i].price;
        }
        else{
            typewriter.print("You can't afford "+itemBook[i].name+".");
        }
        updateMoney();
    }
    selections = [];
    for(var i = 0; i < itemBook.length; i++){
        selections[i] = {
            name: itemBook[i].name+" -- $"+itemBook[i].price,
            item: i,
            func: function(){deal(this.item)}
        }
    }
    var back = {
        name: "Exit",
        func: function(){returnToMap()}
    }
    selections.push(back);
    selected = 0;
    createList();
}

function selling(){
    function deal(i){
        myBag[i].quantity --;
        myMoney += myBag[i].price/2;
        typewriter.print("You sold 1 "+myBag[i].name+". You have "+myBag[i].quantity+" "+myBag[i].name+"s left in your backpack.");
        if(myBag[i].quantity < 1){
            myBag.splice(i,1);
        }
        updateMoney();
        selling();
    }
    selections = [];
    for(var i = 0; i < myBag.length; i++){
        selections[i] = {
            name: myBag[i].name+"x"+myBag[i].quantity+" -- $"+myBag[i].price/2,
            item: i,
            func: function(){deal(this.item)}
        }
    }
    var back = {
        name: "Exit",
        func: function(){returnToMap()}
    }
    selections.push(back);
    selected = 0;
    createList();
}

//Menu
function callMenu(){
    selections = [
        {
            name: "Pokemons",
            func: function(){callPokemons()}
        },
        {
            name: "Backpack",
            func: function(){callBag()}
        },
        {
            name: "Trainer",
            func: function(){callTrainer()}
        },
        {
            name: "Back",
            func: function(){returnToMap()}
        }
    ];
    selected = 0;
    createList();
}

function callPokemons(){
    console.log(999);
    selections = [];
    for (var i = 0; i < myMonster.length; i++){
        selections[i] = {
            name: myMonster[i].name,
            num: i,
            func: function(){pokemonDetail(this.num)}
        }
    }
    var back = {
        name: "back",
        func: function(){callMenu()}
    }
    selections.push(back);
    selected = 0;
    createList();
}

function pokemonDetail(i){
    function pokemonDetail1(){
        selections = [
            {
                name: myMonster[i].name+"<br> Type:"+myMonster[i].type+"<br> HP:"+myMonster[i].HP+"/"+myMonster[i].data.dHP+"<br> Lv."+myMonster[i].level+"<br> Exp."+myMonster[i].experience+"/"+Number(myMonster[i].level*myMonster[i].level)+"<br> Status:"+myMonster[i].status
            },
            {
                name: "back",
                func: function(){pokemonDetail(i)}
            }
        ];
        selected = 0;
        createList();
    }
    function pokemonDetail2(){
        selections = [
            {
                name: myMonster[i].name+"<br> Lv."+myMonster[i].level+"<br> Attack"+myMonster[i].attack+"<br> Defence"+myMonster[i].defence+"<br> Speed"+myMonster[i].speed
            },
            {
                name: "back",
                func: function(){pokemonDetail(i)}
            }
        ];
        selected = 0;
        createList();
    }
    function pokemonDetail3(){
        var string = "";
        console.log(myMonster[i].skill.length);
        for(var j = 0; j < myMonster[i].skill.length; j++){
            string += "<br>"+myMonster[i].skill[j].identifier+"  pp:"+myMonster[i].skill[j].pp+"/"+myMonster[i].skill[j].dpp+"  Power:"+myMonster[i].skill[j].power+"  Accuracy:"+myMonster[i].skill[j].accruacy;
        }
        selections = [
            {
                name: myMonster[i].name+"  Type:"+myMonster[i].type+string
            },
            {
                name: "back",
                func: function(){pokemonDetail(i)}
            }
        ];
        selected = 0;
        createList();
    }
    selections = [
        {
            name: "basic information",
            func: function(){pokemonDetail1()}
        },
        {
            name: "pokemon data",
            func: function(){pokemonDetail2()}
        },
        {
            name: "skill information",
            func: function(){pokemonDetail3()}
        },
        {
            name: "back",
            func: function(){callMenu()}
        }
    ];
    selected = 0;
    createList();
}

function callBag(){
    selections = [];
    for(var i = 0; i < myBag.length; i++){
        selections[i] = {
            name: myBag[i].name+"x"+myBag[i].quantity
        }
    }
    var back = {
        name: "back",
        func: function(){callMenu()}
    }
    selections.push(back);
    selected = 0;
    createList();
}

function callTrainer(){
    selections = [
        {
            name: "Number of Pokemons:"+myMonster.length
        },
        {
            name: "Money:"+myMoney
        },
        {
            name: "back",
            func: function(){callMenu()}
        }
    ];
    selected = 0;
    createList();
}


//Item
function itemReactor(itemNum,monsterA,wildMonster){
    console.log(610);
    if(myBag[itemNum].type === "ball"){
        switch(myBag[itemNum].name){
            case "poke ball":
                catchMonster(wildMonster,20);
                myBag[itemNum].quantity --;
                break;
            case "great ball":
                catchMonster(wildMonster,40);
                myBag[itemNum].quantity --;
                break;
            case "ultra ball":
                catchMonster(wildMonster,60);
                myBag[itemNum].quantity --;
                break;
            case "master ball":
                catchMonster(wildMonster,10000);
                myBag[itemNum].quantity --;
                break;
        }
    }
    else if(myBag[itemNum].type === "healing"){
        switch(myBag[itemNum].name){
            case "potion":
                restoreHP(20,false,itemNum);
                break;
            case "super potion":
                restoreHP(50,false,itemNum);
                break;
            case "hyper potion":
                restoreHP(200,false,itemNum);
                break;
            case "max potion":
                restoreHP(10000,false,itemNum);
                break;
            case "full restore":
                restoreHP(10000,true,itemNum);
                break;
        }
        
    }
    else if(myBag[itemNum].type === "revival"){
        switch(myBag[itemNum].name){
            case "revive":
                reviveMonster(0.5,itemNum);
                break;
            case "max revive":
                reviveMonster(1,itemNum);
                break;
        }
    }
    else if(myBag[itemNum].type === "status cures"){
        switch(myBag[itemNum].name){
            case "awakening":
                statusCures("sleep",itemNum);
                break;
            case "burn heal":
                statusCures("burn",itemNum);
                break;
            case "paralyze heal":
                statusCures("paralysis",itemNum);
                break;
            case "full heal":
                statusCures("full",itemNum);
                break;
        }
    }
}

function catchMonster(wildMonster,top){
    var chance = top*Math.random()*0.8/wildMonster.level*(1+0.01*wildMonster.data.dHP/wildMonster.HP);
    console.log(chance);
    if(wildMonster.status !== "none"){
        chance = chance*1.2;
    }
    if(chance > 0.5){
        wildMonster.x = -64;
        wildMonster.y = 60;
        myMonster.push(wildMonster);
        document.getElementById("Process").innerHTML += "<br>you get "+wildMonster.name+"!!";
        selections = [];
        selections[0] = {
            name: "Battle ends. Return to world.(actually starts a new fight)",
            func: function(){
                document.getElementById("Process").innerHTML = "";
                returnToMap();
            }
        }

        selected = 0;
        createList();
    }
    else{
        document.getElementById("Process").innerHTML += "<br>you almost get it";
        turn(monsterA,wildMonster);
    }
}

function restoreHP(restore,status,itemNum){
    console.log(612);
    function restoreHealth(input){
        console.log(620);
        if(input === myMonster.length){
            playerOpenBackpack(monsterA,monsterB,monsterA.check());
        }
        else{
            if(myMonster[input].HP < 1){
                restoreHP(restore,status,itemNum);
            }
            else{
                console.log(621);
                myMonster[input].HP += restore;
                if(myMonster[input].HP > myMonster[input].data.dHP){
                    myMonster[input].HP = myMonster[input].data.dHP;
                }
                if(status){
                    myMonster[input].status = "none";
                }
                myBag[itemNum].quantity --;
                document.getElementById("Process").innerHTML += "<br>you use "+myBag[itemNum].name+" restoring "+restore+" HP to "+monsterA.name;
            }
            turn(monsterA,monsterB);
        }
    }
    selections = [];
    for(var i = 0; i < myMonster.length; i++){
        selections[i] = {
            name: myMonster[i].name+"  HP:"+myMonster[i].HP+"/"+myMonster[i].data.dHP+"  Status:"+myMonster[i].status+"  Skills:"+myMonster[i].skill[0].identifier+" "+myMonster[i].skill[1].identifier+" "+myMonster[i].skill[2].identifier+" "+myMonster[i].skill[3].identifier,
            monster: i,
            func: function(){restoreHealth(this.monster)}
        }
    }
    var back = {
        name: "back",
        func: function(){restoreHealth(myMonster.length)}
    }
    selections.push(back);
    console.log(selections);

    selected = 0;
    createList();
}

function reviveMonster(restore,itemNum){
    function revive(input){
        if(input === myMonster.length){
            playerOpenBackpack(monsterA,monsterB,monsterA.check());
        }
        else{
            if(myMonster[input].HP !== 0){
                reviveMonster(restore,itemNum)
            }
            else{
                myMonster[input].HP = Math.ceil(restore*myMonster[input].data.dHP);
                myBag[itemNum].quantity --;
                document.getElementById("Process").innerHTML += "<br>you use "+myBag[itemNum].name+" reviving "+restore*myMonster[input].data.dHPstore+" HP to "+monsterA.name;
            }
        }
        turn(monsterA,monsterB);
    }
    selections = [];
    for(var i = 0; i < myMonster.length; i++){
        selections[i] = {
            name: myMonster[i].name+"  HP:"+myMonster[i].HP+"/"+myMonster[i].data.dHP+"  Status:"+myMonster[i].status+"  Skills:"+myMonster[i].skill[0].identifier+" "+myMonster[i].skill[1].identifier+" "+myMonster[i].skill[2].identifier+" "+myMonster[i].skill[3].identifier,
            monster: i,
            func: function(){revive(this.monster)}
        }
    }
    var back = {
        name: "back",
        func: function(){revive(myMonster.length)}
    }
    selections.push(back);

    selected = 0;
    createList();
}

function statusCures(status,itemNum){
    function cures(input){
        if(input === myMonster.length){
            playerOpenBackpack(monsterA,monsterB,monsterA.check());
        }
        else{
            if(myMonster[input].status === status){
                myMonster[input].status = "none";
                myBag[itemNum].quantity --;
                document.getElementById("Process").innerHTML += "<br>you use "+myBag[itemNum].name+" curing "+myMonster[input].status+" on "+monsterA.name;
            }
            else if(myMonster[input].status !== "none" && status === "full"){
                myMonster[input].status = "none";
                myBag[itemNum].quantity --;
                document.getElementById("Process").innerHTML += "<br>you use "+myBag[itemNum].name+" curing "+myMonster[input].status+" on "+monsterA.name;
            }
            else{
                statusCures(status,itemNum);
            }
        }
        turn(monsterA,monsterB);
    }
    selections = [];
    for(var i = 0; i < myMonster.length; i++){
        selections[i] = {
            name: myMonster[i].name+"  HP:"+myMonster[i].HP+"/"+myMonster[i].data.dHP+"  Status:"+myMonster[i].status+"  Skills:"+myMonster[i].skill[0].identifier+" "+myMonster[i].skill[1].identifier+" "+myMonster[i].skill[2].identifier+" "+myMonster[i].skill[3].identifier,
            monster: i,
            func: function(){cures(this.monster)}
        }
    }
    var back = {
        name: "back",
        func: function(){cures(myMonster.length)}
    }
    selections.push(back);

    selected = 0;
    createList();
}

//Other
function levelUp(monster){
    typewriter.print(monster.name + " Level Up!!!");
    monster.experience = Number(monster.experience - monster.level);
    monster.level ++;
    monster.data.dHP = Math.ceil(Number(monster.data.dHP*1.05));
    monster.data.dAttack = Math.ceil(Number(monster.data.dAttack*1.03));
    monster.data.dDefence = Math.ceil(Number(monster.data.dDefence*1.03));
    monster.data.dSpeed = Math.ceil(Number(monster.data.dSpeed*1.03));
    var skillChance = Math.random();
    if(skillChance < 1){
        levelUpSkill(monster);
    }
}

function hospital(){
    for(var i = 0; i < myMonster.length; i++){
        myMonster[i].HP = myMonster[i].data.dHP;
        myMonster[i].attack = myMonster[i].data.dAttack;
        myMonster[i].defence = myMonster[i].data.dDefence;
        myMonster[i].speed = myMonster[i].data.dSpeed;
        myMonster[i].status = myMonster[i].data.dStatus;
        for(var j = 0; j < 4; j++){
            myMonster[i].skill[j].pp = myMonster[i].skill[j].dpp;
            myMonster[i].skill[j].accruacy = myMonster[i].skill[j].dAccruacy;
        }
    }
}


//Create random monster
function mGenerator(type,level){
    var wrongType = true;
    while(wrongType){
        var randomNum = Math.floor(Math.random()*monsterBook.length);
        if(monsterBook[randomNum].type === type){
            wrongType = false;
        }
    }
//    console.log(monsterBook[randomNum]);
    var wildMonster = new addMB(monsterBook[randomNum].No,monsterBook[randomNum].name,monsterBook[randomNum].type,monsterBook[randomNum].level,monsterBook[randomNum].experience,monsterBook[randomNum].HP,monsterBook[randomNum].attack,monsterBook[randomNum].defence,monsterBook[randomNum].speed,monsterBook[randomNum].status);
    wildMonster.level = level;
    var multiple = Math.random()/5 + 0.9;
    wildMonster.experience = Math.ceil(level*level*multiple/5);
    wildMonster.data.dHP = Math.ceil(wildMonster.data.dHP * level/50 + 20);
    wildMonster.HP = wildMonster.data.dHP;
//    console.log(wildMonster);
    wildSkill(wildMonster);
    return wildMonster;
}

function returnToMap(){
    document.onkeydown = mapKeyDown;
    document.onkeyup = mapKeyUp;
    document.getElementById("pane").classList.remove("fight");
    document.getElementById("selector").classList.add("hidden");
    document.getElementById("money").classList.add("hidden");
    selections = [];
    inFight = false;
    setTimeout(update,100);
}

var a1 = mGenerator("fire",50);
var a2 = mGenerator("normal",40);
var a3 = mGenerator("rock",50);
var a4 = mGenerator("grass",50);
var a5 = mGenerator("grass",30);
var a6 = mGenerator("grass",30);
myMonster = [a1,a2,a3,a4];//,a4,a5,a6];
for(var i = 0; i < myMonster.length; i++){
    myMonster[i].x = -64;
    myMonster[i].y = 60;
}
//Status list: paralysis, sleep, burn, confusion
