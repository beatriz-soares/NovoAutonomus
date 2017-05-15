var SerialPort = require('serialport');
var EventEmitter = require('events');

module.exports = {
  init: function(options) {

    if (options === undefined) {
      options = {
        mode: 1
      };
    }

    module.exports.events = new EventEmitter();
    module.exports.mode = options.mode;
    module.exports.isOpened = false;
    module.exports.port = null;

    module.exports.portList(function(ports){
      ports.forEach(function(port) {
  			if (port.serialNumber === '1a86_USB2.0-Serial') {
  				module.exports.connect(port.comName);
  				return;
  			}
  	  });
    });
  },
  setMode: function(mode) {
    if (! this.isOpened) {
      this.events.emit('error', 'Porta inacessível');
      return;
    }
    if (mode == 2) {
      this.write('calibracao');
    }else{
      this.write('fim');
    }
    module.exports.mode = mode;
  },
  portList: function (callback) {
    SerialPort.list(function (err, ports) {
      if (err) {
        module.exports.events.emit('error', err);
      } else {
        callback(ports);
      }
  	});
  },
  connect: function (portName){
    if (module.exports.port != null){
        module.exports.port.close(function(){
        module.exports.open(portName);
      });
    }else{
      module.exports.open(portName);
    }
  },
  open: function (portName) {
    module.exports.port = new SerialPort.SerialPort(portName, { parser: SerialPort.parsers.readline('\n'), baudrate: 115200 });

    module.exports.port.open(function (err) {
      if (err) {
        module.exports.events.emit('error', err);
      }else{
        module.exports.events.emit('connect');
      }
    });

    // Verifica se a porta foi aberta
    module.exports.port.on('open', function() {
      // Verifica se o arduino enviou alguma informação
      module.exports.port.on('data', function (data) {
        if (data.trim() == 'Funfando') {
          module.exports.events.emit('arduino');
          module.exports.isOpened = true;
          if (module.exports.mode == 2) {
            module.exports.write('calibracao');
          }
        }else if (module.exports.mode == 2) {
					module.exports.events.emit('code', data);
				}else{
          module.exports.events.emit('data', data);
        }
      });
    });
  },
  write: function(data) {
    module.exports.port.write(data, function(){
      module.exports.events.emit('sent', data);
    });
  }
}
