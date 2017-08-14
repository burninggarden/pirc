/*
       367    RPL_BANLIST
              "<channel> <banmask>"

         - When listing the active 'bans' for a given channel,
           a server is required to send the list back using the
           RPL_BANLIST and RPL_ENDOFBANLIST messages.  A separate
           RPL_BANLIST is sent for each active banmask.  After the
           banmasks have been listed (or if none present) a
           RPL_ENDOFBANLIST MUST be sent.
*/
