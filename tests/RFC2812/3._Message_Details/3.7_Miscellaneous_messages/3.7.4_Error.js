/*
3.7.4 Error

      Command: ERROR
   Parameters: <error message>

   The ERROR command is for use by servers when reporting a serious or
   fatal error to its peers.  It may also be sent from one server to
   another but MUST NOT be accepted from any normal unknown clients.

   Only an ERROR message SHOULD be used for reporting errors which occur
   with a server-to-server link.  An ERROR message is sent to the server
   at the other end (which reports it to appropriate local users and
   logs) and to appropriate local users and logs.  It is not to be
   passed onto any other servers by a server if it is received from a
   server.

   The ERROR message is also used before terminating a client
   connection.

   When a server sends a received ERROR message to its operators, the
   message SHOULD be encapsulated inside a NOTICE message, indicating
   that the client was not responsible for the error.

   Numerics:

           None.


   Examples:

   ERROR :Server *.fi already exists ; ERROR message to the other server
                                   which caused this error.

   NOTICE WiZ :ERROR from csd.bu.edu -- Server *.fi already exists
                                   ; Same ERROR message as above but
                                   sent to user WiZ on the other server.

*/
