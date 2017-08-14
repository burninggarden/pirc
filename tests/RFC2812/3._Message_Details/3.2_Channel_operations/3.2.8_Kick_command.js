/*
3.2.8 Kick command

      Command: KICK
   Parameters: <channel> *( "," <channel> ) <user> *( "," <user> )
               [<comment>]

   The KICK command can be used to request the forced removal of a user
   from a channel.  It causes the <user> to PART from the <channel> by
   force.  For the message to be syntactically correct, there MUST be
   either one channel parameter and multiple user parameter, or as many
   channel parameters as there are user parameters.  If a "comment" is
   given, this will be sent instead of the default message, the nickname
   of the user issuing the KICK.

   The server MUST NOT send KICK messages with multiple channels or
   users to clients.  This is necessarily to maintain backward
   compatibility with old client software.

   Numeric Replies:

           ERR_NEEDMOREPARAMS              ERR_NOSUCHCHANNEL
           ERR_BADCHANMASK                 ERR_CHANOPRIVSNEEDED
           ERR_USERNOTINCHANNEL            ERR_NOTONCHANNEL


   Examples:

   KICK &Melbourne Matthew         ; Command to kick Matthew from
                                   &Melbourne

   KICK #Finnish John :Speaking English
                                   ; Command to kick John from #Finnish
                                   using "Speaking English" as the
                                   reason (comment).

   :WiZ!jto@tolsun.oulu.fi KICK #Finnish John
                                   ; KICK message on channel #Finnish
                                   from WiZ to remove John from channel
*/

function kickUser(test) {
	test.bypass();
}

function kickUserWithReason(test) {
	test.bypass();
}

function receiveKickMessage(test) {
	test.bypass();
}

function ERR_NEEDMOREPARAMS(test) {
	test.bypass();
}

function ERR_BADCHANMASK(test) {
	test.bypass();
}

function ERR_USERNOTINCHANNEL(test) {
	test.bypass();
}

function ERR_NOSUCHCHANNEL(test) {
	test.bypass();
}

function ERR_CHANOPRIVSNEEDED(test) {
	test.bypass();
}

function ERR_NOTONCHANNEL(test) {
	test.bypass();
}

module.exports = {
	kickUser,
	kickUserWithReason,
	receiveKickMessage,
	ERR_NEEDMOREPARAMS,
	ERR_BADCHANMASK,
	ERR_USERNOTINCHANNEL,
	ERR_NOSUCHCHANNEL,
	ERR_CHANOPRIVSNEEDED,
	ERR_NOTONCHANNEL
};
