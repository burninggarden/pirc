/*
       485    ERR_UNIQOPPRIVSNEEDED
              ":You're not the original channel operator"

         - Any MODE requiring "channel creator" privileges MUST
           return this error if the client making the attempt is not
           a chanop on the specified channel.
*/
