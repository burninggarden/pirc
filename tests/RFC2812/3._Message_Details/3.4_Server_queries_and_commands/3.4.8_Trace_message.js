/*
3.4.8 Trace message

      Command: TRACE
   Parameters: [ <target> ]

   TRACE command is used to find the route to specific server and
   information about its peers.  Each server that processes this command
   MUST report to the sender about it.  The replies from pass-through
   links form a chain, which shows route to destination.  After sending
   this reply back, the query MUST be sent to the next server until
   given <target> server is reached.

   TRACE command is used to find the route to specific server.  Each
   server that processes this message MUST tell the sender about it by
   sending a reply indicating it is a pass-through link, forming a chain
   of replies.  After sending this reply back, it MUST then send the
   TRACE message to the next server until given server is reached.  If
   the <target> parameter is omitted, it is RECOMMENDED that TRACE
   command sends a message to the sender telling which servers the local
   server has direct connection to.

   If the destination given by <target> is an actual server, the
   destination server is REQUIRED to report all servers, services and
   operators which are connected to it; if the command was issued by an
   operator, the server MAY also report all users which are connected to
   it.  If the destination given by <target> is a nickname, then only a
   reply for that nickname is given.  If the <target> parameter is
   omitted, it is RECOMMENDED that the TRACE command is parsed as
   targeted to the processing server.

   Wildcards are allowed in the <target> parameter.

   Numeric Replies:

           ERR_NOSUCHSERVER

      If the TRACE message is destined for another server, all
      intermediate servers must return a RPL_TRACELINK reply to indicate
      that the TRACE passed through it and where it is going next.

           RPL_TRACELINK

      A TRACE reply may be composed of any number of the following
      numeric replies.

           RPL_TRACECONNECTING           RPL_TRACEHANDSHAKE
           RPL_TRACEUNKNOWN              RPL_TRACEOPERATOR
           RPL_TRACEUSER                 RPL_TRACESERVER
           RPL_TRACESERVICE              RPL_TRACENEWTYPE
           RPL_TRACECLASS                RPL_TRACELOG
           RPL_TRACEEND

   Examples:

   TRACE *.oulu.fi                 ; TRACE to a server matching
                                   *.oulu.fi

*/
