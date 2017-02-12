var req = require('req');

var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/constants/reply-numerics');

class ServerLUserChannelsMessage extends ServerMessage {

	setChannelCount(channel_count) {
		this.getServerDetails().setChannelCount(channel_count);
	}

	getChannelCount() {
		return this.getServerDetails().getChannelCount();
	}

	applyParsedParams(middle_params, trailing_param) {
		this.setChannelCount(parseInt(middle_params.pop()));
	}

	serializeParams() {
		var
			channel_count = this.getChannelCount(),
			body          = this.getBody();

		return `${channel_count} :${body}`;
	}

}

extend(ServerLUserChannelsMessage.prototype, {

	reply_numeric: ReplyNumerics.RPL_LUSERCHANNELS,
	body:          'channels formed'

});

module.exports = ServerLUserChannelsMessage;
