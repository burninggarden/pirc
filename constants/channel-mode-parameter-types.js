
var
	ChannelModes       = req('/constants/channel-modes'),
	ModeParameterTypes = req('/constants/mode-parameter-types');

module.exports = {

	[ChannelModes.ANONYMOUS]:           ModeParameterTypes.NONE,
	[ChannelModes.BAN_MASK]:            ModeParameterTypes.PLURAL,
	[ChannelModes.EXCEPTION_MASK]:      ModeParameterTypes.PLURAL,
	[ChannelModes.INVITE_ONLY]:         ModeParameterTypes.NONE,
	[ChannelModes.INVITATION_MASK]:     ModeParameterTypes.PLURAL,
	[ChannelModes.KEY]:                 ModeParameterTypes.SINGULAR,
	[ChannelModes.LIMIT]:               ModeParameterTypes.SINGULAR,
	[ChannelModes.MODERATED]:           ModeParameterTypes.NONE,
	[ChannelModes.NO_OUTSIDE_MESSAGES]: ModeParameterTypes.NONE,
	[ChannelModes.PRIVATE]:             ModeParameterTypes.NONE,
	[ChannelModes.QUIET]:               ModeParameterTypes.NONE,
	[ChannelModes.SERVER_REOP]:         ModeParameterTypes.NONE,
	[ChannelModes.SECRET]:              ModeParameterTypes.NONE,
	[ChannelModes.TOPIC_OPERATOR_ONLY]: ModeParameterTypes.NONE

};
