/*
3.2.3 Channel mode message

      Command: MODE
   Parameters: <channel> *( ( "-" / "+" ) *<modes> *<modeparams> )

   The MODE command is provided so that users may query and change the
   characteristics of a channel.  For more details on available modes
   and their uses, see "Internet Relay Chat: Channel Management" [IRC-
   CHAN].  Note that there is a maximum limit of three (3) changes per
   command for modes that take a parameter.

   Numeric Replies:

           ERR_NEEDMOREPARAMS              ERR_KEYSET
           ERR_NOCHANMODES                 ERR_CHANOPRIVSNEEDED
           ERR_USERNOTINCHANNEL            ERR_UNKNOWNMODE
           RPL_CHANNELMODEIS
           RPL_BANLIST                     RPL_ENDOFBANLIST
           RPL_EXCEPTLIST                  RPL_ENDOFEXCEPTLIST
           RPL_INVITELIST                  RPL_ENDOFINVITELIST
           RPL_UNIQOPIS

   The following examples are given to help understanding the syntax of
   the MODE command, but refer to modes defined in "Internet Relay Chat:
   Channel Management" [IRC-CHAN].

   Examples:

   MODE #Finnish +imI *!*@*.fi     ; Command to make #Finnish channel
                                   moderated and 'invite-only' with user
                                   with a hostname matching *.fi
                                   automatically invited.

   MODE #Finnish +o Kilroy         ; Command to give 'chanop' privileges
                                   to Kilroy on channel #Finnish.

   MODE #Finnish +v Wiz            ; Command to allow WiZ to speak on
                                   #Finnish.

   MODE #Fins -s                   ; Command to remove 'secret' flag
                                   from channel #Fins.

   MODE #42 +k oulu                ; Command to set the channel key to
                                   "oulu".

   MODE #42 -k oulu                ; Command to remove the "oulu"
                                   channel key on channel "#42".

   MODE #eu-opers +l 10            ; Command to set the limit for the
                                   number of users on channel
                                   "#eu-opers" to 10.

   :WiZ!jto@tolsun.oulu.fi MODE #eu-opers -l
                                   ; User "WiZ" removing the limit for
                                   the number of users on channel "#eu-
                                   opers".

   MODE &oulu +b                   ; Command to list ban masks set for
                                   the channel "&oulu".

   MODE &oulu +b *!*@*             ; Command to prevent all users from
                                   joining.

   MODE &oulu +b *!*@*.edu +e *!*@*.bu.edu
                                   ; Command to prevent any user from a
                                   hostname matching *.edu from joining,
                                   except if matching *.bu.edu

   MODE #bu +be *!*@*.edu *!*@*.bu.edu
                                   ; Comment to prevent any user from a
                                   hostname matching *.edu from joining,
                                   except if matching *.bu.edu

   MODE #meditation e              ; Command to list exception masks set
                                   for the channel "#meditation".

   MODE #meditation I              ; Command to list invitations masks
                                   set for the channel "#meditation".

   MODE !12345ircd O               ; Command to ask who the channel
                                   creator for "!12345ircd" is
*/

function makeChannelModerated(test) {
	test.bypass();
}

function makeChannelInviteOnly(test) {
	test.bypass();
}

function addInviteMask(test) {
	test.bypass();
}

function giveChanOpPrivileges(test) {
	test.bypass();
}

function giveVoice(test) {
	test.bypass();
}

function removeSecretFlag(test) {
	test.bypass();
}

function setChannelKey(test) {
	test.bypass();
}

function removeChannelKey(test) {
	test.bypass();
}

function setUserLimit(test) {
	test.bypass();
}

function removeUserLimit(test) {
	test.bypass();
}

function listBanMasks(test) {
	test.bypass();
}

function preventAllJoins(test) {
	test.bypass();
}

function preventJoinsFromHostmask(test) {
	test.bypass();
}

function preventJoinsFromHostmaskWithException(test) {
	test.bypass();
}

function preventJoinsFromHostmaskWithExceptionConsolidated(test) {
	test.bypass();
}

function listExceptionMasks(test) {
	test.bypass();
}

function listInvitationMasks(test) {
	test.bypass();
}

function showChannelCreator(test) {
	test.bypass();
}

function ERR_NEEDMOREPARAMS(test) {
	test.bypass();
}

function ERR_KEYSET(test) {
	test.bypass();
}

function ERR_NOCHANMODES(test) {
	test.bypass();
}

function ERR_CHANOPRIVSNEEDED(test) {
	test.bypass();
}

function ERR_USERNOTINCHANNEL(test) {
	test.bypass();
}

function ERR_UNKNOWNMODE(test) {
	test.bypass();
}

function RPL_CHANNELMODEIS(test) {
	test.bypass();
}

function RPL_UNIQOPIS(test) {
	test.bypass();
}


module.exports = {
	makeChannelModerated,
	makeChannelInviteOnly,
	addInviteMask,
	giveChanOpPrivileges,
	giveVoice,
	removeSecretFlag,
	setChannelKey,
	removeChannelKey,
	setUserLimit,
	removeUserLimit,
	listBanMasks,
	preventAllJoins,
	preventJoinsFromHostmask,
	preventJoinsFromHostmaskWithException,
	preventJoinsFromHostmaskWithExceptionConsolidated,
	listExceptionMasks,
	listInvitationMasks,
	showChannelCreator,
	ERR_NEEDMOREPARAMS,
	ERR_KEYSET,
	ERR_NOCHANMODES,
	ERR_CHANOPRIVSNEEDED,
	ERR_USERNOTINCHANNEL,
	ERR_UNKNOWNMODE,
	RPL_CHANNELMODEIS,
	RPL_UNIQOPIS
};
