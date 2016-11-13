This is a javascript AirConsole library to extend your game with gambling features.

You can assign every player an amount of start coins. Players can then bet on something
and earn or lose coins.

Player can also transfer coins to other players.

### How To

#### Including files:

Clone this repository into your project and add the following files:

ALSO check out the `/example` files

SCREEN:

```
<script type="text/javascript" src="https://www.airconsole.com/api/airconsole-1.6.0.js"></script>
<script type="text/javascript" src="airconsole-gambling/shared.js"></script>
<script type="text/javascript" src="airconsole-gambling/bank.js"></script>
```

CONTROLLER:

```
<script type="text/javascript" src="https://www.airconsole.com/api/airconsole-1.6.0.js"></script>
<script type="text/javascript" src="airconsole-gambling/shared.js"></script>
<script type="text/javascript" src="airconsole-gambling/gambler.js"></script>
```

#### The Bank (screen)

The screen is the bank. It receives and manages all transactions and bets.

##### Setup

```javascript
var airconsole = new AirConsole();
var bank = new Bank(airconsole, {
  // The bet-mode. If none set, default is: Bank.Mode.Default
  mode: Bank.Mode.Winner_Takes_All,
  // The inital amount of coins all devices should get on start
  start_value: 2000
});
```

There are currently two different modes:
  * Default: If you want players to place multiple bets and have a bet-quota.
  * Winner-Takes-All: If player can only bet on one thing.

```javascript
airconsole.onReady = function () {
  // Init the bank as soon as AirConsole is ready
  bank.init();
  // If you want to set certain quoats for your bet tags
  bank.setTagQuota('turtle_wins', 1);
  // If the rabbit wins, the player will get 2-times the amount of placed coins back
  bank.setTagQuota('rabbit_wins', 2);
};
```

Add the following methods to the airconsole methods

```javascript
airconsole.onMessage = function (device_id, data) {
  bank.onMessage(device_id, data);
};

airconsole.onConnect = function(device_id) {
  bank.onConnect(device_id);
};

airconsole.onDisconnect = function(device_id) {
  bank.onDisconnect(device_id);
};
```


##### Bank methods

```javascript
// Resets the bank and all gamblers
bank.reset();

// Call this method to open a new round. ALWAYS DO THIS BEFORE PLACING NEW BETS!
bank.openRound();

// Call this method to close the current round. No new bets are accepted
bank.closeRound();

// If the round is closed or not
bank.isLocked();

// Triggered when each devices has at least placed one bet
bank.onAllGamblersBet();

// Evaluates the round. Call this when your games round is over.
// success_tags: Array of tags which won ['rabbit_wins', 'device_2_wins']
bank.evaluateRound(success_tags);

// Sets a quota for a bet tag
bank.setTagQuota('rabbit_wins', 1.5);

bank.getTagQuota('rabbit_wins'); // Returns 1.5

/**
  Returns the custom device data of the bank
  {
    devices: {},
    bet_round_id: 0,
    bets_locked: false
  };
*/
bank.getCustomData();
```


#### The Gambler (controller)

##### Setup

```javascript
var airconsole = new AirConsole();
var gambler = new Gambler(airconsole);

airconsole.onReady = function () {
  gambler.init();
};

airconsole.onMessage = function (device_id, data) {
  gambler.onMessage(device_id, data);
};

airconsole.onCustomDeviceStateChange = function (device_id, data) {
  gambler.onCustomDeviceStateChange(device_id, data);

  // E.g. to set the amount
  var amount = gambler.getCurrentAmount();
  yourRenderAmountFunction(amount);
};
```

##### Gambler methods

```javascript
// Place a bet of 100 coins on the turtle
$("#bet_button_turtle").on('click', function() {
  if (!gambler.isRoundClosed()) {
    gambler.placeBet(100, "turtle_wins");
  }
});

// Make a transaction to device_id 2
$("#transfer_button").on('click', function() {
  gambler.makeTransaction(100, 2);
});
```
