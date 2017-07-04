
var
	Heket = require('heket');

var
	Connection    = req('/lib/connection'),
	extend        = req('/lib/utilities/extend'),
	sanitize      = req('/lib/utilities/sanitize'),
	ServerDetails = req('/lib/server-details'),
	BaseError     = req('/lib/errors/base'),
	TextFormatter = req('/lib/utilities/text-formatter'),
	ErrorReasons  = req('/lib/constants/error-reasons');


var
	AbstractMethodNotImplementedError = req('/lib/errors/abstract-method-not-implemented'),
	InvalidCommandError               = req('/lib/errors/invalid-command');


class InboundConnection extends Connection {

	constructor(socket) {
		super();

		this.setSocket(socket);
		this.setIsConnected(true);
	}

	handleError(error) {
		if (error instanceof Heket.InvalidRuleValueError) {
			return this.handleInvalidRuleValueError(error);
		}

		if (!(error instanceof BaseError)) {
			throw error;
		}

		this.sendReplyForError(error);
	}

	handleInvalidRuleValueError(rule_value_error) {
		switch (rule_value_error.getRuleName()) {
			case 'command':
			case 'CR':
				let error = new InvalidCommandError(
					sanitize(rule_value_error.getValue()),
					ErrorReasons.UNSUPPORTED
				);

				return this.sendReplyForError(error);

			default:
				throw rule_value_error;
		}
	}

	sendReplyForError(error) {
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
