
var Service, Characteristic;
var SerialPort = require('serialport');
var port = new SerialPort('/dev/ttyACM0',{baudRate:9600});
var lightStatus = false;

module.exports = function(homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    homebridge.registerAccessory('homebridge-serialportlight', 'serialportlight', light);
}

function light(log, config){
    this.log = log;
    this.name = config['name'];
    this.service = new Service.Switch(this.name);
    this.informationService = new Service.AccessoryInformation();

    this.service
        .getCharacteristic(Characteristic.On)
        .on('get', this.getOn.bind(this))
        .on('set', this.setOn.bind(this));
}

light.prototype.getServices = function(){
    return [this.service];
}

light.prototype.getOn = function(next){
    next(null, lightStatus);
}

light.prototype.setOn = function(on, next){
    // console.log("Set on function");
    if(on == true)
        port.write('1', function(err){
            if(err)
                return console.log("Error on write: ", err.message);
            lightStatus = true;
            console.log("[+] Message written: 1");
        });
    else if (on == false)
        port.write('0', function(err){
            if(err)
                return console.log("Error on write: ", err.message);
            lightStatus = false;
            console.log("[+] Message written: 0");
        });
    next(null);
}

