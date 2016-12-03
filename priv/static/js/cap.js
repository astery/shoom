function update_position(position, direction) {

}

Math.toRad = function(angle) {
	return angle/180*Math.PI;
}

function ready() {

	fps = 20;
	canvas = document.getElementById("game");
	ctx = canvas.getContext('2d');
	canvas.width  = 640;
	canvas.height  = 480;

	var Point = function (x,y) {
		this.x = x;
		this.y = y;
	}

	var CapturedArea = function () {
		this.border = [];
		this.isСlosed = false;
		this.isActive = true;

		this.checkToClose = function() {
     if (
     	!this.isСlosed && 
     	this.border.length > 5 && 
     	checkDistance(this.border[this.border.length - 1], this.border[0], 10)
     	) {
     		this.isСlosed = true;
     		console.log("close");
     }
		}

		this.draw = function() {
			if (this.border.length > 1) {

				ctx.fillStyle = "red";
				ctx.strokeStyle = "red";
				ctx.beginPath();
				ctx.moveTo(this.border[0].x, this.border[0].y);

				for (i = 1; i < this.border.length; i++) {
					ctx.lineTo(this.border[i].x, this.border[i].y);
				}

				if (!this.isСlosed) {
					ctx.stroke();
				}
				else {
					ctx.closePath();
					ctx.fill();
				}
			}
		}

		this.addPoint = function(point) {
			this.checkToClose();
			if (!this.isСlosed) {
				this.border.push(point);
			}
		}		
	}

	var Player = function() {
		this.STEPS_TO_POINT = 3;
		this.stepCounter = 0;
		this.area = new CapturedArea();

		this.size = 50;
		this.speed = 5;
		this.pos = new Point(100,100);
		this.lastCursorPos = new Point(this.pos.x, this.pos.y);
		this.currentXYVelocity = new Point(0, 0);

		this.movePlayer = function() {
			if (checkDistance(this.pos, this.lastCursorPos, 10))
				return;
			else {
				this.pos.x += this.currentXYVelocity.x;
				this.pos.y -= this.currentXYVelocity.y;

				if (this.stepCounter < this.STEPS_TO_POINT) {
					this.stepCounter += 1;
				}
				else {
					this.area.addPoint(new Point(this.pos.x,this.pos.y))
					this.stepCounter = 0;
				}
			}
		}

		this.draw = function(color = "#3f669f") {
			this.area.draw();
			ctx.fillStyle = color;
			ctx.fillRect(this.pos.x-this.size/2, this.pos.y-this.size/2, this.size, this.size);			
		}
	}

	var checkDistance = function(point1,point2,limit = 10) {
		if (point1 && point2) {
			if (
				point1.x - limit < point2.x &&
				point1.x + limit > point2.x &&
				point1.y - limit < point2.y &&
				point1.y + limit > point2.y
				)
				return true;
			else
				return false;
		}
		else 
			console.log("No points");
	}

	var getMousePos = function(e) {
		var rect = canvas.getBoundingClientRect();
		return {
			x: e.clientX - rect.left,
			y: e.clientY - rect.top
		};
	}

	var getPlayerAngle = function(e) {
		player.lastCursorPos = getMousePos(e);

		var x = player.lastCursorPos.x - player.pos.x;
		var y = player.lastCursorPos.y - player.pos.y;

		if(x==0) return (y>0) ? 180 : 0;
		var angle = Math.atan(y/x)*180/Math.PI;
		angle = (x > 0) ? angle+90 : angle+270;
		return angle;
	}

	var getXYvelocityFromAngle = function(angle) {
		return {
			x: player.speed*Math.sin(Math.toRad(angle)),
			y: player.speed*Math.cos(Math.toRad(angle))
		}
	}

	canvas.addEventListener('mousemove', function(e) {
		var angle = getPlayerAngle(e);
		player.currentXYVelocity = getXYvelocityFromAngle(angle);
	}, false);

	var clearScreen = function() {
		ctx.clearRect(0,0,canvas.width,canvas.height)
	}

	var update = function() {
		player.movePlayer();
		clearScreen();
		player.draw();
	}

	var player = new Player();

	setInterval(function(){
//		console.log("draw")
		update();
	},1000/fps);        
}

document.addEventListener("DOMContentLoaded", ready);
