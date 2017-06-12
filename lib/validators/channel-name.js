
var
	InvalidChannelNameError = req('/lib/errors/invalid-channel-name'),
	ErrorReasons            = req('/lib/constants/error-reasons'),
	isChannelName           = req('/lib/utilities/is-channel-name');


function validate(channel_name) {
	if (!channel_name) {
		throw new InvalidChannelNameError(channel_name, ErrorReasons.OMITTED);
	}

	if (!isChannelName(channel_name)) {
		throw new InvalidChannelNameError(channel_name, ErrorReasons.INVALID_CHARACTERS);
	}
}


module.exports = {
	validate
};
