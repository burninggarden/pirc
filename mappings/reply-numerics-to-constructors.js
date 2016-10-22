var req = require('req');

var ReplyNumerics = req('/constants/reply-numerics');


function load(key) {
	return req('/lib/server/messages/' + key);
}

module.exports = {

	[ReplyNumerics.RPL_WELCOME]:       load('welcome'),                // 001
	[ReplyNumerics.RPL_YOURHOST]:      load('your-host'),              // 002
	[ReplyNumerics.RPL_CREATED]:       load('created'),                // 003
	[ReplyNumerics.RPL_MYINFO]:        load('my-info'),                // 004
	[ReplyNumerics.RPL_BOUNCE]:        load('bounce'),                 // 005

	[ReplyNumerics.RPL_YOURID]:        load('your-id'),                // 042

	[ReplyNumerics.RPL_LUSERCLIENT]:   load('l-user-client'),          // 251
	[ReplyNumerics.RPL_LUSEROP]:       load('l-user-op'),              // 252

	[ReplyNumerics.RPL_LUSERCHANNELS]: load('l-user-channels'),        // 254
	[ReplyNumerics.RPL_LUSERME]:       load('l-user-me'),              // 255

	[ReplyNumerics.RPL_LOCALUSERS]:    load('local-users'),            // 265

	[ReplyNumerics.RPL_GLOBALUSERS]:   load('global-users'),           // 266

	[ReplyNumerics.RPL_TOPIC]:         load('channel-topic'),          // 332
	[ReplyNumerics.RPL_TOPICWHOTIME]:  load('channel-topic-details'),  // 333

	[ReplyNumerics.RPL_NAMREPLY]:      load('names-reply'),            // 353

	[ReplyNumerics.RPL_ENDOFNAMES]:    load('end-of-names'),           // 366

	[ReplyNumerics.RPL_MOTD]:          load('motd'),                   // 372

	[ReplyNumerics.RPL_MOTDSTART]:     load('motd-start'),             // 375
	[ReplyNumerics.RPL_ENDOFMOTD]:     load('end-of-motd'),            // 376

	[ReplyNumerics.ERR_NOMOTD]:        load('no-motd'),                // 422

	[ReplyNumerics.ERR_NICKNAMEINUSE]: load('nickname-in-use')         // 433

};

