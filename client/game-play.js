Template.gamePlay.helpers({
	gameStatus: function() {
		var gameId = Session.get("gameId");
		var playerId = Session.get("playerId");
		// send the join signal to backend first
		Meteor.call("playerJoined", gameId, playerId);

		var game = Games.findOne(gameId);
		if (game) {
			if (game.player1State === "absent" || game.player2State === "absent") {
				return "Waiting on both parties to join";
			} else if (game.player1State === "waiting" || game.player2State === "waiting") {
				if (game.gameResult === "") {
					return "Waiting on both parties to place bet";
				} else {
					return "Result: " + game.gameResult;
				}
			}
		}
		
	},

  	betPlaced: function() {
  		return Session.get("betPlaced");
  	},

	canPlaceBet: function() {
		return Games.findOne({
			$and: [
				{_id: Session.get("gameId")},
				{player1State: 'waiting'},
				{player2State: 'waiting'},
				{gameResult: ""}
			]
		}) && !Session.get("betPlaced");
  	}, 

  	otherPlayerNotJoined: function() {
  		if (Session.get("playerId") === 'player1') {
	  		return Games.findOne({
				$and: [
					{_id: Session.get("gameId")},
					{player1State: 'waiting'},
					{player2State: 'absent'},
					{gameResult: ""}
				]
			});
  		} else {
  			return Games.findOne({
				$and: [
					{_id: Session.get("gameId")},
					{player1State: 'absent'},
					{player2State: 'waiting'},
					{gameResult: ""}
				]
			});
  		}

  	},

  	theOtherPlayerUrl: function() {
  		var otherplayer = (Session.get("playerId") === 'player1') ? 'player2' : 'player1';
  		return '/game/' + Session.get('gameId') + '/' + otherplayer;
  	},

  	gameFinished: function() {
		var game = Games.findOne(Session.get("gameId"));
		if (game && game.gameResult !== "") {
			return true;
		} else {
			return false;
		}
  	}

});

Template.gamePlay.events({
	'click .choose': function(event) {
		Meteor.call("placeBet", 
			Session.get("gameId"),
			Session.get("playerId"),
			event.target.name,
			function() {
				Session.set("betPlaced", event.target.name);
			}
		);
	}
});