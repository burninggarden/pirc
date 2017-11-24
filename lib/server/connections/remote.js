
var
	Connection    = req('/lib/connection'),
	extend        = req('/lib/utilities/extend'),
	ServerDetails = req('/lib/server-details'),
	TextFormatter = req('/lib/utilities/text-formatter');


class RemoteConnection extends Connection {

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

extend(RemoteConnection.prototype, {

	local_server_details: null

});

module.exports = RemoteConnection;
