
var
	extend        = req('/lib/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/lib/constants/reply-numerics');

class ServerLUserChannelsMessage extends ServerMessage {

	/**
	 * Called on the client.
	 *
	 * @param   {int} channel_count
	 * @returns {void}
	 */
	setRemoteChannelCount(channel_count) {
		this.getRemoteServerDetails().setChannelCount(channel_count);
	}

	getRemoteChannelCount() {
		return this.getRemoteServerDetails().getChannelCount();
	}

	/**
	 * Called on the server.
	 *
	 * @returns {int}
	 */
	getLocalChannelCount() {
		return this.getLocalServerDetails().getChannelCount();
	}

	applyParsedParams(middle_params, trailing_param) {
		this.setRemoteChannelCount(parseInt(middle_params.pop()));
	}

	serializeParams() {
		var
			channel_count = this.getLocalChannelCount(),
			body          = this.getBody();

		return `${channel_count} :${body}`;
	}

}

extend(ServerLUserChannelsMessage.prototype, {

	reply_numeric: ReplyNumerics.RPL_LUSERCHANNELS,
	body:          'channels formed'

});

module.exports = ServerLUserChannelsMessage;
