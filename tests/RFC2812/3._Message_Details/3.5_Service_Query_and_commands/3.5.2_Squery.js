/*
3.5.2 Squery

      Command: SQUERY
   Parameters: <servicename> <text>

   The SQUERY command is used similarly to PRIVMSG.  The only difference
   is that the recipient MUST be a service.  This is the only way for a
   text message to be delivered to a service.

   See PRIVMSG for more details on replies and example.

   Examples:

   SQUERY irchelp :HELP privmsg
                                   ; Message to the service with
                                   nickname irchelp.

   SQUERY dict@irc.fr :fr2en blaireau
                                   ; Message to the service with name
                                   dict@irc.fr.


*/
