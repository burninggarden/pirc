/*
4.6 Users

      Command: USERS
   Parameters: [ <target> ]

   The USERS command returns a list of users logged into the server in a
   format similar to the UNIX commands who(1), rusers(1) and finger(1).
   If disabled, the correct numeric MUST be returned to indicate this.

   Because of the security implications of such a command, it SHOULD be
   disabled by default in server implementations.  Enabling it SHOULD
   require recompiling the server or some equivalent change rather than
   simply toggling an option and restarting the server.  The procedure
   to enable this command SHOULD also include suitable large comments.

   Numeric Replies:

           ERR_NOSUCHSERVER              ERR_FILEERROR
           RPL_USERSSTART                RPL_USERS
           RPL_NOUSERS                   RPL_ENDOFUSERS
           ERR_USERSDISABLED

   Disabled Reply:

           ERR_USERSDISABLED

   Example:

   USERS eff.org                   ; request a list of users logged in
                                   on server eff.org

*/
