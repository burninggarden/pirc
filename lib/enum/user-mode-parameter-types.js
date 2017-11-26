
var
	Enum_UserModes          = require('./user-modes'),
	Enum_ModeParameterTypes = require('./mode-parameter-types');

module.exports = {
	[Enum_UserModes.AWAY]:             Enum_ModeParameterTypes.NONE,
	[Enum_UserModes.INVISIBLE]:        Enum_ModeParameterTypes.NONE,
	[Enum_UserModes.OPERATOR]:         Enum_ModeParameterTypes.NONE,
	[Enum_UserModes.LOCAL_OPERATOR]:   Enum_ModeParameterTypes.NONE,
	[Enum_UserModes.RESTRICTED]:       Enum_ModeParameterTypes.NONE,
	[Enum_UserModes.RECEIVES_NOTICES]: Enum_ModeParameterTypes.NONE,
	[Enum_UserModes.WALLOPS]:          Enum_ModeParameterTypes.NONE
};
