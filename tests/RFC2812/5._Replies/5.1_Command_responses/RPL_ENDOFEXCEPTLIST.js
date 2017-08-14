/*
       349    RPL_ENDOFEXCEPTLIST
              "<channel> :End of channel exception list"

         - When listing the 'exception masks' for a given channel,
           a server is required to send the list back using the
           RPL_EXCEPTLIST and RPL_ENDOFEXCEPTLIST messages.  A
           separate RPL_EXCEPTLIST is sent for each active mask.
           After the masks have been listed (or if none present)
           a RPL_ENDOFEXCEPTLIST MUST be sent.
*/
