
var
	extend        = req('/lib/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/lib/constants/reply-numerics'),
	ErrorReasons  = req('/lib/constants/error-reasons');

var
	InvalidChannelNameError = req('/lib/errors/invalid-channel-name');


class ServerNoSuchChannelMessage extends ServerMessage {

	setChannelName(channel_name) {
		this.channel_name = channel_name;
		return this;
	}

	serializeParams() {
		var
			targets      = this.serializeTargets(),
			channel_name = this.getChannelName(),
			body         = this.getBody();

		return `${targets} ${channel_name} :${body}`;
	}

	applyParsedParams(middle_params, trailing_param) {
		this.addTargetFromString(middle_params.shift());
		this.setChannelName(middle_params.shift());
		this.setBody(trailing_param);
	}

	getChannelName() {
		return this.channel_name;
	}

	toError() {
		return new InvalidChannelNameError(
			this.getChannelName(),
			ErrorReasons.NOT_FOUND
		);
	}

}

extend(ServerNoSuchChannelMessage.prototype, {
	reply_numeric: ReplyNumerics.ERR_NOSUCHCHANNEL,
	body:          'No such channel',
	channel_name:  null
});

module.exports = ServerNoSuchChannelMessage;
