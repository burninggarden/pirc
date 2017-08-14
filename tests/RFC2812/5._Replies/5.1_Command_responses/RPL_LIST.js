/*
       322    RPL_LIST
              "<channel> <# visible> :<topic>"

         - Replies RPL_LIST, RPL_LISTEND mark the actual replies
           with data and end of the server's response to a LIST
           command.  If there are no channels available to return,
           only the end reply MUST be sent.
*/
