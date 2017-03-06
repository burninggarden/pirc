
var
	Message        = req('/lib/message'),
	ChannelDetails = req('/lib/channel-details');

class ClientMessage extends Message {

	/**
	 * Override the base "isFromServer()" method on the parent message class,
	 * for obvious reasons...
	 *
	 * @returns {boolean}
	 */
	isFromServer() {
		return false;
	}

	shouldOmitPrefix() {
		return true;
	}

	setChannelNames(channel_names) {
		channel_names.forEach(this.addChannelName, this);
	}

	addChannelName(channel_name) {
		var channel_details = new ChannelDetails();

		channel_details.setName(channel_name);

		this.addTarget(channel_details);
	}

}

module.exports = ClientMessage;
