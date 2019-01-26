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
	"right_back":[75],
	"forward":[38],
	"backward":[40],
	"left":[37],
	"right":[39]
}
var keyFunctions = {
	"left_forward":{
		"drive": function(){
			batmobile.motors.drive("left",batmobile.motors.max_speed);
		},
		"stop":function(){
			batmobile.motors.drive("left",0);
		}
	},
	"left_back":{
		"drive": function(){
			batmobile.motors.drive("left",-batmobile.motors.max_speed);
		},
		"stop":function(){
			batmobile.motors.drive("left",0);
		}
	},
	"right_forward":{
		"drive": function(){
			batmobile.motors.drive("right",batmobile.motors.max_speed);
		},
		"stop":function(){
			batmobile.motors.drive("right",0);
		}
	},
	"right_back":{
		"drive": function(){
			batmobile.motors.drive("right",-batmobile.motors.max_speed);
		},
		"stop":function(){
			batmobile.motors.drive("right",0);
		}
	},

	"forward":{
		"drive": function(){
			batmobile.motors.drive("right",batmobile.motors.max_speed);
			batmobile.motors.drive("left",batmobile.motors.max_speed);
		},
		"stop":function(){
			batmobile.motors.stop();
		}
	},
	"backward":{
		"drive": function(){
			batmobile.motors.drive("right",batmobile.motors.max_speed);
			batmobile.motors.drive("left",batmobile.motors.max_speed);
		},
		"stop":function(){
			batmobile.motors.stop();
		}
	},
	"left":{
		"drive": function(){
			batmobile.motors.drive("right",batmobile.motors.max_speed);
			batmobile.motors.drive("left",-batmobile.motors.max_speed);
		},
		"stop":function(){
			batmobile.motors.stop();
		}
	},
	"right":{
		"drive": function(){
			batmobile.motors.drive("right",-batmobile.motors.max_speed);
			batmobile.motors.drive("left",batmobile.motors.max_speed);
		},
		"stop":function(){
			batmobile.motors.stop();
		}
	}
}

var keyEvents = {}
for(var _i in keyCodes){
	for(_j=0;_j<keyCodes[_i].length;_j++){
		keyEvents[keyCodes[_i][_j]] = Object.assign(
			keyFunctions[_i],
			{
				"name":_i,
				"active":false
			});
	}
}

function init(){
	/* Initialise Joysticks */
	var joyOpt = {
		"limitStickTravel":true,

	}
	var leftJoyOpt = {
		"container": document.getElementById("joystick1")
	};
	var rightJoyOpt = {
		"container": document.getElementById("joystick2")
	};

	var joysticks = {
		"left": new Joystick(Object.assign(joyOpt,leftJoyOpt)),
		"right": new Joystick(Object.assign(joyOpt,rightJoyOpt))
	}

	/* Connect to device */
	document.getElementById('connect').addEventListener('click', function(e){
		batmobile.connect().then(function(device){
			log("[INFO] Paired with "+batmobile.device.name)
		}, function(err){
			log("[ERROR] Connection Failed..")
		})
	});

	/* Disconnect from device */
	document.getElementById('disconnect').addEventListener('click', function(e){
		batmobile.disconnect();
	});

	document.addEventListener("keydown", function(event){
		var k = event.keyCode;

		if(keyEvents.hasOwnProperty(k)){
			if(!keyEvents[k].active && batmobile.isConnected()){
				keyEvents[k]["drive"]();
				keyEvents[k].active = true;

				log("[COMMAND] "+keyEvents[k]["name"].replaceAll("_"," ").toTitleCase());
			}
		}
	})

	document.addEventListener("keyup", function(event){
		var k = event.keyCode;

		if(keyEvents.hasOwnProperty(k) && batmobile.isConnected()){
			keyEvents[k]["stop"]();
			keyEvents[k].active = false;

			log("[COMMAND] Stop "+keyEvents[k]["name"].replaceAll("_"," ").toTitleCase()) //for logging purposes
		}
	})
}

document.addEventListener("DOMContentLoaded", init);

//MISC. FUNCTIONS AND PROTOTYPES
String.prototype.replaceAll = function (find, rep) {
    return this.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), rep);
};

String.prototype.toTitleCase = function() {
	var i, j, str, lowers, uppers;
	str = this.replace(/([^\W_]+[^\s-]*) */g, function(txt) {
	return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});

	// Certain minor words should be left lowercase unless
	// they are the first or last words in the string
	lowers = ['A', 'An', 'The', 'And', 'But', 'Or', 'For', 'Nor', 'As', 'At',
	'By', 'For', 'From', 'In', 'Into', 'Near', 'Of', 'On', 'Onto', 'To', 'With'];
	for (i = 0, j = lowers.length; i < j; i++)
	str = str.replace(new RegExp('\\s' + lowers[i] + '\\s', 'g'),
		function(txt) {
			return txt.toLowerCase();
		});

	// Certain words such as initialisms or acronyms should be left uppercase
	uppers = ['Id', 'Tv'];
	for (i = 0, j = uppers.length; i < j; i++)
	str = str.replace(new RegExp('\\b' + uppers[i] + '\\b', 'g'), uppers[i].toUpperCase());

	return str;
}
