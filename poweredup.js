var PoweredUp = function(){
	this.device = null;
	this.connected = false;
	this.server = null;
	this.service = null;
	this.serviceID = '00001623-1212-efde-1623-785feabcd123';
	this.characteristic = null;

	this.connect = function(){
		var self = this;
		return new Promise(async function(resolve, reject){
            try {
    			self.device = await navigator.bluetooth.requestDevice({
        			filters: [],
        			optionalServices: [
        				self.serviceID.toString()
        			]
    			});

				self.connected = true;
				log("Connected: "+self.connected);

				self.device.addEventListener('gattserverdisconnected', self.disconnect.bind(self));

				log("Awaiting GATT connection...");

				self.server = await self.device.gatt.connect();

				log(self.server)
				//self.service = await self.server.getPrimaryService(self.serviceID);
				//sef.characteristic = await service.getCharacteristic('00001624-1212-efde-1623-785feabcd123');

                resolve();
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
