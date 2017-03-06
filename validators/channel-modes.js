
var
	isArray                  = req('/utilities/is-array'),
	InvalidChannelModesError = req('/lib/errors/invalid-channel-modes'),
	ErrorReasons             = req('/constants/error-reasons'),
	ChannelModeValidator     = req('/validators/channel-mode');


function validate(channel_modes) {
	if (!channel_modes) {
		throw new InvalidChannelModesError(channel_modes, ErrorReasons.OMITTED);
	}

	if (!isArray(channel_modes)) {
		throw new InvalidChannelModesError(channel_modes, ErrorReasons.WRONG_TYPE);
	}

	channel_modes.forEach(ChannelModeValidator.validate);
}

module.exports = {
	validate
};
