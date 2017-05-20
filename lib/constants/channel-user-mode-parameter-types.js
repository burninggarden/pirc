
var
	ChannelUserModes   = req('/lib/constants/channel-user-modes'),
	ModeParameterTypes = req('/lib/constants/mode-parameter-types');

module.exports = {
	[ChannelUserModes.OWNER]:         ModeParameterTypes.NONE,
	[ChannelUserModes.ADMIN]:         ModeParameterTypes.NONE,
	[ChannelUserModes.OPERATOR]:      ModeParameterTypes.NONE,
	[ChannelUserModes.HALF_OPERATOR]: ModeParameterTypes.NONE,
	[ChannelUserModes.VOICED]:        ModeParameterTypes.NONE
};
