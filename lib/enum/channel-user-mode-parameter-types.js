
var
	Enum_ChannelUserModes   = require('./channel-user-modes'),
	Enum_ModeParameterTypes = require('./mode-parameter-types');

module.exports = {
	[Enum_ChannelUserModes.OWNER]:         Enum_ModeParameterTypes.NONE,
	[Enum_ChannelUserModes.ADMIN]:         Enum_ModeParameterTypes.NONE,
	[Enum_ChannelUserModes.OPERATOR]:      Enum_ModeParameterTypes.NONE,
	[Enum_ChannelUserModes.HALF_OPERATOR]: Enum_ModeParameterTypes.NONE,
	[Enum_ChannelUserModes.VOICED]:        Enum_ModeParameterTypes.NONE
};
