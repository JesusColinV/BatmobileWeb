var emulateState = false;
var lightsState = false;

/* Keyboard events */
var lastKey = null;
var turn = false;

var batmobile = new PoweredUp();

/* Connect to device */
document.getElementById('connect').addEventListener('click', function(e){
	batmobile.connect().then(function(device){
		log(device+" "+batmobile.device);
		log("Finally connected to "+batmobile.device.name+" ("+batmobile.device.id+")")
		log("UUIDs: ")
		var uids = batmobile.device.uuids[0]
		for(i=0;i<uids.length;i++){
			log(i+": "+uids[i])
		}
	}, function(){
		log("Connection failed...")
	})
    log("Connected? "+c);
});


/* Handle commands */
function executeCommand(value) {
	let turn = document.getElementById('turn').checked;

    switch (value) {
        case 'forward':
			if (batmobile.isConnected()) {
				batmobile.drive(
					126, -126
				);
			}

			break;

        case 'reverse':
        	updateCommand('reverse');

			if (batmobile.isConnected()) {
            	batmobile.drive(
					-126, 126
				);
			}

			break;

        case 'right':
        	updateCommand('right');

			if (batmobile.isConnected()) {
            	batmobile.drive(
					turn ? -126 : 30, -126
				);
			}

			break;

        case 'left':
        	updateCommand('left');

			if (batmobile.isConnected()) {
            	batmobile.drive(
					126, turn ? 126 : -30
				);
			}

			break;

        case 'stop':
        	updateCommand();

			if (batmobile.isConnected()) {
            	batmobile.stop();
            }

			break;

    }
}
