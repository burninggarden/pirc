/*
       255    RPL_LUSERME
              ":I have <integer> clients and <integer>
                servers"

         - In processing an LUSERS message, the server
           sends a set of replies from RPL_LUSERCLIENT,
           RPL_LUSEROP, RPL_USERUNKNOWN,
           RPL_LUSERCHANNELS and RPL_LUSERME.  When
           replying, a server MUST send back
           RPL_LUSERCLIENT and RPL_LUSERME.  The other
           replies are only sent back if a non-zero count
           is found for them.
*/
