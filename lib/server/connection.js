
var
	Connection    = require('../connection'),
	extend        = require('../utility/extend'),
	ServerDetails = require('../server-details'),
	TextFormatter = require('../utility/text-formatter');


class Server_Connection_Remote extends Connection {

	/**
	 * @param   {Net.Socket|null} socket
	 * @returns {self}
	 */
	setInboundSocket(socket) {
		if (socket) {
			this.setIsConnected(true);
		}

		return super.setSocket(socket);
	}

	getLocalServerDetails() {
		if (!this.local_server_details) {
			this.local_server_details = new ServerDetails();
		}

		return this.local_server_details;
	}

	setLocalServerDetails(server_details) {
		this.local_server_details = server_details;

		return this;
	}

	getLocalHostname() {
		return this.getLocalServerDetails().getHostname();
	}

	sendMessage(message) {
		if (!message.hasOriginUserId()) {
			message.setOriginHostname(this.getLocalHostname());
		}

		if (!message.hasTarget()) {
			message.setTarget(this.getTargetString());
		}

		return super.sendMessage(message);
	}

	getTargetString() {
		throw new Error('Implement method: getTargetString()');
	}

	getSourceType() {
		throw new Error('Implement method: getSourceType()');
	}

	destroy() {
		this.getSocket().destroy();
	}

	getOutboundLogPrefix() {
		return TextFormatter.blue('[S] SEND: ');
	}

	getInboundLogPrefix() {
		return TextFormatter.magenta('[S] RECV: ');
	}

}

extend(Server_Connection_Remote.prototype, {

	local_server_details: null

});

module.exports = Server_Connection_Remote;
