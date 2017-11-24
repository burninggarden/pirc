

var
	Enum_Commands      = req('/lib/enum/commands'),
	Enum_Replies       = req('/lib/enum/replies'),
	Enum_ReplyNumerics = req('/lib/enum/reply-numerics');

var
	has = req('/lib/utilities/has');


function getConstructorForCommand(command) {
	switch (command) {
		case Enum_Commands.AWAY:
			return req('/lib/messages/commands/away');

		case Enum_Commands.CAP:
			return req('/lib/messages/commands/cap');

		case Enum_Commands.ERROR:
			return req('/lib/messages/commands/error');

		case Enum_Commands.JOIN:
			return req('/lib/messages/commands/join');

		case Enum_Commands.MODE:
			return req('/lib/messages/commands/mode');

		case Enum_Commands.NICK:
			return req('/lib/messages/commands/nick');

		case Enum_Commands.NOTICE:
			return req('/lib/messages/commands/notice');

		case Enum_Commands.OPER:
			return req('/lib/messages/commands/oper');

		case Enum_Commands.PART:
			return req('/lib/messages/commands/part');

		case Enum_Commands.PASS:
			return req('/lib/messages/commands/pass');

		case Enum_Commands.PING:
			return req('/lib/messages/commands/ping');

		case Enum_Commands.PONG:
			return req('/lib/messages/commands/pong');

		case Enum_Commands.PRIVMSG:
			return req('/lib/messages/commands/private');

		case Enum_Commands.QUIT:
			return req('/lib/messages/commands/quit');

		case Enum_Commands.RESTART:
			return req('/lib/messages/commands/restart');

		case Enum_Commands.TOPIC:
			return req('/lib/messages/commands/topic');

		case Enum_Commands.USER:
			return req('/lib/messages/commands/user');

		case Enum_Commands.WHO:
			return req('/lib/messages/commands/who');

		case Enum_Commands.WHOIS:
			return req('/lib/messages/commands/whois');

		case Enum_Commands.WHOWAS:
			return req('/lib/messages/commands/whowas');

		default:
			throw new Error('Invalid command: ' + command);
	}
}

function getConstructorForReply(reply) {
	switch (reply) {
		case Enum_Replies.RPL_WELCOME:
			return req('/lib/messages/replies/welcome');

		case Enum_Replies.RPL_YOURHOST:
			return req('/lib/messages/replies/your-host');

		case Enum_Replies.RPL_CREATED:
			return req('/lib/messages/replies/created');

		case Enum_Replies.RPL_MYINFO:
			return req('/lib/messages/replies/my-info');

		case Enum_Replies.RPL_BOUNCE:
			return req('/lib/messages/replies/bounce');

		case Enum_Replies.RPL_ISUPPORT:
			return req('/lib/messages/replies/i-support');

		case Enum_Replies.RPL_UMODEIS:
			return req('/lib/messages/replies/user-mode-is');

		case Enum_Replies.RPL_STATSDLINE:
			return req('/lib/messages/replies/stats-dline');

		case Enum_Replies.RPL_LUSERCLIENT:
			return req('/lib/messages/replies/l-user-client');

		case Enum_Replies.RPL_LUSEROP:
			return req('/lib/messages/replies/l-user-op');

		case Enum_Replies.RPL_LUSERUNKNOWN:
			return req('/lib/messages/replies/l-user-unknown');

		case Enum_Replies.RPL_LUSERCHANNELS:
			return req('/lib/messages/replies/l-user-channels');

		case Enum_Replies.RPL_LUSERME:
			return req('/lib/messages/replies/l-user-me');

		case Enum_Replies.RPL_LOCALUSERS:
			return req('/lib/messages/replies/local-users');

		case Enum_Replies.RPL_GLOBALUSERS:
			return req('/lib/messages/replies/global-users');

		case Enum_Replies.RPL_AWAY:
			return req('/lib/messages/replies/away');

		case Enum_Replies.RPL_USERHOST:
			return req('/lib/messages/replies/user-host');

		case Enum_Replies.RPL_UNAWAY:
			return req('/lib/messages/replies/unaway');

		case Enum_Replies.RPL_NOWAWAY:
			return req('/lib/messages/replies/now-away');

		case Enum_Replies.RPL_WHOISUSER:
			return req('/lib/messages/replies/whois-user');

		case Enum_Replies.RPL_WHOISSERVER:
			return req('/lib/messages/replies/whois-server');

		case Enum_Replies.RPL_WHOISIDLE:
			return req('/lib/messages/replies/whois-idle');

		case Enum_Replies.RPL_ENDOFWHOIS:
			return req('/lib/messages/replies/end-of-whois');

		case Enum_Replies.RPL_WHOISCHANNELS:
			return req('/lib/messages/replies/whois-channels');

		case Enum_Replies.RPL_CHANNEL_URL:
			return req('/lib/messages/replies/channel-url');

		case Enum_Replies.RPL_WHOISACCOUNT:
			return req('/lib/messages/replies/whois-account');

		case Enum_Replies.RPL_NOTOPIC:
			return req('/lib/messages/replies/no-channel-topic');

		case Enum_Replies.RPL_TOPIC:
			return req('/lib/messages/replies/channel-topic');

		case Enum_Replies.RPL_TOPICWHOTIME:
			return req('/lib/messages/replies/channel-topic-details');

		case Enum_Replies.RPL_NAMREPLY:
			return req('/lib/messages/replies/names-reply');

		case Enum_Replies.RPL_ENDOFNAMES:
			return req('/lib/messages/replies/end-of-names');

		case Enum_Replies.RPL_MOTD:
			return req('/lib/messages/replies/motd');

		case Enum_Replies.RPL_MOTDSTART:
			return req('/lib/messages/replies/motd-start');

		case Enum_Replies.RPL_ENDOFMOTD:
			return req('/lib/messages/replies/end-of-motd');

		case Enum_Replies.RPL_YOUREOPER:
			return req('/lib/messages/replies/you-are-operator');

		case Enum_Replies.RPL_WHOISHOST:
			return req('/lib/messages/replies/whois-host');

		case Enum_Replies.RPL_WHOISMODES:
			return req('/lib/messages/replies/whois-modes');

		case Enum_Replies.ERR_NOSUCHNICK:
			return req('/lib/messages/replies/no-such-nick');

		case Enum_Replies.ERR_NOSUCHSERVER:
			return req('/lib/messages/replies/no-such-server');

		case Enum_Replies.ERR_NOSUCHCHANNEL:
			return req('/lib/messages/replies/no-such-channel');

		case Enum_Replies.ERR_UNKNOWNCOMMAND:
			return req('/lib/messages/replies/unknown-command');

		case Enum_Replies.ERR_NOMOTD:
			return req('/lib/messages/replies/no-motd');

		case Enum_Replies.ERR_NONICKNAMEGIVEN:
			return req('/lib/messages/replies/no-nickname-given');

		case Enum_Replies.ERR_ERRONEUSNICKNAME:
			return req('/lib/messages/replies/erroneous-nickname');

		case Enum_Replies.ERR_NICKNAMEINUSE:
			return req('/lib/messages/replies/nickname-in-use');

		case Enum_Replies.ERR_NOTONCHANNEL:
			return req('/lib/messages/replies/not-on-channel');

		case Enum_Replies.ERR_NOTIMPLEMENTED:
			return req('/lib/messages/replies/not-implemented');

		case Enum_Replies.ERR_NOTREGISTERED:
			return req('/lib/messages/replies/not-registered');

		case Enum_Replies.ERR_NEEDMOREPARAMS:
			return req('/lib/messages/replies/need-more-parameters');

		case Enum_Replies.ERR_ALREADYREGISTRED:
			return req('/lib/messages/replies/already-registered');

		case Enum_Replies.ERR_PASSWDMISMATCH:
			return req('/lib/messages/replies/password-mismatch');

		case Enum_Replies.ERR_LINKCHANNEL:
			return req('/lib/messages/replies/link-channel');

		case Enum_Replies.ERR_CHANNELISFULL:
			return req('/lib/messages/replies/channel-is-full');

		case Enum_Replies.ERR_UNKNOWNMODE:
			return req('/lib/messages/replies/unknown-mode');

		case Enum_Replies.ERR_INVITEONLYCHAN:
			return req('/lib/messages/replies/invite-only-channel');

		case Enum_Replies.ERR_NEEDREGGEDNICK:
			return req('/lib/messages/replies/need-regged-nick');

		case Enum_Replies.ERR_NOCHANMODES:
			return req('/lib/messages/replies/no-channel-modes');

		case Enum_Replies.ERR_NOPRIVILEGES:
			return req('/lib/messages/replies/no-privileges');

		case Enum_Replies.ERR_CHANOPRIVSNEEDED:
			return req('/lib/messages/replies/channel-operator-privileges-needed');

		case Enum_Replies.ERR_RESTRICTED:
			return req('/lib/messages/replies/restricted');

		case Enum_Replies.ERR_UMODEUNKNOWNFLAG:
			return req('/lib/messages/replies/user-mode-unknown-flag');

		case Enum_Replies.ERR_USERSDONTMATCH:
			return req('/lib/messages/replies/users-dont-match');

		case Enum_Replies.RPL_WHOISSECURE:
			return req('/lib/messages/replies/whois-secure');

		default:
			throw new Error('Invalid reply: ' + reply);
	}
}

function getConstructorForReplyNumeric(reply_numeric) {
	var reply = getReplyForReplyNumeric(reply_numeric);

	return getConstructorForReply(reply);
}

function getReplyForReplyNumeric(reply_numeric) {
	var reply;

	for (reply in Enum_ReplyNumerics) {
		let current_numeric = Enum_ReplyNumerics[reply];

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
	if (has(Enum_Commands, command_or_reply)) {
		return createMessageForCommand(command_or_reply);
	} else if (has(Enum_ReplyNumerics, command_or_reply)) {
		return createMessageForReplyNumeric(command_or_reply);
	} else if (has(Enum_Replies, command_or_reply)) {
		return createMessageForReply(command_or_reply);
	} else {
		throw new Error('Invalid command or reply: ' + command_or_reply);
	}
}

module.exports = createMessage;
