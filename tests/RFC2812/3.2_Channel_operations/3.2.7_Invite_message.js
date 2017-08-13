/*
3.2.7 Invite message

      Command: INVITE
   Parameters: <nickname> <channel>

   The INVITE command is used to invite a user to a channel.  The
   parameter <nickname> is the nickname of the person to be invited to
   the target channel <channel>.  There is no requirement that the
   channel the target user is being invited to must exist or be a valid
   channel.  However, if the channel exists, only members of the channel
   are allowed to invite other users.  When the channel has invite-only
   flag set, only channel operators may issue INVITE command.





Kalt                         Informational                     [Page 21]
--------------------------------------------------------------------------------
RFC 2812          Internet Relay Chat: Client Protocol        April 2000


   Only the user inviting and the user being invited will receive
   notification of the invitation.  Other channel members are not
   notified.  (This is unlike the MODE changes, and is occasionally the
   source of trouble for users.)

   Numeric Replies:

           ERR_NEEDMOREPARAMS              ERR_NOSUCHNICK
           ERR_NOTONCHANNEL                ERR_USERONCHANNEL
           ERR_CHANOPRIVSNEEDED
           RPL_INVITING                    RPL_AWAY

   Examples:

   :Angel!wings@irc.org INVITE Wiz #Dust

                                   ; Message to WiZ when he has been
                                   invited by user Angel to channel
                                   #Dust

   INVITE Wiz #Twilight_Zone       ; Command to invite WiZ to
                                   #Twilight_zone
*/


function inviteUser(test) {
	test.bypass();
}

function receiveInviteMessage(test) {
	test.bypass();
}

function ERR_NEEDMOREPARAMS(test) {
	test.bypass();
}

function ERR_NOTONCHANNEL(test) {
	test.bypass();
}

function ERR_CHANOPRIVSNEEDED(test) {
	test.bypass();
}

function ERR_NOSUCHNICK(test) {
	test.bypass();
}

function ERR_USERONCHANNEL(test) {
	test.bypass();
}

function RPL_AWAY(test) {
	test.bypass();
}

module.exports = {
	inviteUser,
	receiveInviteMessage,
	ERR_NEEDMOREPARAMS,
	ERR_NOTONCHANNEL,
	ERR_CHANOPRIVSNEEDED,
	ERR_NOSUCHNICK,
	ERR_USERONCHANNEL,
	RPL_AWAY
};
