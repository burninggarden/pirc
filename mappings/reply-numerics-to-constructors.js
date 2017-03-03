var req = require('req');

var ReplyNumerics = req('/constants/reply-numerics');


function load(key) {
	return req('/lib/server/messages/' + key);
}

module.exports = {

	[ReplyNumerics.RPL_WELCOME]:          load('welcome'),                // 001
	[ReplyNumerics.RPL_YOURHOST]:         load('your-host'),              // 002
	[ReplyNumerics.RPL_CREATED]:          load('created'),                // 003
	[ReplyNumerics.RPL_MYINFO]:           load('my-info'),                // 004
	[ReplyNumerics.RPL_BOUNCE]:           load('bounce'),                 // 005

	[ReplyNumerics.RPL_YOURID]:           load('your-id'),                // 042

	[ReplyNumerics.RPL_STATSCONN]:        load('stats-conn'),             // 250
	[ReplyNumerics.RPL_LUSERCLIENT]:      load('l-user-client'),          // 251
	[ReplyNumerics.RPL_LUSEROP]:          load('l-user-op'),              // 252
	[ReplyNumerics.RPL_LUSERUNKNOWN]:     load('l-user-unknown'),         // 253

	[ReplyNumerics.RPL_LUSERCHANNELS]:    load('l-user-channels'),        // 254
	[ReplyNumerics.RPL_LUSERME]:          load('l-user-me'),              // 255

	[ReplyNumerics.RPL_LOCALUSERS]:       load('local-users'),            // 265

	[ReplyNumerics.RPL_GLOBALUSERS]:      load('global-users'),           // 266

	[ReplyNumerics.RPL_AWAY]:             load('away'),                   // 301

	[ReplyNumerics.RPL_WHOISUSER]:        load('whois-user'),             // 311
	[ReplyNumerics.RPL_WHOISSERVER]:      load('whois-server'),           // 312

	[ReplyNumerics.RPL_WHOISIDLE]:        load('whois-idle'),             // 317

	[ReplyNumerics.RPL_ENDOFWHOIS]:       load('end-of-whois'),           // 318
	[ReplyNumerics.RPL_WHOISCHANNELS]:    load('whois-channels'),         // 319

	[ReplyNumerics.RPL_CHANNEL_URL]:      load('channel-url'),            // 328

	[ReplyNumerics.RPL_WHOISACCOUNT]:     load('whois-account'),          // 330

	[ReplyNumerics.RPL_TOPIC]:            load('channel-topic'),          // 332
	[ReplyNumerics.RPL_TOPICWHOTIME]:     load('channel-topic-details'),  // 333

	[ReplyNumerics.RPL_NAMREPLY]:         load('names-reply'),            // 353

	[ReplyNumerics.RPL_ENDOFNAMES]:       load('end-of-names'),           // 366

	[ReplyNumerics.RPL_MOTD]:             load('motd'),                   // 372

	[ReplyNumerics.RPL_MOTDSTART]:        load('motd-start'),             // 375
	[ReplyNumerics.RPL_ENDOFMOTD]:        load('end-of-motd'),            // 376

	[ReplyNumerics.RPL_WHOISHOST]:        load('whois-host'),             // 378
	[ReplyNumerics.RPL_WHOISMODES]:       load('whois-modes'),            // 379

	[ReplyNumerics.ERR_NOSUCHNICK]:       load('no-such-nick'),           // 401
	[ReplyNumerics.ERR_NOSUCHCHANNEL]:    load('no-such-channel'),        // 403

	[ReplyNumerics.ERR_NOMOTD]:           load('no-motd'),                // 422

	[ReplyNumerics.ERR_ERRONEUSNICKNAME]: load('erroneous-nickname'),     // 432
	[ReplyNumerics.ERR_NICKNAMEINUSE]:    load('nickname-in-use'),        // 433

	[ReplyNumerics.ERR_NOTONCHANNEL]:     load('not-on-channel'),         // 442

	[ReplyNumerics.ERR_NOTREGISTERED]:    load('not-registered'),         // 451

	[ReplyNumerics.ERR_NEEDMOREPARAMS]:   load('need-more-params'),       // 461

	[ReplyNumerics.ERR_LINKCHANNEL]:      load('link-channel'),           // 470
	[ReplyNumerics.ERR_CHANNELISFULL]:    load('channel-is-full'),        // 471

	[ReplyNumerics.ERR_UNKNOWNMODE]:      load('unknown-mode'),           // 472

	[ReplyNumerics.ERR_NEEDREGGEDNICK]:   load('need-regged-nick'),       // 477

	[ReplyNumerics.RPL_WHOISSECURE]:      load('whois-secure')            // 671

};

