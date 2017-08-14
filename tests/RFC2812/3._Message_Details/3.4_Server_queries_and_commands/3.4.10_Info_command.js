/*
3.4.10 Info command

      Command: INFO
   Parameters: [ <target> ]

   The INFO command is REQUIRED to return information describing the
   server: its version, when it was compiled, the patchlevel, when it
   was started, and any other miscellaneous information which may be
   considered to be relevant.

   Wildcards are allowed in the <target> parameter.

   Numeric Replies:

           ERR_NOSUCHSERVER
           RPL_INFO                      RPL_ENDOFINFO

   Examples:

   INFO csd.bu.edu                 ; request an INFO reply from
                                   csd.bu.edu

   INFO Angel                      ; request info from the server that
                                   Angel is connected to.

*/
