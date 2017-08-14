/*
4.8 Userhost message

      Command: USERHOST
   Parameters: <nickname> *( SPACE <nickname> )

   The USERHOST command takes a list of up to 5 nicknames, each
   separated by a space character and returns a list of information
   about each nickname that it found.  The returned list has each reply
   separated by a space.

   Numeric Replies:

           RPL_USERHOST                  ERR_NEEDMOREPARAMS

   Example:

   USERHOST Wiz Michael syrk       ; USERHOST request for information on
                                   nicks "Wiz", "Michael", and "syrk"

   :ircd.stealth.net 302 yournick :syrk=+syrk@millennium.stealth.net
                                   ; Reply for user syrk
*/
