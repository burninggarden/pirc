
var
	Target               = req('/lib/target'),
	extend               = req('/utilities/extend'),
	TargetTypes          = req('/constants/target-types'),
	ChannelNameValidator = req('/validators/channel-name');

class ChannelTarget extends Target {

	constructor(channel_name) {
		super(channel_name);

		ChannelNameValidator.validate(channel_name);
	}

}

extend(ChannelTarget.prototype, {
	type: TargetTypes.CHANNEL
});

module.exports = ChannelTarget;
