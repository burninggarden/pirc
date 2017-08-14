/*
3.6.1 Who query

      Command: WHO
   Parameters: [ <mask> [ "o" ] ]

   The WHO command is used by a client to generate a query which returns
   a list of information which 'matches' the <mask> parameter given by
   the client.  In the absence of the <mask> parameter, all visible
   (users who aren't invisible (user mode +i) and who don't have a
   common channel with the requesting client) are listed.  The same
   result can be achieved by using a <mask> of "0" or any wildcard which
   will end up matching every visible user.

   The <mask> passed to WHO is matched against users' host, server, real
   name and nickname if the channel <mask> cannot be found.

   If the "o" parameter is passed only operators are returned according
   to the <mask> supplied.

   Numeric Replies:

           ERR_NOSUCHSERVER
           RPL_WHOREPLY                  RPL_ENDOFWHO

   Examples:

   WHO *.fi                        ; Command to list all users who match
                                   against "*.fi".

   WHO jto* o                      ; Command to list all users with a
                                   match against "jto*" if they are an
                                   operator.

*/
