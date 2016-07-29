function TypeWriter(id) {
    this.el = document.getElementById(id);
    this.delay = 66;
    this.printChar = function(){
        if(this.msg[this.msgIndex] === "\n"){
            this.el.innerHTML += "<br>"    
        } else {
            this.el.innerHTML += this.msg[this.msgIndex];
        }
        this.msgIndex += 1;
        if (this.msgIndex%100 === 0){ //next break?
            var _this = this;
            document.onkeydown = function(){
                _this.el.innerHTML = "";
                document.onkeydown = function(){ _this.delay = 10; } // speed up text
                _this.printChar();
            }
        } else if(this.msgIndex < this.msg.length){
            var _this = this;
            clearTimeout(this.cid);
            this.cid = setTimeout(function() { _this.printChar()}, this.delay);
        } else {
            var _this = this;
            document.onkeydown = function(){
                _this.el.classList.add("hidden");
                //restore keyboard events
                console.log(inFight+ " "+_this.message);
                if(inFight){
                    document.onkeydown = fightKeyDown;
                    document.onkeyup = fightKeyUp;
                }
                document.onkeydown = _this.oldKeyDown;
                document.onkeyup = _this.oldKeyUp;
                //proceed with next function
                if(typeof(_this.afterPrintFunction) === "function"){ 
                    _this.nextFunction();
                }
            };
        }
    }
    this.print = function(msg, func, faster){
        this.el.innerHTML = "";
        this.el.classList.remove("hidden");
        this.msg = msg;
        this.msgIndex = 0;
        this.printChar();
        this.nextFunction = func;

        // save keyboard events
        this.oldKeyDown = document.onkeydown;
        this.oldKeyUp = document.onkeyup;
        // add keyboard events
        var _this = this;
        document.onkeydown = function(){ _this.delay = faster ? 5 : 10; } // speed up text
        document.onkeyup = function(){  _this.delay = faster ? 10 : 66; } // return to normal speed
    }
    this.oldKeyDown;
    this.oldKeyUp;
}

var typewriter = new TypeWriter("typewriter");