/*
       235    RPL_SERVLISTEND
              "<mask> <type> :End of service listing"

         - When listing services in reply to a SERVLIST message,
           a server is required to send the list back using the
           RPL_SERVLIST and RPL_SERVLISTEND messages.  A separate
           RPL_SERVLIST is sent for each service.  After the
           services have been listed (or if none present) a
           RPL_SERVLISTEND MUST be sent.
*/
