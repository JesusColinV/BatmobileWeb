/* Debug */
var debug = false;

/* Keyboard events */
var lastKey = null;
var turn = false;

var batmobile = new PoweredUp();

var keyCodes = {
	"left_forward":[87],	//W
	"left_back":[83],		//S
	"right_forward":[73],	//I
	"right_back":[75],		//J
	"forward":[38],			//UP
	"backward":[40],		//DOWN
	"left":[37],			//LEFT
	"right":[39],			//RIGHT
	"stop":[32, 13]			//SPACE, ENTER
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
			batmobile.motors.drive("right",-batmobile.motors.max_speed);
			batmobile.motors.drive("left",-batmobile.motors.max_speed);
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
	},
	"stop":{
		"drive":function(){
			batmobile.motors.stop();
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

/* Joysticks */
var joysticks = {};
var joyOpt = {};
var joySize = 100;
var joyPadd = 35;

/* Motor Control */
var motors_ports = [ "left", "right", "both" ];

function init(){
	var i,j;

	/* Hide or show control instructions */
	if(touchScreenAvailable() || debug){
		/* Initialise Joysticks */
		var _dirs = ["left","right"]

		for(i=0;i<_dirs.length;i++){
			var _dir = _dirs[i];
			var containerEle = document.getElementById("joystick_"+_dir)

			joyOpt[_dir] = {
               zone: containerEle,
               mode: 'static',
               position: {
				   bottom: (joySize/2+joyPadd)+'px'
			   },
			   multitouch:true,
			   color: "lightblue",
               size: joySize,
			   lockY: true  // only move on the Y axis
           };

		   joyOpt[_dir].position[_dir] = (joySize/2+joyPadd)+'px'
		}

		joysticks = {
			"left": nipplejs.create(joyOpt.left),
			"right": nipplejs.create(joyOpt.right)
		}

		for(i=0;i<_dirs.length;i++){
			joysticks[_dirs[i]].on("move",function(e, data){
				_port = _dirs[e.target.id];
				_spd = data.distance/(joySize/2)*batmobile.motors.max_speed;
				_dir = (data.direction.y == "down")?-1:1;
				batmobile.motors.drive(_port, _dir*_spd, 0);
			})

			joysticks[_dirs[i]].on("end",function(e, data){
				_port = _dirs[e.target.id];
				batmobile.motors.drive(_port, 0, 0);
			})
		}
	}
	else{
		document.getElementById("controls-touch").style.display = "none";
		document.getElementById("joystick-container").style.display = "none";
	}

	if(isMobileAndTablet() && !debug){
		document.getElementById("controls-keyboard").style.display = "none";
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

	/* Motor Control */
	var inputEles = {
		"input_cpu_cycles": document.getElementById("input_cpu_cycles"),
		"input_speed": document.getElementById("input_speed")
	}

	for(var i=0;i<motors_ports.length;i++){
		document.getElementById("move_motor_"+motors_ports[i]).addEventListener("mouseup",function(e){
			var m_dir = e.target.id.split("_")[2];

			var cpu_cycles = parseInt(inputEles["input_cpu_cycles"].value);
			var speed = parseInt(inputEles["input_speed"].value);

			console.log(m_dir, cpu_cycles, speed);

			if(isNaN(cpu_cycles)) cpu_cycles = 0;
			if(isNaN(speed)) speed = batmobile.motors.max_speed;

			if(m_dir == "left" || m_dir == "both"){
				batmobile.motors.drive("left",speed, cpu_cycles);
			}
			if(m_dir == "right" || m_dir == "both"){
				batmobile.motors.drive("right",speed, cpu_cycles);
			}
		})
	}

	/* Key Events*/
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

			if(keyEvents[k]["name"] == "stop"){
				log("[COMMAND] Stop Motors!")
			} else
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

var touchScreenAvailable = function(){
	return ('ontouchstart' in window || navigator.msMaxTouchPoints)
}

var isMobile = function() {
	var check = false;
	(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
	return check;
};

var isMobileAndTablet = function() {
	var check = false;
	(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
	return check;
};
