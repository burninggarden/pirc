
var
	extend        = req('/lib/utilities/extend'),
	ReplyMessage  = req('/lib/messages/reply'),
	ReplyNumerics = req('/lib/constants/reply-numerics');

class LUserOpMessage extends ReplyMessage {

	getLocalOperatorCount() {
		return this.getLocalServerDetails().getOperatorCount();
	}

	setRemoteOperatorCount(operator_count) {
		this.getRemoteServerDetails().setOperatorCount(operator_count);
	}

	getRemoteOperatorCount() {
		return this.getRemoteServerDetails().getOperatorCount();
	}

	applyParsedParameters(middle_parameters, trailing_parameter) {
		this.setRemoteOperatorCount(parseInt(middle_parameters.pop()));
		this.setBody(trailing_parameter);
	}

	serializeParameters() {
		var
			operator_count = this.getLocalOperatorCount(),
			body           = this.getBody();

		return `${operator_count} :${body}`;
	}

}

extend(LUserOpMessage.prototype, {

	reply_numeric: ReplyNumerics.RPL_LUSEROP,
	body:          'IRC Operators online'

});

module.exports = LUserOpMessage;