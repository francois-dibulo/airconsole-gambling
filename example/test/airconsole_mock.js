var AirConsoleMock = function(opts) {
  opts = opts || {};
  this.device_ids = opts.device_ids || [2, 4, 5];
  this.custom_data = {};
};

AirConsoleMock.prototype.getControllerDeviceIds = function() {
  return this.device_ids;
};

AirConsoleMock.prototype.onMessage = function() {
};

AirConsoleMock.prototype.setCustomDeviceStateProperty = function(key, value) {
  this.custom_data[key] = value;
};

AirConsoleMock.prototype.getCustomDeviceState = function() {
  return this.custom_data;
};

