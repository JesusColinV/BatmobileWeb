var PoweredUp = function(){
	this.device = null;
	this.connected = false;
	this.server = null;
	this.service = null;
	this.serviceID = "00001624-1212-efde-1623-785feabcd123";
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
            {//try {
    			self.device = await navigator.bluetooth.requestDevice({
        			"filters": [
						{ namePrefix: 'HUB' },
						{ services: ['00001624-1212-efde-1623-785feabcd123']}
					],
					//"acceptAllDevices":true,
        			"optionalServices": [
        				'battery_service'
        			]
    			});

				self.connected = true;

				self.device.addEventListener('gattserverdisconnected', self.disconnect.bind(self));

				log("Awaiting GATT connection...");

				//self.server = await self.device.gatt.connect();

				self.device.gatt.connect().then(function(server){
					log("GATT Server Connected! Awaiting service...")

					self.server = server;

					server.getPrimaryService(self.serviceID).then(function(service){
						log("Service connected! Awaiting characteristic...");

						self.service = service;

						service.getCharacteristic(self.serviceID).then(function(characteristic){
							self.characteristic = characteristic;
							log("All connected!");
						}, function(err){
							log("Failed to connect to characteristic: "+err);
						})
					}, function(err){
						log("Failed to connect to service: "+err);
					});
				}, function(err){
					log("Failed to connect to server: "+err);
				})

				/*
				log("GATT Connected. Awaiting connection to service...")
				log(self.server)

				self.service = await self.server.getPrimaryService(self.serviceID);

				log("Service Connected. Awaiting connection to characteristic...")
				log(self.service)

				sef.characteristic = await service.getCharacteristic(self.serviceID);
				log(self.characteristic)
				*/

                resolve(self.device);
    		}
    		/*catch(error) {
    			log('Could not connect! ' + error);
    			self.connected = false;

                reject();
    		}*/
        });
	};

	this.disconnect = function(){
		log("Disconnected!")
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
