# WebBluetooth Batmobile
Controlling the LEGO Batmobile (76122) with WebBluetooth API

Code will work for general PoweredUp and Boost motors as well

## What do I need?

- [LEGO App-Controlled Batmobile – Set 76122](https://www.lego.com/en-us/themes/dc-superheroes/products/app-controlled-batmobile-76112)
- A browser that supports WebBluetooth on your operating system

## References

Much of the bluetooth groundwork has been done by [JorgePe](https://github.com/JorgePe) in his [BOOST reverse engineering repo](https://github.com/JorgePe/BOOSTreveng)
Additional required bluetooth Data sniffed using [nrF Connect for Mobile](https://play.google.com/store/apps/details?id=no.nordicsemi.android.mcp&hl=en_SG)

Some code referenced from: https://github.com/BluetoothRocks/Batmobile

## How does this work?

The browser can connect to a Bluetooth LE device like the PowerFunctions Hub used by this particular Lego set. Each Bluetooth device has a number of services and characteristics. Think of them like objects with properties. Once connected to the device, the API then exposes these services and characteristics and you can read from and write to those characteristics.

The PowerFunctions Hub exposes a number of functions including the ability to change the direction and speed of the connected motors.

IMPORTANT NOTE: Browser (preferably Chrome) AND computer must support Bluetooth 4.0 Low Energy (LE). Buy a dongle otherwise. Also works on mobile phones with BLE support.

## So how does the steering work?

The Batmobile does not have a servo motor for steering, but instead it has two motors that directly drive the two tracks. To go forward or backwards you drive the two motors in the same direction. To steer you need to drive one of the motors forwards and the other one backwards or vice-versa. This is the same way a real life tank steers.

It gets a bit tricky because the motors are rotated 180° compared to each other, so if you need to go forward, you need to drive the one clockwise and the other one counter-clockwise. That will make sure they actually turn in the same direction. And for steering both motors need to turn clock-wise or counter-clockwise depending on the direction you want to go in. This makes sure the motors actually turn in the opposite general direction. It's a bit count-intuitive.
