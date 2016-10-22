var
	Service = req('/lib/server/service'),
	extend  = req('/utilities/extend');

var
	MotdStartMessage = req('/lib/server/messages/motd-start'),
	MotdMessage      = req('/lib/server/messages/motd'),
	EndOfMotdMessage = req('/lib/server/messages/end-of-motd'),
	NoMotdMessage    = req('/lib/server/messages/no-motd');

class MotdService extends Service {

	hasMotd() {
		return this.motd = null;
	}

	getMotd() {
		return this.motd;
	}

	setMotd(motd) {
		this.motd = motd;
	}

	registerClient(client) {
		if (!this.hasMotd()) {
			return this.sendMotdMissingErrorToClient(client);
		}

		this.sendMotdStartToClient(client);
		this.sendMotdToClient(client);
		this.sendMotdEndToClient(client);
	}

	sendMotdStartToClient(client) {
		var message = new MotdStartMessage();

		message.setServerName(this.getServerName());

		client.sendMessage(message);
	}

	sendMotdToClient(client) {
		var lines = this.getMotd().split('\n');

		lines.forEach(function each(line) {
			this.sendMotdLineToClient(line, client);
		}, this);
	}

	sendMotdLineToClient(line, client) {
		// Per the RFC, each line should be less than or equal to 80 characters
		// in length. If we receive one that's longer, split it into two
		// separate lines, instead.
		//
		// TODO: Split intelligently on nearest space, if one exists.
		if (line.length > 80) {
			this.sendMotdLineToClient(line.slice(0, 80), client);
			this.sendMotdLineToClient(line.slice(80),    client);
			return;
		}

		var message = new MotdMessage();

		message.setText(line);

		client.sendMessage(message);
	}

	sendMotdEndToClient(client) {
		var message = new EndOfMotdMessage();

		client.sendMessage(message);
	}

	sendMotdMissingErrorToClient(client) {
		var message = new NoMotdMessage();

		client.sendMessage(message);
	}

}

extend(MotdService.prototype, {
	motd: null
});


module.exports = MotdService;
