
module.exports = {
	UNUSED_SIGNIFIER: '*',
	COLON:            ':',
	SPACE:            ' ',

	/**
	 * All IRC messages end with a CRLF (two bytes). From RFC1456 (section 2.3.1):
	 *
	 *    The protocol messages must be extracted from the contiguous stream of
	 *    octets.  The current solution is to designate two characters, CR and
	 *    LF, as message separators.   Empty  messages  are  silently  ignored,
	 *    which permits  use  of  the  sequence  CR-LF  between  messages
	 *    without extra problems.
	 */
	CRLF:             '\r\n'
};
