var emulateState = false;
var lightsState = false;

/* Keyboard events */
var lastKey = null;
var turn = false;

var batmobile = new PoweredUp();

var keyCodes = {
	"left_forward":[87],
	"left_back":[83],
	"right_forward":[73],
	"right_back":[75]
}
var keyFunctions = {
	"left_forward":{
		"active":batmobile.motors.drive("left",127),
		"inactive":batmobile.motors.drive("left",0)
	},
	"left_back":{
		"active":batmobile.motors.drive("left",-127),
		"inactive":batmobile.motors.drive("left",0)
	},
	"right_forward":{
		"active":batmobile.motors.drive("right",127),
		"inactive":batmobile.motors.drive("right",0)
	},
	"right_back":{
		"active":batmobile.motors.drive("right",-127),
		"inactive":batmobile.motors.drive("right",0)
	}
}

var keyEvents = {}
for(var _i in keyCodes){

}

/* Connect to device */
document.getElementById('connect').addEventListener('click', function(e){
	batmobile.connect().then(function(device){
		log("[INFO] Paired with "+batmobile.device.name)
	}, function(err){
		log("[ERROR] Connection Failed..")
	})
});

document.addEventListener("keydown", function(event){

})

document.addEventListener("keyup", function(event){

})
