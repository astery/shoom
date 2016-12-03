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

	var AreaPoint = function (x,y) {
		this.x = x;
		this.y = y;
	}

	var CapturedArea = function () {
		this.border = [];

		this.draw = function() {
			if (this.border.length > 1) {

				ctx.fillStyle = "red";
				ctx.beginPath();
				ctx.moveTo(this.border[0].x, this.border[0].y);

				for (i = 1; i < this.border.length; i++) {
					ctx.lineTo(this.border[i].x, this.border[i].y);
				}

				ctx.closePath();
				ctx.fill();

			}
		}

		this.addPoint = function(point) {
			this.border.push(point);
		}		
	}

	var Player = function() {
		this.STEPS_TO_POINT = 3;
		this.stepCounter = 0;
		this.area = new CapturedArea();

		this.x = 100;
		this.y = 100;
		this.size = 50;
		this.speed = 5;
		this.currentXYVelocity = {x: 0, y: 0};
		this.lastCursorPos = {x: this.x, y: this.y}

		this.movePlayer = function() {
			if (
				this.x - 10 < this.lastCursorPos.x &&
				this.x + 10 > this.lastCursorPos.x &&
				this.y - 10 < this.lastCursorPos.y &&
				this.y + 10 > this.lastCursorPos.y
				)
				return;
			else {
				this.x += this.currentXYVelocity.x;
				this.y -= this.currentXYVelocity.y;

				if (this.stepCounter < this.STEPS_TO_POINT) {
					this.stepCounter += 1;
				}
				else {
					this.area.addPoint(new AreaPoint(this.x,this.y))
					this.stepCounter = 0;
				}
			}
		}

		this.draw = function(color = "#3f669f") {
			this.area.draw();
			ctx.fillStyle = color;
			ctx.fillRect(this.x-this.size/2, this.y-this.size/2, this.size, this.size);			
		}
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

		var x = player.lastCursorPos.x - player.x;
		var y = player.lastCursorPos.y - player.y;

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
