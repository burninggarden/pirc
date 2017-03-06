
var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/constants/reply-numerics');


class ServerWhoisChannelsMessage extends ServerMessage {

	getChannelNames() {
		return this.getTargetUserDetails().getChannelNamesWithPrefixes();
	}

	applyParsedParams(middle_params, trailing_param) {
		if (middle_params.length !== 2) {
			throw new Error('Invalid message: ' + this.raw_message);
		}

		this.addTargetFromString(middle_params[0]);

		var user_details = this.getTargetUserDetails();

		user_details.setNick(middle_params[1]);
		user_details.setChannelNames(trailing_param.trim().split(' '));
	}

	serializeParams() {
		var
			targets = this.serializeTargets(),
			nick    = this.getTargetUserDetails().getNick(),
			body    = this.getBody();

		return `${targets} ${nick} :${body}`;
	}

}

extend(ServerWhoisChannelsMessage.prototype, {

	reply_numeric: ReplyNumerics.RPL_WHOISCHANNELS

});

module.exports = ServerWhoisChannelsMessage;
