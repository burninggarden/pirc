

var
	Commands      = req('/lib/constants/commands'),
	ReplyNumerics = req('/lib/constants/reply-numerics'),
	ErrorReasons  = req('/lib/constants/error-reasons');

var
	has = req('/lib/utilities/has');


function getConstructorForCommand(command) {
	var InvalidCommandError = req('/lib/errors/invalid-command');

	switch (command) {
		case Commands.CAP:
			return req('/lib/messages/commands/cap');

		case Commands.JOIN:
			return req('/lib/messages/commands/join');

		case Commands.MODE:
			return req('/lib/messages/commands/mode');

		case Commands.NICK:
			return req('/lib/messages/commands/nick');

		case Commands.NOTICE:
			return req('/lib/messages/commands/notice');

		case Commands.PART:
			return req('/lib/messages/commands/part');

		case Commands.PASS:
			return req('/lib/messages/commands/pass');

		case Commands.PING:
			return req('/lib/messages/commands/ping');

		case Commands.PONG:
			return req('/lib/messages/commands/pong');

		case Commands.PRIVMSG:
			return req('/lib/messages/commands/private');

		case Commands.QUIT:
			return req('/lib/messages/commands/quit');

		case Commands.TOPIC:
			return req('/lib/messages/commands/topic');

		case Commands.USER:
			return req('/lib/messages/commands/user');

		case Commands.WHO:
			return req('/lib/messages/commands/who');

		case Commands.WHOIS:
			return req('/lib/messages/commands/whois');

		case Commands.WHOWAS:
			return req('/lib/messages/commands/whowas');

		case null:
		case undefined:
			throw new InvalidCommandError(command, ErrorReasons.OMITTED);

		default:
			throw new InvalidCommandError(command, ErrorReasons.WRONG_TYPE);
	}
}

function getConstructorForReplyNumeric(reply_numeric) {
	var InvalidReplyNumericError = req('/lib/errors/invalid-reply-numeric');

	switch (reply_numeric) {
		case ReplyNumerics.RPL_WELCOME:
			return req('/lib/messages/replies/welcome');

		case ReplyNumerics.RPL_YOURHOST:
			return req('/lib/messages/replies/your-host');

		case ReplyNumerics.RPL_CREATED:
			return req('/lib/messages/replies/created');

		case ReplyNumerics.RPL_MYINFO:
			return req('/lib/messages/replies/my-info');

		case ReplyNumerics.RPL_BOUNCE:
			return req('/lib/messages/replies/bounce');

		case ReplyNumerics.RPL_YOURID:
			return req('/lib/messages/replies/your-id');

		case ReplyNumerics.RPL_STATSCONN:
			return req('/lib/messages/replies/stats-conn');

		case ReplyNumerics.RPL_LUSERCLIENT:
			return req('/lib/messages/replies/l-user-client');

		case ReplyNumerics.RPL_LUSEROP:
			return req('/lib/messages/replies/l-user-op');

		case ReplyNumerics.RPL_LUSERUNKNOWN:
			return req('/lib/messages/replies/l-user-unknown');

		case ReplyNumerics.RPL_LUSERCHANNELS:
			return req('/lib/messages/replies/l-user-channels');

		case ReplyNumerics.RPL_LUSERME:
			return req('/lib/messages/replies/l-user-me');

		case ReplyNumerics.RPL_LOCALUSERS:
			return req('/lib/messages/replies/local-users');

		case ReplyNumerics.RPL_GLOBALUSERS:
			return req('/lib/messages/replies/global-users');

		case ReplyNumerics.RPL_AWAY:
			return req('/lib/messages/replies/away');

		case ReplyNumerics.RPL_USERHOST:
			return req('/lib/messages/replies/user-host');

		case ReplyNumerics.RPL_WHOISUSER:
			return req('/lib/messages/replies/whois-user');

		case ReplyNumerics.RPL_WHOISSERVER:
			return req('/lib/messages/replies/whois-server');

		case ReplyNumerics.RPL_WHOISIDLE:
			return req('/lib/messages/replies/whois-idle');

		case ReplyNumerics.RPL_ENDOFWHOIS:
			return req('/lib/messages/replies/end-of-whois');

		case ReplyNumerics.RPL_WHOISCHANNELS:
			return req('/lib/messages/replies/whois-channels');

		case ReplyNumerics.RPL_CHANNEL_URL:
			return req('/lib/messages/replies/channel-url');

		case ReplyNumerics.RPL_WHOISACCOUNT:
			return req('/lib/messages/replies/whois-account');

		case ReplyNumerics.RPL_NOTOPIC:
			return req('/lib/messages/replies/no-channel-topic');

		case ReplyNumerics.RPL_TOPIC:
			return req('/lib/messages/replies/channel-topic');

		case ReplyNumerics.RPL_TOPICWHOTIME:
			return req('/lib/messages/replies/channel-topic-details');

		case ReplyNumerics.RPL_NAMREPLY:
			return req('/lib/messages/replies/names-reply');

		case ReplyNumerics.RPL_ENDOFNAMES:
			return req('/lib/messages/replies/end-of-names');

		case ReplyNumerics.RPL_MOTD:
			return req('/lib/messages/replies/motd');

		case ReplyNumerics.RPL_MOTDSTART:
			return req('/lib/messages/replies/motd-start');

		case ReplyNumerics.RPL_ENDOFMOTD:
			return req('/lib/messages/replies/end-of-motd');

		case ReplyNumerics.RPL_WHOISHOST:
			return req('/lib/messages/replies/whois-host');

		case ReplyNumerics.RPL_WHOISMODES:
			return req('/lib/messages/replies/whois-modes');

		case ReplyNumerics.ERR_NOSUCHNICK:
			return req('/lib/messages/replies/no-such-nick');

		case ReplyNumerics.ERR_NOSUCHSERVER:
			return req('/lib/messages/replies/no-such-server');

		case ReplyNumerics.ERR_NOSUCHCHANNEL:
			return req('/lib/messages/replies/no-such-channel');

		case ReplyNumerics.ERR_UNKNOWNCOMMAND:
			return req('/lib/messages/replies/unknown-command');

		case ReplyNumerics.ERR_NOMOTD:
			return req('/lib/messages/replies/no-motd');

		case ReplyNumerics.ERR_NONICKNAMEGIVEN:
			return req('/lib/messages/replies/no-nickname-given');

		case ReplyNumerics.ERR_ERRONEUSNICKNAME:
			return req('/lib/messages/replies/erroneous-nickname');

		case ReplyNumerics.ERR_NICKNAMEINUSE:
			return req('/lib/messages/replies/nickname-in-use');

		case ReplyNumerics.ERR_NOTONCHANNEL:
			return req('/lib/messages/replies/not-on-channel');

		case ReplyNumerics.ERR_NOTIMPLEMENTED:
			return req('/lib/messages/replies/not-implemented');

		case ReplyNumerics.ERR_NOTREGISTERED:
			return req('/lib/messages/replies/not-registered');

		case ReplyNumerics.ERR_NEEDMOREPARAMS:
			return req('/lib/messages/replies/need-more-parameters');

		case ReplyNumerics.ERR_LINKCHANNEL:
			return req('/lib/messages/replies/link-channel');

		case ReplyNumerics.ERR_CHANNELISFULL:
			return req('/lib/messages/replies/channel-is-full');

		case ReplyNumerics.ERR_UNKNOWNMODE:
			return req('/lib/messages/replies/unknown-mode');

		case ReplyNumerics.ERR_NEEDREGGEDNICK:
			return req('/lib/messages/replies/need-regged-nick');

		case ReplyNumerics.ERR_NOPRIVILEGES:
			return req('/lib/messages/replies/no-privileges');

		case ReplyNumerics.ERR_UMODEUNKNOWNFLAG:
			return req('/lib/messages/replies/umode-unknown-flag');

		case ReplyNumerics.ERR_USERSDONTMATCH:
			return req('/lib/messages/replies/users-dont-match');

		case ReplyNumerics.RPL_WHOISSECURE:
			return req('/lib/messages/replies/whois-secure');

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

function createMessageForCommand(command) {
	var constructor = getConstructorForCommand(command);

	return new constructor();
}

function createMessageForReplyNumeric(reply_numeric) {
	var constructor = getConstructorForReplyNumeric(reply_numeric);

	return new constructor();
}

function createMessage(command_or_numeric) {
	if (has(Commands, command_or_numeric)) {
		return createMessageForCommand(command_or_numeric);
	} else {
		return createMessageForReplyNumeric(command_or_numeric);
	}
}

module.exports = createMessage;
