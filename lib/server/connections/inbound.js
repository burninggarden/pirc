
var
	Connection    = req('/lib/connection'),
	extend        = req('/lib/utilities/extend'),
	ServerDetails = req('/lib/server-details'),
	BaseError     = req('/lib/errors/base'),
	TextFormatter = req('/lib/utilities/text-formatter');


var
	AbstractMethodNotImplementedError = req('/lib/errors/abstract-method-not-implemented');


class InboundConnection extends Connection {

	constructor(socket) {
		super();

		this.setSocket(socket);
		this.setIsConnected(true);
	}

	handleError(error) {
		if (!(error instanceof BaseError)) {
			throw error;
		}

		var message = error.toReply();

		return this.sendMessage(message);
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
		throw new AbstractMethodNotImplementedError('getTargetString()');
	}

	getSourceType() {
		throw new AbstractMethodNotImplementedError('getSourceType()');
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

extend(InboundConnection.prototype, {

	local_server_details: null

});

module.exports = InboundConnection;
