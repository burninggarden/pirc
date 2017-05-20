
var
	ChannelUserModes   = req('/constants/channel-user-modes'),
	ModeParameterTypes = req('/constants/mode-parameter-types');

module.exports = {
	[ChannelUserModes.OWNER]:         ModeParameterTypes.NONE,
	[ChannelUserModes.ADMIN]:         ModeParameterTypes.NONE,
	[ChannelUserModes.OPERATOR]:      ModeParameterTypes.NONE,
	[ChannelUserModes.HALF_OPERATOR]: ModeParameterTypes.NONE,
	[ChannelUserModes.VOICED]:        ModeParameterTypes.NONE
};
