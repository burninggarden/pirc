
var
	has              = req('/lib/utilities/has'),
	ChannelUserModes = req('/lib/constants/channel-user-modes');


function validate(mode) {
	if (!mode) {
		throw new Error('Invalid channel user mode: ' + mode);
	}

	if (!has(ChannelUserModes, mode)) {
		throw new Error('Invalid channel user mode: ' + mode);
	}
}

module.exports = {
	validate
};
