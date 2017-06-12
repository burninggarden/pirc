
var
	extend        = req('/lib/utilities/extend'),
	ReplyMessage  = req('/lib/messages/reply'),
	ReplyNumerics = req('/lib/constants/reply-numerics');

class LUserChannelsMessage extends ReplyMessage {

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

	applyParsedParameters(middle_parameters, trailing_parameter) {
		this.setRemoteChannelCount(parseInt(middle_parameters.pop()));
	}

	serializeParameters() {
		var
			channel_count = this.getLocalChannelCount(),
			body          = this.getBody();

		return `${channel_count} :${body}`;
	}

}

extend(LUserChannelsMessage.prototype, {

	reply_numeric: ReplyNumerics.RPL_LUSERCHANNELS,
	body:          'channels formed'

});

module.exports = LUserChannelsMessage;
