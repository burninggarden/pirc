
var
	has                     = req('/utilities/has'),
	ChannelModes            = req('/constants/channel-modes'),
	ErrorReasons            = req('/constants/error-reasons'),
	InvalidChannelModeError = req('/lib/errors/invalid-channel-mode');


function validate(mode) {
	if (!mode) {
		throw new InvalidChannelModeError(mode, ErrorReasons.OMITTED);
	}

	if (!has(ChannelModes, mode)) {
		throw new InvalidChannelModeError(mode, ErrorReasons.UNKNOWN_TYPE);
	}
}

module.exports = {
	validate
};
