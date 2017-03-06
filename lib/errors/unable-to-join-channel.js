
var
	extend               = req('/utilities/extend'),
	BaseError            = req('/lib/errors/base'),
	ErrorCodes           = req('/constants/error-codes'),
	ChannelNameValidator = req('/validators/channel-name');


class UnableToJoinChannelError extends BaseError {

	setMessage() {
		var
			value  = this.value,
			reason = this.reason;

		this.message = `Unable to join channel: ${value} (${reason})`;
	}

	hasLinkedChannelName() {
		return this.getLinkedChannelName() !== null;
	}

	getLinkedChannelName() {
		return this.linked_channel_name;
	}

	setLinkedChannelName(channel_name) {
		ChannelNameValidator.validate(channel_name);
		this.linked_channel_name = channel_name;
	}

}

extend(UnableToJoinChannelError.prototype, {
	code: ErrorCodes.UNABLE_TO_JOIN_CHANNEL
});

module.exports = UnableToJoinChannelError;
