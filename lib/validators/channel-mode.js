
var
	has          = req('/lib/utilities/has'),
	ChannelModes = req('/lib/constants/channel-modes');


function validate(mode) {
	if (!mode) {
		throw new Error('Invalid channel mode: ' + mode);
	}

	if (!has(ChannelModes, mode)) {
		throw new Error('Invalid channel mode: ' + mode);
	}
}

module.exports = {
	validate
};
