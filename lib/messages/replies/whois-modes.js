
var
	extend        = req('/lib/utilities/extend'),
	ReplyMessage  = req('/lib/server/message'),
	ReplyNumerics = req('/lib/constants/reply-numerics');


class WhoisModesMessage extends ReplyMessage {

	getBody() {
		// TODO: this
		var modes_string = '+';

		return `is using modes ${modes_string}`;
	}

	serializeParameters() {
		var
			targets      = this.serializeTargets(),
			user_details = this.getTargetUserDetails(),
			nick         = user_details.getNick(),
			body         = this.getBody();

		return `${targets} ${nick} :${body}`;
	}

	applyParsedParameters(middle_parameters, trailing_parameter) {
		this.addTargetFromString(middle_parameters.shift());

		var user_details = this.getTargetUserDetails();

		user_details.setNick(middle_parameters.shift());

		// TODO: apply modes from trailing param
	}

}

extend(WhoisModesMessage.prototype, {

	reply_numeric: ReplyNumerics.RPL_WHOISMODES

});

module.exports = WhoisModesMessage;
