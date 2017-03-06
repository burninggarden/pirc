
var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/constants/reply-numerics');

class ServerEndOfNamesMessage extends ServerMessage {

	serializeParams() {
		var
			targets      = this.serializeTargets(),
			channel_name = this.getChannelDetails().getName(),
			body         = this.getBody();

		return `${targets} ${channel_name} :${body}`;
	}

	applyParsedParams(middle_params, trailing_param) {
		// The last middle parameter is the channel name in question:
		this.getChannelDetails().setName(middle_params.pop());
		// The remaining middle parameters are the message targets
		// (this will usually be an array with the only element being the
		//  nick of the current client):
		this.setTargetStrings(middle_params);
		this.setBody(trailing_param);
	}

}

extend(ServerEndOfNamesMessage.prototype, {

	reply_numeric: ReplyNumerics.RPL_ENDOFNAMES,
	body:          'End of /NAMES list.'

});

module.exports = ServerEndOfNamesMessage;
