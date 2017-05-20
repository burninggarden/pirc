
var
	has                         = req('/lib/utilities/has'),
	ChannelUserModes            = req('/lib/constants/channel-user-modes'),
	ErrorReasons                = req('/lib/constants/error-reasons'),
	InvalidChannelUserModeError = req('/lib/errors/invalid-channel-user-mode');


function validate(mode) {
	if (!mode) {
		throw new InvalidChannelUserModeError(mode, ErrorReasons.OMITTED);
	}

	if (!has(ChannelUserModes, mode)) {
		throw new InvalidChannelUserModeError(mode, ErrorReasons.UNKNOWN_TYPE);
	}
}

module.exports = {
	validate
};
