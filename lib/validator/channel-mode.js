
var
	has               = require('../utility/has'),
	Enum_ChannelModes = require('../enum/channel-modes');


function validate(mode) {
	if (!mode) {
		throw new Error('Invalid channel mode: ' + mode);
	}

	if (!has(Enum_ChannelModes, mode)) {
		throw new Error('Invalid channel mode: ' + mode);
	}
}

module.exports = {
	validate
};
