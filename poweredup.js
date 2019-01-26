var PoweredUp = function(){
	this.device = null;
	this.connected = false;
	this.server = null;
	this.service = null;
	this.serviceID = "00001623-1212-efde-1623-785feabcd123";
	this.characteristicID = "00001624-1212-efde-1623-785feabcd123";
	this.characteristic = null;

	/*
	Bluetooth LE Device 90842b092e7f
	Base Container ID: {1624ac60-7fca-5415-bfa4-f4797714efa2}
	Class GUID: {e0cbf06c-cd8b-4647-bb8a-263b43f0f974}
	Association Endpoint Address: 90:84:2b:09:2e:7f

	** SNIFFED USING nRF Mobile:
	Service ID: 00001623-1212-efde-1623-785feabcd123
	Characteristic ID: 00001624-1212-efde-1623-785feabcd123
	*/

	this.connect = function(){
		var self = this;
		return new Promise(async function(resolve, reject){
            try{
				self.device = await navigator.bluetooth.requestDevice({
	    			"filters": [
						{ namePrefix: 'HUB' },
						{ services: [ self.serviceID ]}
					],
					//"acceptAllDevices":true,
	    			"optionalServices": [
	    				'battery_service',
						self.serviceID,
						"00001800-0000-1000-8000-00805f9b34fb"
	    			]
				});

				self.connected = true;

				self.device.addEventListener('gattserverdisconnected', self.disconnect.bind(self));
			} catch(e){
				log("[ERROR] "+e);
				return reject(e);
			}

			log("[INFO] Awaiting GATT connection...");

			//self.server = await self.device.gatt.connect();

			self.device.gatt.connect().then(function(server){
				log("[INFO] GATT Server Connected! Awaiting service...")

				self.server = server;

				server.getPrimaryService(self.serviceID).then(function(service){
					log("[INFO] Service connected! Awaiting characteristic...");

					self.service = service;

					service.getCharacteristic(self.characteristicID).then(function(characteristic){
						self.characteristic = characteristic;
						log("[INFO] Device connected!");
						resolve(self.device);
					}, function(e){
						log("[ERROR] "+e);
						return reject(e);
					})
				}, function(e){
					log("[ERROR] "+e);
					return reject(e);
				});
			}, function(e){
				log("[ERROR] "+e);
				return reject(e);
			})
        });
	};

	this.disconnect = function(){
		log("[INFO] Disconnected!")
		this.connected = false;
	}

	this.isConnected = function(){
		return this.connected;
	}

	/* FUNCTIONS FOR ROBOT CONTROL */
		//Drive function sends commands for the speeds of left and right motor.
	this.drive = function(left, right) {
		cmd = new Uint8Array([
			0x08, 0x00, 0x81, 0x39, 0x11, 0x02, left, right
		]);
		this.command.push(cmd);
	}

	this.stop = function(){
		this.drive(0,0)
	}

	this.command = {
		/* NOTE:
		* Command being sent is as an array. Send in the command 'head' first
		* i.e: [00,01] [02,03] [04,05] is sent as [00,01] then [02,03] then [04,05]
		* For JS arrays, when you 'push' and 'pop', you add and remove resp. from the *tail* of the array.
		* The command 'shift' is the one that removes from the *head* of the array. But each command does so in O(n) time (n being length of the array), so this is inefficient.
		* TODO: Consider using the more efficient Queue.js instead
		*/
		"queue":[],
		"active":false,
		"push":function(_cmd){
			var _i;
			/* //Note: command is an Array!
			for(_i=0;_i<_cmd.length;_i++){
				this.queue.push(_i)
			}
			*/
			queue.push(_cmd);
			if(!this.active) this.run()
		},
		"run":function(){
			//NOTE: this is refering to the 'command' object, not the global PoweredUp object.
			if(this.queue.length==0){
				this.active = false;
				return;
			}

			this.active = true;
			_that = this;
			this.characteristic.writeValue(this.queue.shift()).then(
				() => _that.run() //run the
			);
		}
	}
};

function log(msg){
	console.log(msg);
	document.getElementById("logs_out").innerHTML += msg+"<br>";
}

function clearLogs(){
	console.clear();
	document.getElementById("logs_out").innerHTML = "";
}
