
var
	UserModes          = req('/lib/constants/user-modes'),
	ModeParameterTypes = req('/lib/constants/mode-parameter-types');

module.exports = {
	[UserModes.AWAY]:             ModeParameterTypes.NONE,
	[UserModes.INVISIBLE]:        ModeParameterTypes.NONE,
	[UserModes.OPERATOR]:         ModeParameterTypes.NONE,
	[UserModes.LOCAL_OPERATOR]:   ModeParameterTypes.NONE,
	[UserModes.RESTRICTED]:       ModeParameterTypes.NONE,
	[UserModes.RECEIVES_NOTICES]: ModeParameterTypes.PLURAL,
	[UserModes.WALLOPS]:          ModeParameterTypes.NONE
};
