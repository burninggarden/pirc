/*
       393    RPL_USERS
              ":<username> <ttyline> <hostname>"

         - If the USERS message is handled by a server, the
           replies RPL_USERSTART, RPL_USERS, RPL_ENDOFUSERS and
           RPL_NOUSERS are used.  RPL_USERSSTART MUST be sent
           first, following by either a sequence of RPL_USERS
           or a single RPL_NOUSER.  Following this is
           RPL_ENDOFUSERS.
*/
