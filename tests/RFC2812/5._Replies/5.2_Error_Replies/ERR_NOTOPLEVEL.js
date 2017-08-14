/*
       413    ERR_NOTOPLEVEL
              "<mask> :No toplevel domain specified"

         - 412 - 415 are returned by PRIVMSG to indicate that
           the message wasn't delivered for some reason.
           ERR_NOTOPLEVEL and ERR_WILDTOPLEVEL are errors that
           are returned when an invalid use of
           "PRIVMSG $<server>" or "PRIVMSG #<host>" is attempted.
*/
