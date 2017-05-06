
var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/constants/reply-numerics');

class ServerLUserMeMessage extends ServerMessage {

	getClientCount() {
		return this.getLocalServerDetails().getClientCount();
	}

	getServerCount() {
		// TODO: Determine if this should ever incorporate a different result;
		// I've never seen an IRCD return this message with a higher value.
		return 1;
	}

	getBody() {
		var
			client_count = this.getClientCount(),
			server_count = this.getServerCount();

		return `I have ${client_count} clients and ${server_count} servers`;
	}

	serializeParams() {
		return ' ' + this.serializeTargets() + ' :' + this.getBody();
	}

	applyParsedParams(middle_params, trailing_param) {
		this.setTargetStrings(middle_params);
		this.setBody(trailing_param);
	}

}

extend(ServerLUserMeMessage.prototype, {

	reply_numeric: ReplyNumerics.RPL_LUSERME

});

module.exports = ServerLUserMeMessage;
