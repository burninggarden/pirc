var req = require('req');

var
	has                         = req('/utilities/has'),
	ChannelUserModes            = req('/constants/channel-user-modes'),
	ErrorReasons                = req('/constants/error-reasons'),
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
