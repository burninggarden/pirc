

var
	Commands      = req('/lib/constants/commands'),
	Replies       = req('/lib/constants/replies'),
	ErrorReasons  = req('/lib/constants/error-reasons'),
	ReplyNumerics = req('/lib/constants/reply-numerics');

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

function getConstructorForReply(reply) {
	var InvalidReplyError = req('/lib/errors/invalid-reply');

	switch (reply) {
		case Replies.RPL_WELCOME:
			return req('/lib/messages/replies/welcome');

		case Replies.RPL_YOURHOST:
			return req('/lib/messages/replies/your-host');

		case Replies.RPL_CREATED:
			return req('/lib/messages/replies/created');

		case Replies.RPL_MYINFO:
			return req('/lib/messages/replies/my-info');

		case Replies.RPL_BOUNCE:
			return req('/lib/messages/replies/bounce');

		case Replies.RPL_ISUPPORT:
			return req('/lib/messages/replies/i-support');

		case Replies.RPL_YOURID:
			return req('/lib/messages/replies/your-id');

		case Replies.RPL_STATSDLINE:
			return req('/lib/messages/replies/stats-dline');

		case Replies.RPL_LUSERCLIENT:
			return req('/lib/messages/replies/l-user-client');

		case Replies.RPL_LUSEROP:
			return req('/lib/messages/replies/l-user-op');

		case Replies.RPL_LUSERUNKNOWN:
			return req('/lib/messages/replies/l-user-unknown');

		case Replies.RPL_LUSERCHANNELS:
			return req('/lib/messages/replies/l-user-channels');

		case Replies.RPL_LUSERME:
			return req('/lib/messages/replies/l-user-me');

		case Replies.RPL_LOCALUSERS:
			return req('/lib/messages/replies/local-users');

		case Replies.RPL_GLOBALUSERS:
			return req('/lib/messages/replies/global-users');

		case Replies.RPL_AWAY:
			return req('/lib/messages/replies/away');

		case Replies.RPL_USERHOST:
			return req('/lib/messages/replies/user-host');

		case Replies.RPL_WHOISUSER:
			return req('/lib/messages/replies/whois-user');

		case Replies.RPL_WHOISSERVER:
			return req('/lib/messages/replies/whois-server');

		case Replies.RPL_WHOISIDLE:
			return req('/lib/messages/replies/whois-idle');

		case Replies.RPL_ENDOFWHOIS:
			return req('/lib/messages/replies/end-of-whois');

		case Replies.RPL_WHOISCHANNELS:
			return req('/lib/messages/replies/whois-channels');

		case Replies.RPL_CHANNEL_URL:
			return req('/lib/messages/replies/channel-url');

		case Replies.RPL_WHOISACCOUNT:
			return req('/lib/messages/replies/whois-account');

		case Replies.RPL_NOTOPIC:
			return req('/lib/messages/replies/no-channel-topic');

		case Replies.RPL_TOPIC:
			return req('/lib/messages/replies/channel-topic');

		case Replies.RPL_TOPICWHOTIME:
			return req('/lib/messages/replies/channel-topic-details');

		case Replies.RPL_NAMREPLY:
			return req('/lib/messages/replies/names-reply');

		case Replies.RPL_ENDOFNAMES:
			return req('/lib/messages/replies/end-of-names');

		case Replies.RPL_MOTD:
			return req('/lib/messages/replies/motd');

		case Replies.RPL_MOTDSTART:
			return req('/lib/messages/replies/motd-start');

		case Replies.RPL_ENDOFMOTD:
			return req('/lib/messages/replies/end-of-motd');

		case Replies.RPL_WHOISHOST:
			return req('/lib/messages/replies/whois-host');

		case Replies.RPL_WHOISMODES:
			return req('/lib/messages/replies/whois-modes');

		case Replies.ERR_NOSUCHNICK:
			return req('/lib/messages/replies/no-such-nick');

		case Replies.ERR_NOSUCHSERVER:
			return req('/lib/messages/replies/no-such-server');

		case Replies.ERR_NOSUCHCHANNEL:
			return req('/lib/messages/replies/no-such-channel');

		case Replies.ERR_UNKNOWNCOMMAND:
			return req('/lib/messages/replies/unknown-command');

		case Replies.ERR_NOMOTD:
			return req('/lib/messages/replies/no-motd');

		case Replies.ERR_NONICKNAMEGIVEN:
			return req('/lib/messages/replies/no-nickname-given');

		case Replies.ERR_ERRONEUSNICKNAME:
			return req('/lib/messages/replies/erroneous-nickname');

		case Replies.ERR_NICKNAMEINUSE:
			return req('/lib/messages/replies/nickname-in-use');

		case Replies.ERR_NOTONCHANNEL:
			return req('/lib/messages/replies/not-on-channel');

		case Replies.ERR_NOTIMPLEMENTED:
			return req('/lib/messages/replies/not-implemented');

		case Replies.ERR_NOTREGISTERED:
			return req('/lib/messages/replies/not-registered');

		case Replies.ERR_NEEDMOREPARAMS:
			return req('/lib/messages/replies/need-more-parameters');

		case Replies.ERR_LINKCHANNEL:
			return req('/lib/messages/replies/link-channel');

		case Replies.ERR_CHANNELISFULL:
			return req('/lib/messages/replies/channel-is-full');

		case Replies.ERR_UNKNOWNMODE:
			return req('/lib/messages/replies/unknown-mode');

		case Replies.ERR_INVITEONLYCHAN:
			return req('/lib/messages/replies/invite-only-channel');

		case Replies.ERR_NEEDREGGEDNICK:
			return req('/lib/messages/replies/need-regged-nick');

		case Replies.ERR_NOCHANMODES:
			return req('/lib/messages/replies/no-channel-modes');

		case Replies.ERR_NOPRIVILEGES:
			return req('/lib/messages/replies/no-privileges');

		case Replies.ERR_UMODEUNKNOWNFLAG:
			return req('/lib/messages/replies/umode-unknown-flag');

		case Replies.ERR_USERSDONTMATCH:
			return req('/lib/messages/replies/users-dont-match');

		case Replies.RPL_WHOISSECURE:
			return req('/lib/messages/replies/whois-secure');

		case null:
		case undefined:
			throw new InvalidReplyError(reply, ErrorReasons.OMITTED);

		default:
			throw new InvalidReplyError(reply, ErrorReasons.WRONG_TYPE);
	}
}

function getConstructorForReplyNumeric(reply_numeric) {
	var reply = getReplyForReplyNumeric(reply_numeric);

	return getConstructorForReply(reply);
}

function getReplyForReplyNumeric(reply_numeric) {
	var reply;

	for (reply in ReplyNumerics) {
		let current_numeric = ReplyNumerics[reply];

		if (current_numeric === reply_numeric) {
			return reply;
		}
	}

	return null;
}

function createMessageForCommand(command) {
	var constructor = getConstructorForCommand(command);

	return new constructor();
}

function createMessageForReply(reply) {
	var constructor = getConstructorForReply(reply);

	return new constructor();
}

function createMessageForReplyNumeric(reply_numeric) {
	var constructor = getConstructorForReplyNumeric(reply_numeric);

	return new constructor();
}

function createMessage(command_or_reply) {
	if (has(Commands, command_or_reply)) {
		return createMessageForCommand(command_or_reply);
	} else if (has(ReplyNumerics, command_or_reply)) {
		return createMessageForReplyNumeric(command_or_reply);
	} else if (has(Replies, command_or_reply)) {
		return createMessageForReply(command_or_reply);
	}
}

module.exports = createMessage;
