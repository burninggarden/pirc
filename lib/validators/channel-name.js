
var
	InvalidChannelNameError = req('/lib/errors/invalid-channel-name'),
	ErrorReasons            = req('/lib/constants/error-reasons');


// From https://gist.github.com/haxd/653245:
const VALID_NAME_REGEX = new RegExp("^[&|#][^, " + String.fromCharCode(7) + "]+$", "i");


function validate(channel_name) {
	if (!channel_name) {
		throw new InvalidChannelNameError(channel_name, ErrorReasons.OMITTED);
	}

	if (!VALID_NAME_REGEX.test(channel_name)) {
		throw new InvalidChannelNameError(channel_name, ErrorReasons.INVALID_CHARACTERS);
	}
}


module.exports = {
	validate
};
