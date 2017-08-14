/*
3.4.9 Admin command

      Command: ADMIN
   Parameters: [ <target> ]

   The admin command is used to find information about the administrator
   of the given server, or current server if <target> parameter is
   omitted.  Each server MUST have the ability to forward ADMIN messages
   to other servers.

   Wildcards are allowed in the <target> parameter.

   Numeric Replies:

           ERR_NOSUCHSERVER
           RPL_ADMINME                   RPL_ADMINLOC1
           RPL_ADMINLOC2                 RPL_ADMINEMAIL

   Examples:

   ADMIN tolsun.oulu.fi            ; request an ADMIN reply from
                                   tolsun.oulu.fi

   ADMIN syrk                      ; ADMIN request for the server to
                                   which the user syrk is connected

*/
