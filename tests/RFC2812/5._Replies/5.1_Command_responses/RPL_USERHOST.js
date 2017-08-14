/*
       302    RPL_USERHOST
              ":*1<reply> *( " " <reply> )"

         - Reply format used by USERHOST to list replies to
           the query list.  The reply string is composed as
           follows:

           reply = nickname [ "*" ] "=" ( "+" / "-" ) hostname

           The '*' indicates whether the client has registered
           as an Operator.  The '-' or '+' characters represent
           whether the client has set an AWAY message or not
           respectively.
*/
