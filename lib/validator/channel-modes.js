
var
	isArray              = req('/lib/utility/is-array'),
	ChannelModeValidator = req('/lib/validator/channel-mode');


function validate(channel_modes) {
	if (!channel_modes) {
		throw new Error('Invalid channel modes: ' + channel_modes);
	}

	if (!isArray(channel_modes)) {
		throw new Error('Invalid channel modes: ' + channel_modes);
	}

	channel_modes.forEach(ChannelModeValidator.validate);
}

module.exports = {
	validate
};
