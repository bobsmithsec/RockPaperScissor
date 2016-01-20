Router.configure({
	waitOn: function() {
		return [
			Meteor.subscribe('games')
		];
	}
});

Router.route('gamePlay', {
	path: 'game/:_gameId/:_playerId',
	onBeforeAction: function() {
		Session.set("gameId", this.params._gameId);

		var playerId = this.params._playerId;

		// quick sanitization of playerId	
		if (playerId !== 'player1' && playerId !== 'player2') {
			Router.go('gameCreate');
		} else {
			Meteor.subscribe("games", this.params._gameId);
			Session.set("playerId", this.params._playerId);
			this.next();
		}
	},

	data: function() {
		return Games.findOne(this.params._gameId);
	}
});

Router.route('gameCreate', {
	path: '/',
	onBeforeAction: function() {
		// reset the session
		Session.keys = {};
		this.next();
	}
});