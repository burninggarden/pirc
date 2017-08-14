/*
       369    RPL_ENDOFWHOWAS
              "<nick> :End of WHOWAS"

         - When replying to a WHOWAS message, a server MUST use
           the replies RPL_WHOWASUSER, RPL_WHOISSERVER or
           ERR_WASNOSUCHNICK for each nickname in the presented
           list.  At the end of all reply batches, there MUST
           be RPL_ENDOFWHOWAS (even if there was only one reply
           and it was an error).
*/
