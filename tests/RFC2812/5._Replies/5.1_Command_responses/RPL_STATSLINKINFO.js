/*
       211    RPL_STATSLINKINFO
              "<linkname> <sendq> <sent messages>
               <sent Kbytes> <received messages>
               <received Kbytes> <time open>"

         - reports statistics on a connection.  <linkname>
           identifies the particular connection, <sendq> is
           the amount of data that is queued and waiting to be
           sent <sent messages> the number of messages sent,
           and <sent Kbytes> the amount of data sent, in
           Kbytes. <received messages> and <received Kbytes>
           are the equivalent of <sent messages> and <sent
           Kbytes> for received data, respectively.  <time
           open> indicates how long ago the connection was
           opened, in seconds.
*/
