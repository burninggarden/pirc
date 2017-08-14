/*
3.4.7 Connect message

      Command: CONNECT
   Parameters: <target server> <port> [ <remote server> ]

   The CONNECT command can be used to request a server to try to
   establish a new connection to another server immediately.  CONNECT is
   a privileged command and SHOULD be available only to IRC Operators.
   If a <remote server> is given and its mask doesn't match name of the
   parsing server, the CONNECT attempt is sent to the first match of
   remote server. Otherwise the CONNECT attempt is made by the server
   processing the request.

   The server receiving a remote CONNECT command SHOULD generate a
   WALLOPS message describing the source and target of the request.

   Numeric Replies:

           ERR_NOSUCHSERVER              ERR_NOPRIVILEGES
           ERR_NEEDMOREPARAMS


   Examples:

   CONNECT tolsun.oulu.fi 6667     ; Command to attempt to connect local
                                   server to tolsun.oulu.fi on port 6667

*/
