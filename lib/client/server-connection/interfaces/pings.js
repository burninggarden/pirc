var
	Commands = req('/constants/commands');

var
	ClientPongMessage = req('/lib/client/messages/pong');


module.exports = {

	handleMessage(message) {
		switch (message.getCommand()) {
			case Commands.PING:
				return this.handlePingMessage(message);
		}
	},

	handlePingMessage(ping_message) {
		var pong_message = new ClientPongMessage();

		pong_message.setServerName(ping_message.getServerName());

		this.sendMessage(pong_message);
	}

};
