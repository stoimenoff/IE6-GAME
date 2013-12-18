(function() {
//select the canvas
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
//some function that we will probably need :D
function getRandomInt (min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
//user width and height saved in vars (it isn't obvious :D)
var userWidth = 120;
var userHeight = 120;
//create object for the user
function User(x,y,speed,hitPower,hitPoints){
	//set object properties for x,y coordinate and speed
	this.x = x;
	this.y = y;
	//ti si shiban guz
	this.speed = speed;
	//some indicators
	this.canIJump = true;
	this.isShotFired = false;
	//will use this shits later :D
	this.hitPower = hitPower;
	this.hitPoints = hitPoints;
	//make draw function for the object, whick also clears the canvas after the img is loaded, but before drawing
	this.draw = function(ctx){
		var userimg = new Image();
		//save this to another varaible so that you can use it in the onload function
		var _this = this;
			userimg.onload = function(){
				ctx.beginPath();
				ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
				ctx.drawImage(userimg, _this.x, _this.y, userWidth, userHeight);
			};
			userimg.src = 'images/user.png';
	}
	//some movement functions
	this.moveRight = function(){
		this.x += this.speed;
	}
	this.moveLeft = function(){
		this.x -= this.speed;
	}
	this.jump = function(){
		//jump is activated so you can't jump again
		this.canIJump = false;
		//save this to another varaible so that you can use it in the timeout
		var _this = this;
		for(var i = 0; i < 30 ; i++){
			//go up
			setTimeout(function(){
				_this.y -= 4;
			},i*20);
			//go down after some seconds
			setTimeout(function(){
				_this.y += 4;
			},(i+30)*20);
		}
		//after the jump you can jump again
		setTimeout(function(){
			_this.canIJump = true;
		},1200);
	}
	//shoot a shot
	this.shoot = function(){
		//shot is fired and you can't shoot again before it leave the canvas
		this.isShotFired = true;
		//make shot visible and set the right coords and speed for it
		shot = new Shot(this.x + 80, this.y + 40, 2*this.speed, true);

	}
}
//set shot width and height
var shotWidth = 54;
var shotHeight = 18;
//create object for the shot
function Shot(x,y,speed,visibility){
	//set some shot properties
	this.x = x;
	this.y = y;
	this.speed = speed;
	//will use this visibility in order to not to show the shot when it isn't fired
	this.amIvisible = visibility;
	this.draw = function(ctx){
		//if it is visible (existing) draw it
		if(this.amIvisible){
			var shotimg = new Image();
			//save this to another varaible so that you can use it in the onload function
			var _this = this;
				shotimg.onload = function(){
					ctx.drawImage(shotimg, _this.x, _this.y, shotWidth, shotHeight);
				};
				shotimg.src = 'images/altf4.png';
		}
	}
	this.move = function(){
		//if it is visible (existing) move it
		if(this.amIvisible){
			this.x += speed;
		}
	}
}
/*add eventlistener
32 - space
37 - left
38- up
39 - right
40 - down
*/
var keysDown = [];
window.addEventListener("keydown", function(e) {
			//add the key to the keysDown array if it isn't there (indexOf used for that check) and if it is an arrow key or space
			if(((e.keyCode >= 37 && e.keyCode <=39) || e.keyCode == 32) && keysDown.indexOf(e.keyCode) == -1)
				keysDown.push(e.keyCode);
});
window.addEventListener("keyup", function(e) {
			if(e.keyCode >= 37 && e.keyCode <= 39 || e.keyCode == 32){
				//take the index of the key
				var index = keysDown.indexOf(e.keyCode);
				//remove it
				keysDown.splice(index,1);
			}
});

//create user object
var user = new User(0,ctx.canvas.height - userHeight,5,10,10);
//create shot
var shot = new Shot(0,ctx.canvas.height - userHeight,5,false);
//animation frame
function animationFrame(){
	//clear the canvas and draw the user
	user.draw(ctx);
	//draw shot
	shot.draw(ctx);
	//cache the keysDown array because you change it dynamicaly and shit things happen if you don't do this :D
	var cache = keysDown;
	//perform moves if some keys are down
	for(var i = 0; i < cache.length; i++){
		switch(cache[i]){
			case 37: {
				//left
				if(user.x >= user.speed)
					user.moveLeft();
				}
				break;
			case 39: {
				//right
				if(user.x <= ctx.canvas.width - userWidth - user.speed)
					user.moveRight();
				}
				break;
			case 38: {
				//up
				if(user.canIJump)
					user.jump();
			}
			break;
			case 32: {
				//space
				if(!user.isShotFired)
					user.shoot();
			}
			break;
		}
	}
	//move shot
	shot.move();
	//delete shot if it has left the canvas (make it not visible) and allow the user to shoot again
	if(shot.x >= ctx.canvas.width - shotWidth){
		shot.amIvisible = false;
		user.isShotFired = false;
	}
	//when the function is executed we make a request to execute it again
	requestAnimationFrame(animationFrame);
}
//start animation
requestAnimationFrame(animationFrame);

}())
