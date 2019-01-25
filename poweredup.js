var PoweredUp = function(){
	this.device = null;
	this.connected = false;
	this.server = null;
	this.service = null;
	this.serviceID = 'e0cbf06c-cd8b-4647-bb8a-263b43f0f974';
	this.characteristic = null;

/*
Bluetooth LE Device 90842b092e7f
Base Container ID: {1624ac60-7fca-5415-bfa4-f4797714efa2}
Class GUID: {e0cbf06c-cd8b-4647-bb8a-263b43f0f974}
Association Endpoint Address: 90:84:2b:09:2e:7f
*/

	this.connect = function(){
		var self = this;
		return new Promise(async function(resolve, reject){
            try {
    			self.device = await navigator.bluetooth.requestDevice({
        			/*"filters": [
						{ namePrefix: 'HUB' }
					],*/
					"acceptAllDevices":true,
        			"optionalServices": [
        				'battery_service',
						'e0cbf06c-cd8b-4647-bb8a-263b43f0f974'
        			]
    			});

				self.connected = true;
				log("Connected: "+self.connected);

				self.device.addEventListener('gattserverdisconnected', self.disconnect.bind(self));

				log("Awaiting GATT connection...");

				self.server = await self.device.gatt.connect();

				//self.service = await self.server.getPrimaryService(self.serviceID);
				//sef.characteristic = await service.getCharacteristic(self.serviceID);

                resolve(self.device);
    		}
    		catch(error) {
    			log('Could not connect! ' + error);
    			self.connected = false;

                reject();
    		}
        });
	};

	this.disconnect = function(){
		this.connected = false;
	}

	this.isConnected = function(){
		return this.connected;
	}
};

function log(msg){
	console.log(msg);
	document.getElementById("out").innerHTML += msg+"<br>"
}

function clearLogs(){
	document.getElementById("out").innerHTML = ""
}
