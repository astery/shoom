function update_position(position, direction) {

}

function ready() {

	fps = 20;
	canvas = document.getElementById("game");
	ctx = canvas.getContext('2d');
	canvas.width  = 640;
	canvas.height  = 480;

	var sendData = function(directionType = "move", angle = 0, state = false) {
		channel.push("move", {angle: angle * (Math.pi/180), "keydown": state}, 10000)
	}

	var Player = function() {
		this.x = 100;
		this.y = 100;
		this.size = 50;
	}

	var keyListenerHash = function(keys,is_exclusive,angle) {
		var keyHash =	{
			"keys"          : keys,
			"is_exclusive"  : is_exclusive,
			"on_keydown"    : function(e) {
				sendData("move",angle,true);
			},
			"on_keyup"      : function(e) {
				sendData("move",angle,false);
			},
			"prevent_repeat": true,
			"prevent_default": true,
			"is_unordered": true,
			"is_solitary": true
		}
		return keyHash;
	}

	var listener = new window.keypress.Listener();

	var my_scope = this;
	var my_combos = listener.register_many([
		keyListenerHash("w", false, 0), 
		keyListenerHash("w d", false, 45), 
		keyListenerHash("d", false, 90), 
		keyListenerHash("d s", false, 135), 
		keyListenerHash("s", false, 180), 
		keyListenerHash("a s", false, 225), 
		keyListenerHash("a", false, 270), 
		keyListenerHash("w a", false, 315)
	]);
		
	Player.prototype.drawPlayer = function(color = "#3f669f") {
		ctx.fillStyle = color;
		ctx.fillRect(this.x-this.size/2, this.y-this.size/2, this.size, this.size);
	}

	var clearScreen = function() {
		ctx.clearRect(0,0,canvas.width,canvas.height)
	}

	var update = function() {
		clearScreen();
		player.drawPlayer();
	}

	var player = new Player();

	setInterval(function(){
//		console.log("draw")
		update();
	},1000/fps);        

	let socket = new Phoenix.Socket("ws://shoom.herokuapp.com/socket", {})
	socket.connect()
  channel = socket.channel("game", {nick: "nick" + Math.random()})
  channel.on("position", msg => console.log("Got message", msg) )
  channel.join()
    .receive("ok", ({messages}) => console.log("catching up", messages) )
    .receive("error", ({reason}) => console.log("failed join", reason) )
    .receive("timeout", () => console.log("Networking issue. Still waiting...") )
}

document.addEventListener("DOMContentLoaded", ready);
