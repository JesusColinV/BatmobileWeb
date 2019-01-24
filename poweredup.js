var PoweredUp = function(){
	this.connect = function(){
		return new Promise(async function(resolve, reject){
            try {
    			this.device = await navigator.bluetooth.requestDevice({
        			filters: [
        				{ namePrefix: 'HUB' }
        			],
        			optionalServices: [
        				'00001623-1212-efde-1623-785feabcd123'
        			]
    			});
    			_connected = true;

                resolve();
    		}
    		catch(error) {
    			log('Could not connect! ' + error);
    			_connected = false;

                reject();
    		}
        });
	}
};

function log(msg){
	console.log(msg);
	document.getElementById("out").innerHTML += msg+"<br>"
}
