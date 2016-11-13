var airconsole = new AirConsole();
var bank = new Bank(airconsole, {
  mode: Bank.Mode.Winner_Takes_All,
  start_value: 2000
});

var bet_log_ele = $("#bet_log");
var bet_tags = ['turtle_wins', 'rabbit_wins'];

bet_log_ele.append('<li class="break">MODE: ' + bank.mode +  '</li>');

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// This is the function we execute when all bets have been placed.
// In your game it would be called after a round.
var choseRandomWinner = function() {
  var random_tag = bet_tags[getRandomInt(0, bet_tags.length - 1)];
  bet_log_ele.append('<li class="break">CHOOSING RANDOM WINNER: ' + random_tag +  '</li>');
  bank.evaluateRound([random_tag]);
  bank.openRound();
};

airconsole.onReady = function () {
  bank.init();
  bank.setTagQuota('turtle_wins', 1.5);
  bank.setTagQuota('rabbit_wins', 2);
};

airconsole.onMessage = function (device_id, data) {
  if (data.action === AirConsoleAction.PLACE_BET && !bank.isLocked()) {
    var quota = bank.getTagQuota(data.success_tag) || 1;
    bet_log_ele.append('<li>Bet: device_id[' + device_id + ']: ' + data.amount + ' Coins on: ' + data.success_tag + ' :: Quota ' + quota + '</li>');
  }
  bank.onMessage(device_id, data);
};

airconsole.onCustomDeviceStateChange = function (device_id, data) {
  bank.onCustomDeviceStateChange(device_id, data);
};

airconsole.onConnect = function(device_id) {
  bank.onConnect(device_id);
};

airconsole.onDisconnect = function(device_id) {
  bank.onDisconnect(device_id);
};

bank.onAllGamblersBet = function() {
  bet_log_ele.append('<li>Closing Round</li>');
  bank.closeRound();
  choseRandomWinner();
};
