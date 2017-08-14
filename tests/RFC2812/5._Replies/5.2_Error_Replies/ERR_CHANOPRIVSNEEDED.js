/*
       482    ERR_CHANOPRIVSNEEDED
              "<channel> :You're not channel operator"

         - Any command requiring 'chanop' privileges (such as
           MODE messages) MUST return this error if the client
           making the attempt is not a chanop on the specified
           channel.
*/
