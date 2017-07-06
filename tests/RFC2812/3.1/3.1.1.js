
/*
3.1.1 Password message

      Command: PASS
   Parameters: <password>

   The PASS command is used to set a 'connection password'.  The
   optional password can and MUST be set before any attempt to register
   the connection is made.  Currently this requires that user send a
   PASS command before sending the NICK/USER combination.

   Numeric Replies:

           ERR_NEEDMOREPARAMS              ERR_ALREADYREGISTRED

   Example:

           PASS secretpasswordhere
*/

function testNeedMoreParams(test) {
	test.done();
}

function testAlreadyRegistered(test) {
	test.done();
}

module.exports = {
	testNeedMoreParams,
	testAlreadyRegistered
};
