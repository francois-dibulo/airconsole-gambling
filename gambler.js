/**
 * Gambler - include this in the controller.html
 * @constructor
 */
var Gambler = function(airconsole) {
  this.airconsole = airconsole;
  this.device_id = null;
  this.data = {
    current_amount: 0,
    bets: {},
    transactions: []
  };
  if (!this.airconsole) {
    throw "You have to pass the airconsole instance to the Gambler constructor!";
  }
};

Gambler.prototype.init = function() {
  this.device_id = this.airconsole.getDeviceId();
};

Gambler.prototype.onMessage = function(device_id, data) {

};

Gambler.prototype.onCustomDeviceStateChange = function(device_id, data) {
  // Screen updated its bank data
  if (device_id === AirConsole.SCREEN && data["bank"].devices[this.device_id]) {
    this.data = data["bank"];
  }
};

Gambler.prototype.isRoundClosed = function() {
  return this.getBankData.bets_locked;
};

Gambler.prototype.getBankData = function() {
  return this.data;
};

Gambler.prototype.getDeviceData = function() {
  return this.data.devices[this.device_id];
};


/**
 * Returns the current available amount for the gambler to spent
 * @param {Boolean} not_including_bets - Set to true if it should not include current bets
 */
Gambler.prototype.getCurrentAmount = function(not_including_bets) {
  var device_data = this.getDeviceData();
  var round_id = this.getBankData().bet_round_id;
  var current_bets = device_data.bets[round_id];
  var amount = device_data.current_amount;

  // Substract current bets
  if (current_bets && !not_including_bets) {
    for (var i = 0; i < current_bets.length; i++) {
      amount -= current_bets[i].amount;
    }
  }
  return amount;
};

Gambler.prototype.canPlaceBet = function(amount) {
  return this.getCurrentAmount() - amount >= 0;
};

Gambler.prototype.placeBet = function(amount, success_tag) {
  if (this.canPlaceBet(amount)) {
    this.airconsole.message(AirConsole.SCREEN, {
      action: AirConsoleAction.PLACE_BET,
      amount: amount,
      success_tag: success_tag
    });
  }
};

Gambler.prototype.makeTransaction = function(amount, receiver_id) {
  receiver_id = receiver_id || this.device_id;
  this.airconsole.message(AirConsole.SCREEN, {
    action: AirConsoleAction.MAKE_TRANSACTION,
    opts: {
      receiver_id: receiver_id,
      amount: amount,
      sender_id: this.device_id
    }
  });
};
