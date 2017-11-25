
var
	has                   = req('/lib/utility/has'),
	Enum_ChannelUserModes = req('/lib/enum/channel-user-modes');


function validate(mode) {
	if (!mode) {
		throw new Error('Invalid channel user mode: ' + mode);
	}

	if (!has(Enum_ChannelUserModes, mode)) {
		throw new Error('Invalid channel user mode: ' + mode);
	}
}

module.exports = {
	validate
};
