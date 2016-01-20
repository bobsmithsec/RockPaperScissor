resultMap = {
	'rockrock': 'tie',
	'paperpaper': 'tie', 
	'scissorscissor': 'tie', 
	'rockscissor': 'player1 wins',
	'scissorpaper': 'player1 wins',
	'paperrock': 'player1 wins',
	'scissorrock': 'player2 wins',
	'paperscissor': 'player2 wins',
	'rockpaper': 'player2 wins' 
};

Meteor.methods({
  createGame: function () {
  	var id =  Games.insert({
      player1State: "absent",
      player2State: "absent",
      player1Bet: "",
      player2Bet: "",
      gameResult: ""
    });
    return id;
  }, 

  playerJoined: function(gameId, playerId) {
  	var game = Games.findOne(gameId);
  	if (!game) {
  		throw new Meteor.Eror("Invalid gameId");
  	}
  	if (playerId === "player1") {
  		Games.update(gameId, { $set: { player1State: 'waiting'}});
  	} else if (playerId === "player2") {
  		Games.update(gameId, { $set: { player2State: 'waiting'}});
  	} else {
  		throw new Meteor.Error("Invalid player Id");
  	}
  }, 

  placeBet: function(gameId, playerId, bet) {
  	var game = Games.findOne(gameId);
  	if (!game) {
  		throw new Meteor.Erorr("Invalid gameId");
  	} else if (game.player1State !== 'waiting' || game.player2State !== 'waiting') {
  		throw new Meteor.Error("Both player have to join the game before placing a bet");
  	} else if (bet !== 'rock' && bet !== 'paper' && bet !== 'scissor') {
  		throw new Meteor.Error("Invalid bet");
  	}

  	if (playerId === "player1") {
      game.player1Bet = bet;
  		Games.update(gameId, { $set: {player1Bet: bet}});
  	} else if (playerId === "player2") {
      game.player2Bet = bet;
  		Games.update(gameId, { $set: {player2Bet: bet}});
  	} else {
  		throw new Meteor.Error("Invalid player Id");
  	}

  	// update the result when both plays finish betting
  	if (game.player1Bet !== '' && game.player2Bet !== '') {
  		var result = resultMap[game.player1Bet + game.player2Bet];
  		Games.update(gameId, { $set: { gameResult: result}});
      console.log("result is " + result);
  	}
  }
});