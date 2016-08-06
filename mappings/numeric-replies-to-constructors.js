var req = require('req');

var NumericReplies = req('/constants/numeric-replies');


function load(key) {
	return req('/lib/server/messages/' + key);
}

module.exports = {

	[NumericReplies.RPL_WELCOME]:       load('welcome'),                // 001
	[NumericReplies.RPL_YOURHOST]:      load('your-host'),              // 002
	[NumericReplies.RPL_CREATED]:       load('created'),                // 003
	[NumericReplies.RPL_MYINFO]:        load('my-info'),                // 004
	[NumericReplies.RPL_BOUNCE]:        load('bounce'),                 // 005

	[NumericReplies.RPL_YOURID]:        load('your-id'),                // 042

	[NumericReplies.RPL_LUSERCLIENT]:   load('l-user-client'),          // 251
	[NumericReplies.RPL_LUSEROP]:       load('l-user-op'),              // 252

	[NumericReplies.RPL_LUSERCHANNELS]: load('l-user-channels'),        // 254
	[NumericReplies.RPL_LUSERME]:       load('l-user-me'),              // 255

	[NumericReplies.RPL_LOCALUSERS]:    load('local-users'),            // 265

	[NumericReplies.RPL_GLOBALUSERS]:   load('global-users'),           // 266

	[NumericReplies.RPL_TOPIC]:         load('channel-topic'),          // 332
	[NumericReplies.RPL_TOPICWHOTIME]:  load('channel-topic-details'),  // 333

	[NumericReplies.RPL_NAMREPLY]:      load('names-reply'),            // 353

	[NumericReplies.RPL_ENDOFNAMES]:    load('end-of-names'),           // 366

	[NumericReplies.RPL_MOTD]:          load('motd'),                   // 372

	[NumericReplies.RPL_MOTDSTART]:     load('motd-start'),             // 375
	[NumericReplies.RPL_ENDOFMOTD]:     load('end-of-motd'),            // 376

	[NumericReplies.ERR_NICKNAMEINUSE]: load('nickname-in-use')         // 433

};

