

var
	ReplyNumerics = req('/lib/constants/reply-numerics'),
	ErrorReasons  = req('/lib/constants/error-reasons');


function load(key) {
	return req('/lib/server/messages/' + key);
}

function getConstructorForReplyNumeric(reply_numeric) {

	var InvalidReplyNumericError = req('/lib/errors/invalid-reply-numeric');

	switch (reply_numeric) {
		case ReplyNumerics.RPL_WELCOME:
			return load('welcome');

		case ReplyNumerics.RPL_YOURHOST:
			return load('your-host');

		case ReplyNumerics.RPL_CREATED:
			return load('created');

		case ReplyNumerics.RPL_MYINFO:
			return load('my-info');

		case ReplyNumerics.RPL_BOUNCE:
			return load('bounce');

		case ReplyNumerics.RPL_YOURID:
			return load('your-id');

		case ReplyNumerics.RPL_STATSCONN:
			return load('stats-conn');

		case ReplyNumerics.RPL_LUSERCLIENT:
			return load('l-user-client');

		case ReplyNumerics.RPL_LUSEROP:
			return load('l-user-op');

		case ReplyNumerics.RPL_LUSERUNKNOWN:
			return load('l-user-unknown');

		case ReplyNumerics.RPL_LUSERCHANNELS:
			return load('l-user-channels');

		case ReplyNumerics.RPL_LUSERME:
			return load('l-user-me');

		case ReplyNumerics.RPL_LOCALUSERS:
			return load('local-users');

		case ReplyNumerics.RPL_GLOBALUSERS:
			return load('global-users');

		case ReplyNumerics.RPL_AWAY:
			return load('away');

		case ReplyNumerics.RPL_USERHOST:
			return load('user-host');

		case ReplyNumerics.RPL_WHOISUSER:
			return load('whois-user');

		case ReplyNumerics.RPL_WHOISSERVER:
			return load('whois-server');

		case ReplyNumerics.RPL_WHOISIDLE:
			return load('whois-idle');

		case ReplyNumerics.RPL_ENDOFWHOIS:
			return load('end-of-whois');

		case ReplyNumerics.RPL_WHOISCHANNELS:
			return load('whois-channels');

		case ReplyNumerics.RPL_CHANNEL_URL:
			return load('channel-url');

		case ReplyNumerics.RPL_WHOISACCOUNT:
			return load('whois-account');

		case ReplyNumerics.RPL_NOTOPIC:
			return load('no-channel-topic');

		case ReplyNumerics.RPL_TOPIC:
			return load('channel-topic');

		case ReplyNumerics.RPL_TOPICWHOTIME:
			return load('channel-topic-details');

		case ReplyNumerics.RPL_NAMREPLY:
			return load('names-reply');

		case ReplyNumerics.RPL_ENDOFNAMES:
			return load('end-of-names');

		case ReplyNumerics.RPL_MOTD:
			return load('motd');

		case ReplyNumerics.RPL_MOTDSTART:
			return load('motd-start');

		case ReplyNumerics.RPL_ENDOFMOTD:
			return load('end-of-motd');

		case ReplyNumerics.RPL_WHOISHOST:
			return load('whois-host');

		case ReplyNumerics.RPL_WHOISMODES:
			return load('whois-modes');

		case ReplyNumerics.ERR_NOSUCHNICK:
			return load('no-such-nick');

		case ReplyNumerics.ERR_NOSUCHSERVER:
			return load('no-such-server');

		case ReplyNumerics.ERR_NOSUCHCHANNEL:
			return load('no-such-channel');

		case ReplyNumerics.ERR_UNKNOWNCOMMAND:
			return load('unknown-command');

		case ReplyNumerics.ERR_NOMOTD:
			return load('no-motd');

		case ReplyNumerics.ERR_ERRONEUSNICKNAME:
			return load('erroneous-nickname');

		case ReplyNumerics.ERR_NICKNAMEINUSE:
			return load('nickname-in-use');

		case ReplyNumerics.ERR_NOTONCHANNEL:
			return load('not-on-channel');

		case ReplyNumerics.ERR_NOTIMPLEMENTED:
			return load('not-implemented');

		case ReplyNumerics.ERR_NOTREGISTERED:
			return load('not-registered');

		case ReplyNumerics.ERR_NEEDMOREPARAMS:
			return load('need-more-params');

		case ReplyNumerics.ERR_LINKCHANNEL:
			return load('link-channel');

		case ReplyNumerics.ERR_CHANNELISFULL:
			return load('channel-is-full');

		case ReplyNumerics.ERR_UNKNOWNMODE:
			return load('unknown-mode');

		case ReplyNumerics.ERR_NEEDREGGEDNICK:
			return load('need-regged-nick');

		case ReplyNumerics.ERR_NOPRIVILEGES:
			return load('no-privileges');

		case ReplyNumerics.ERR_UMODEUNKNOWNFLAG:
			return load('umode-unknown-flag');

		case ReplyNumerics.ERR_USERSDONTMATCH:
			return load('users-dont-match');

		case ReplyNumerics.RPL_WHOISSECURE:
			return load('whois-secure');

		case null:
		case undefined:
			throw new InvalidReplyNumericError(
				reply_numeric,
				ErrorReasons.OMITTED
			);

		default:
			throw new InvalidReplyNumericError(
				reply_numeric,
				ErrorReasons.WRONG_TYPE
			);
	}
}


function createReply(reply_numeric) {
	var constructor = getConstructorForReplyNumeric(reply_numeric);

	return new constructor();
}

module.exports = createReply;
