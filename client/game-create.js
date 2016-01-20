Template.gameCreate.helpers({
	gameCreated: function() {
		return Session.get("gameCreated");
	},
	getPlayer2Route: function() {
		return '/game/' + Session.get('gameId') + '/player2';
	}
});

Template.gameCreate.events({
	'click .create-game': function() {
		Meteor.call("createGame", function(error, results) {
			Session.set("gameId", results);
			Session.set("gameCreated", true);
		});	
	},
	
	'click .enter-game': function() {
		var gameId = Session.get("gameId", gameId);
		Router.go('/game/' + gameId + '/player1');
	}
});