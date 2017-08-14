/*
4.7 Operwall message

      Command: WALLOPS
   Parameters: <Text to be sent>

   The WALLOPS command is used to send a message to all currently
   connected users who have set the 'w' user mode for themselves.  (See
   Section 3.1.5 "User modes").

   After implementing WALLOPS as a user command it was found that it was
   often and commonly abused as a means of sending a message to a lot of
   people.  Due to this, it is RECOMMENDED that the implementation of
   WALLOPS allows and recognizes only servers as the originators of
   WALLOPS.

   Numeric Replies:

           ERR_NEEDMOREPARAMS

   Example:

   :csd.bu.edu WALLOPS :Connect '*.uiuc.edu 6667' from Joshua ; WALLOPS
                                   message from csd.bu.edu announcing a
                                   CONNECT message it received from
                                   Joshua and acted upon.

*/
