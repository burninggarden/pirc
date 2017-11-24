
var
	Enum_ChannelModes       = req('/lib/enum/channel-modes'),
	Enum_ModeParameterTypes = req('/lib/enum/mode-parameter-types');

module.exports = {

	[Enum_ChannelModes.ANONYMOUS]:           Enum_ModeParameterTypes.NONE,
	[Enum_ChannelModes.BAN_MASK]:            Enum_ModeParameterTypes.PLURAL,
	[Enum_ChannelModes.EXCEPTION_MASK]:      Enum_ModeParameterTypes.PLURAL,
	[Enum_ChannelModes.INVITE_ONLY]:         Enum_ModeParameterTypes.NONE,
	[Enum_ChannelModes.INVITATION_MASK]:     Enum_ModeParameterTypes.PLURAL,
	[Enum_ChannelModes.KEY]:                 Enum_ModeParameterTypes.SINGULAR,
	[Enum_ChannelModes.LIMIT]:               Enum_ModeParameterTypes.SINGULAR,
	[Enum_ChannelModes.MODERATED]:           Enum_ModeParameterTypes.NONE,
	[Enum_ChannelModes.NO_OUTSIDE_MESSAGES]: Enum_ModeParameterTypes.NONE,
	[Enum_ChannelModes.PRIVATE]:             Enum_ModeParameterTypes.NONE,
	[Enum_ChannelModes.QUIET]:               Enum_ModeParameterTypes.NONE,
	[Enum_ChannelModes.SERVER_REOP]:         Enum_ModeParameterTypes.NONE,
	[Enum_ChannelModes.SECRET]:              Enum_ModeParameterTypes.NONE,
	[Enum_ChannelModes.TOPIC_OPERATOR_ONLY]: Enum_ModeParameterTypes.NONE

};
