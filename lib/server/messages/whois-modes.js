
var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/constants/reply-numerics');


class ServerWhoisModesMessage extends ServerMessage {

	getBody() {
		// TODO: this
		var modes_string = '+';

		return `is using modes ${modes_string}`;
	}

	serializeParams() {
		var
			targets      = this.serializeTargets(),
			user_details = this.getTargetUserDetails(),
			nick         = user_details.getNick(),
			body         = this.getBody();

		return `${targets} ${nick} :${body}`;
	}

	applyParsedParams(middle_params, trailing_param) {
		this.addTargetFromString(middle_params.shift());

		var user_details = this.getTargetUserDetails();

		user_details.setNick(middle_params.shift());

		// TODO: apply modes from trailing param
	}

}

extend(ServerWhoisModesMessage.prototype, {

	reply_numeric: ReplyNumerics.RPL_WHOISMODES

});

module.exports = ServerWhoisModesMessage;
