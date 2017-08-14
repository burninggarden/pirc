/*
3.4.5 Links message

      Command: LINKS
   Parameters: [ [ <remote server> ] <server mask> ]

   With LINKS, a user can list all servernames, which are known by the
   server answering the query.  The returned list of servers MUST match
   the mask, or if no mask is given, the full list is returned.

   If <remote server> is given in addition to <server mask>, the LINKS
   command is forwarded to the first server found that matches that name
   (if any), and that server is then required to answer the query.

   Numeric Replies:

           ERR_NOSUCHSERVER
           RPL_LINKS                        RPL_ENDOFLINKS


   Examples:

   LINKS *.au                      ; Command to list all servers which
                                   have a name that matches *.au;

   LINKS *.edu *.bu.edu            ; Command to list servers matching
                                   *.bu.edu as seen by the first server
                                   matching *.edu.

*/
