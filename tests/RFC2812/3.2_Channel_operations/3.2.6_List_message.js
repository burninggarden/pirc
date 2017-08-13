/*
3.2.6 List message

      Command: LIST
   Parameters: [ <channel> *( "," <channel> ) [ <target> ] ]

   The list command is used to list channels and their topics.  If the
   <channel> parameter is used, only the status of that channel is
   displayed.

   If the <target> parameter is specified, the request is forwarded to
   that server which will generate the reply.

   Wildcards are allowed in the <target> parameter.

   Numeric Replies:

           ERR_TOOMANYMATCHES              ERR_NOSUCHSERVER
           RPL_LIST                        RPL_LISTEND

   Examples:

   LIST                            ; Command to list all channels.

   LIST #twilight_zone,#42         ; Command to list channels
                                   #twilight_zone and #42
*/

function listOneChannel(test) {
	test.bypass();
}

function listMultipleChannels(test) {
	test.bypass();
}

function listAllChannels(test) {
	test.bypass();
}

function ERR_TOOMANYMATCHES(test) {
	test.bypass();
}

function ERR_NOSUCHSERVER(test) {
	test.bypass();
}


module.exports = {
	listOneChannel,
	listMultipleChannels,
	listAllChannels,
	ERR_TOOMANYMATCHES,
	ERR_NOSUCHSERVER
};
