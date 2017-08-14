/*
3.2.2 Part message

      Command: PART
   Parameters: <channel> *( "," <channel> ) [ <Part Message> ]

   The PART command causes the user sending the message to be removed
   from the list of active members for all given channels listed in the
   parameter string.  If a "Part Message" is given, this will be sent
   instead of the default message, the nickname.  This request is always
   granted by the server.

   Servers MUST be able to parse arguments in the form of a list of
   target, but SHOULD NOT use lists when sending PART messages to
   clients.

   Numeric Replies:

           ERR_NEEDMOREPARAMS              ERR_NOSUCHCHANNEL
           ERR_NOTONCHANNEL

   Examples:

   PART #twilight_zone             ; Command to leave channel
                                   "#twilight_zone"

   PART #oz-ops,&group5            ; Command to leave both channels
                                   "&group5" and "#oz-ops".

   :WiZ!jto@tolsun.oulu.fi PART #playzone :I lost
                                   ; User WiZ leaving channel
                                   "#playzone" with the message "I
                                   lost".
*/

function partOne(test) {
	test.bypass();
}

function partMultiple(test) {
	test.bypass();
}

function receivePartMessage(test) {
	test.bypass();
}

function ERR_NEEDMOREPARAMS(test) {
	test.bypass();
}

function ERR_NOTONCHANNEL(test) {
	test.bypass();
}

function ERR_NOSUCHCHANNEL(test) {
	test.bypass();
}

module.exports = {
	partOne,
	partMultiple,
	receivePartMessage,
	ERR_NEEDMOREPARAMS,
	ERR_NOTONCHANNEL,
	ERR_NOSUCHCHANNEL
};
