
var
	InvalidChannelNameError = req('/lib/errors/invalid-channel-name'),
	ErrorReasons            = req('/lib/constants/error-reasons'),
	ChannelParser           = req('/lib/parsers/channel');


function validate(channel_name) {
	if (!channel_name) {
		throw new InvalidChannelNameError(channel_name, ErrorReasons.OMITTED);
	}

	if (ChannelParser.parse(channel_name) === null) {
		throw new InvalidChannelNameError(channel_name, ErrorReasons.INVALID_CHARACTERS);
	}
}


module.exports = {
	validate
};
