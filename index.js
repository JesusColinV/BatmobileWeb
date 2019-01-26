var emulateState = false;
var lightsState = false;

/* Keyboard events */
var lastKey = null;
var turn = false;

var batmobile = new PoweredUp();

/* Connect to device */
document.getElementById('connect').addEventListener('click', function(e){
	batmobile.connect().then(function(device){
		log("[INFO] Paired with "+batmobile.device.name)
	}, function(err){
		log("[ERROR] Connection Failed..")
	})
});


/* Handle commands */
function executeCommand(value) {
	var turn = document.getElementById('turn').checked;

	if(!batmobile.isConnected()){
		log("[ERROR] Batmobile lost connection!")
		return;
	}

    switch (value) {
        case 'forward':
			batmobile.drive(
				126, -126
			);
			break;
        case 'reverse':
			batmobile.drive(
				-126, 126
			);
			break;
        case 'right':
        	batmobile.drive(
				turn ? -126 : 30, -126
			);
			break;
        case 'left':
			batmobile.drive(
				126, turn ? 126 : -30
			);
			break;
        case 'stop':
			batmobile.stop()
			break;
		default:
			log("[ERROR] Invalid command "+value)
			return;
    }
}
