/*
       347    RPL_ENDOFINVITELIST
              "<channel> :End of channel invite list"

         - When listing the 'invitations masks' for a given channel,
           a server is required to send the list back using the
           RPL_INVITELIST and RPL_ENDOFINVITELIST messages.  A
           separate RPL_INVITELIST is sent for each active mask.
           After the masks have been listed (or if none present) a
           RPL_ENDOFINVITELIST MUST be sent.
*/
