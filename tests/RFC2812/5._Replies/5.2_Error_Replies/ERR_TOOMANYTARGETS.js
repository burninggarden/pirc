/*
      407    ERR_TOOMANYTARGETS
              "<target> :<error code> recipients. <abort message>"

         - Returned to a client which is attempting to send a
           PRIVMSG/NOTICE using the user@host destination format
           and for a user@host which has several occurrences.

         - Returned to a client which trying to send a
           PRIVMSG/NOTICE to too many recipients.

         - Returned to a client which is attempting to JOIN a safe
           channel using the shortname when there are more than one
           such channel.
*/
