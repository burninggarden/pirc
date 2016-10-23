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
		var
			pong_message = new ClientPongMessage(),
			hostname     = ping_message.getServerDetails().getHostname();

		pong_message.getServerDetails().setHostname(hostname);

		this.sendMessage(pong_message);
	}

};
