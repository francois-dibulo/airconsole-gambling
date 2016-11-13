var airconsole = new AirConsole();
var gambler = new Gambler(airconsole);

var current_amount_ele = $("#current_amount");
var transaction_devices_ele = $("#transaction_devices");
var deal_info_ele = $("#deals");

airconsole.onReady = function () {
  gambler.init();
};

airconsole.onConnect = function () {
  renderDevices();
};

airconsole.onDisconnect = function () {
  renderDevices();
};

function renderDevices() {
  transaction_devices_ele.empty();
  var controllers = airconsole.getControllerDeviceIds();
  for (var i = 0; i < controllers.length; i++) {
    var device_id = controllers[i];
    if (device_id === gambler.device_id) continue;
    var name = airconsole.getNickname(device_id);
    var item = $('<option value="' + device_id + '">' + name + '</option>');
    transaction_devices_ele.append(item);
  }
}

function renderDeals() {
  deal_info_ele.html(gambler.getDeals().length);
};

airconsole.onMessage = function (device_id, data) {
  gambler.onMessage(device_id, data);
};

airconsole.onCustomDeviceStateChange = function (device_id, data) {
  gambler.onCustomDeviceStateChange(device_id, data);

  var amount = gambler.getCurrentAmount();
  setAmount(amount);
  //
  renderDeals();
};

// -----------------------------------------------------------------

function setAmount(amount) {
  current_amount_ele.html(amount + " COINS");
}

$("#bet_button_rabbit").on('click', function() {
  if (!gambler.isRoundClosed()) {
    gambler.placeBet(100, "rabbit_wins");
  }
});

$("#bet_button_turtle").on('click', function() {
  if (!gambler.isRoundClosed()) {
    gambler.placeBet(100, "turtle_wins");
  }
});

$("#transfer_button").on('click', function() {
  var device_id = transaction_devices_ele.val();
  gambler.proposeDeal(100, parseInt(device_id, 10));
  //gambler.makeTransaction(100, device_id);
});
