/*
4.2 Rehash message

      Command: REHASH
   Parameters: None

   The rehash command is an administrative command which can be used by
   an operator to force the server to re-read and process its
   configuration file.

   Numeric Replies:

           RPL_REHASHING                 ERR_NOPRIVILEGES


   Example:

   REHASH                          ; message from user with operator
                                   status to server asking it to reread
                                   its configuration file.
*/
