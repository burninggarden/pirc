/*
       315    RPL_ENDOFWHO
              "<name> :End of WHO list"

         - The RPL_WHOREPLY and RPL_ENDOFWHO pair are used
           to answer a WHO message.  The RPL_WHOREPLY is only
           sent if there is an appropriate match to the WHO
           query.  If there is a list of parameters supplied
           with a WHO message, a RPL_ENDOFWHO MUST be sent
           after processing each list item with <name> being
           the item.
*/
