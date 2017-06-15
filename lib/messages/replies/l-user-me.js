
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Replies      = req('/lib/constants/replies');

class LUserMeMessage extends ReplyMessage {

	getLocalClientCount() {
		return this.getLocalServerDetails().getClientCount();
	}

	getLocalServerCount() {
		// TODO: Determine if this should ever incorporate a different result;
		// I've never seen an IRCD return this message with a higher value.
		return 1;
	}

	getBody() {
		var
			client_count = this.getLocalClientCount(),
			server_count = this.getLocalServerCount();

		return `I have ${client_count} clients and ${server_count} servers`;
	}

	serializeParameters() {
		return ' ' + this.serializeTargets() + ' :' + this.getBody();
	}

	applyParsedParameters(middle_parameters, trailing_parameter) {
		this.setTargetStrings(middle_parameters);
		this.setBody(trailing_parameter);
	}

}

extend(LUserMeMessage.prototype, {

	reply: Replies.RPL_LUSERME

});

module.exports = LUserMeMessage;
