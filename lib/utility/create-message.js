

var
	Enum_Commands      = req('/lib/enum/commands'),
	Enum_Replies       = req('/lib/enum/replies'),
	Enum_ReplyNumerics = req('/lib/enum/reply-numerics');

var
	has = req('/lib/utility/has');


function getConstructorForCommand(command) {
	switch (command) {
		case Enum_Commands.AWAY:
			return req('/lib/message/command/away');

		case Enum_Commands.CAP:
			return req('/lib/message/command/cap');

		case Enum_Commands.ERROR:
			return req('/lib/message/command/error');

		case Enum_Commands.JOIN:
			return req('/lib/message/command/join');

		case Enum_Commands.MODE:
			return req('/lib/message/command/mode');

		case Enum_Commands.NICK:
			return req('/lib/message/command/nick');

		case Enum_Commands.NOTICE:
			return req('/lib/message/command/notice');

		case Enum_Commands.OPER:
			return req('/lib/message/command/oper');

		case Enum_Commands.PART:
			return req('/lib/message/command/part');

		case Enum_Commands.PASS:
			return req('/lib/message/command/pass');

		case Enum_Commands.PING:
			return req('/lib/message/command/ping');

		case Enum_Commands.PONG:
			return req('/lib/message/command/pong');

		case Enum_Commands.PRIVMSG:
			return req('/lib/message/command/private');

		case Enum_Commands.QUIT:
			return req('/lib/message/command/quit');

		case Enum_Commands.RESTART:
			return req('/lib/message/command/restart');

		case Enum_Commands.TOPIC:
			return req('/lib/message/command/topic');

		case Enum_Commands.USER:
			return req('/lib/message/command/user');

		case Enum_Commands.WHO:
			return req('/lib/message/command/who');

		case Enum_Commands.WHOIS:
			return req('/lib/message/command/whois');

		case Enum_Commands.WHOWAS:
			return req('/lib/message/command/whowas');

		default:
			throw new Error('Invalid command: ' + command);
	}
}

function getConstructorForReply(reply) {
	switch (reply) {
		case Enum_Replies.RPL_WELCOME:
			return req('/lib/message/reply/welcome');

		case Enum_Replies.RPL_YOURHOST:
			return req('/lib/message/reply/your-host');

		case Enum_Replies.RPL_CREATED:
			return req('/lib/message/reply/created');

		case Enum_Replies.RPL_MYINFO:
			return req('/lib/message/reply/my-info');

		case Enum_Replies.RPL_BOUNCE:
			return req('/lib/message/reply/bounce');

		case Enum_Replies.RPL_ISUPPORT:
			return req('/lib/message/reply/i-support');

		case Enum_Replies.RPL_UMODEIS:
			return req('/lib/message/reply/user-mode-is');

		case Enum_Replies.RPL_STATSDLINE:
			return req('/lib/message/reply/stats-dline');

		case Enum_Replies.RPL_LUSERCLIENT:
			return req('/lib/message/reply/l-user-client');

		case Enum_Replies.RPL_LUSEROP:
			return req('/lib/message/reply/l-user-op');

		case Enum_Replies.RPL_LUSERUNKNOWN:
			return req('/lib/message/reply/l-user-unknown');

		case Enum_Replies.RPL_LUSERCHANNELS:
			return req('/lib/message/reply/l-user-channels');

		case Enum_Replies.RPL_LUSERME:
			return req('/lib/message/reply/l-user-me');

		case Enum_Replies.RPL_LOCALUSERS:
			return req('/lib/message/reply/local-users');

		case Enum_Replies.RPL_GLOBALUSERS:
			return req('/lib/message/reply/global-users');

		case Enum_Replies.RPL_AWAY:
			return req('/lib/message/reply/away');

		case Enum_Replies.RPL_USERHOST:
			return req('/lib/message/reply/user-host');

		case Enum_Replies.RPL_UNAWAY:
			return req('/lib/message/reply/unaway');

		case Enum_Replies.RPL_NOWAWAY:
			return req('/lib/message/reply/now-away');

		case Enum_Replies.RPL_WHOISUSER:
			return req('/lib/message/reply/whois-user');

		case Enum_Replies.RPL_WHOISSERVER:
			return req('/lib/message/reply/whois-server');

		case Enum_Replies.RPL_WHOISIDLE:
			return req('/lib/message/reply/whois-idle');

		case Enum_Replies.RPL_ENDOFWHOIS:
			return req('/lib/message/reply/end-of-whois');

		case Enum_Replies.RPL_WHOISCHANNELS:
			return req('/lib/message/reply/whois-channels');

		case Enum_Replies.RPL_CHANNEL_URL:
			return req('/lib/message/reply/channel-url');

		case Enum_Replies.RPL_WHOISACCOUNT:
			return req('/lib/message/reply/whois-account');

		case Enum_Replies.RPL_NOTOPIC:
			return req('/lib/message/reply/no-channel-topic');

		case Enum_Replies.RPL_TOPIC:
			return req('/lib/message/reply/channel-topic');

		case Enum_Replies.RPL_TOPICWHOTIME:
			return req('/lib/message/reply/channel-topic-details');

		case Enum_Replies.RPL_NAMREPLY:
			return req('/lib/message/reply/names-reply');

		case Enum_Replies.RPL_ENDOFNAMES:
			return req('/lib/message/reply/end-of-names');

		case Enum_Replies.RPL_MOTD:
			return req('/lib/message/reply/motd');

		case Enum_Replies.RPL_MOTDSTART:
			return req('/lib/message/reply/motd-start');

		case Enum_Replies.RPL_ENDOFMOTD:
			return req('/lib/message/reply/end-of-motd');

		case Enum_Replies.RPL_YOUREOPER:
			return req('/lib/message/reply/you-are-operator');

		case Enum_Replies.RPL_WHOISHOST:
			return req('/lib/message/reply/whois-host');

		case Enum_Replies.RPL_WHOISMODES:
			return req('/lib/message/reply/whois-modes');

		case Enum_Replies.ERR_NOSUCHNICK:
			return req('/lib/message/reply/no-such-nick');

		case Enum_Replies.ERR_NOSUCHSERVER:
			return req('/lib/message/reply/no-such-server');

		case Enum_Replies.ERR_NOSUCHCHANNEL:
			return req('/lib/message/reply/no-such-channel');

		case Enum_Replies.ERR_UNKNOWNCOMMAND:
			return req('/lib/message/reply/unknown-command');

		case Enum_Replies.ERR_NOMOTD:
			return req('/lib/message/reply/no-motd');

		case Enum_Replies.ERR_NONICKNAMEGIVEN:
			return req('/lib/message/reply/no-nickname-given');

		case Enum_Replies.ERR_ERRONEUSNICKNAME:
			return req('/lib/message/reply/erroneous-nickname');

		case Enum_Replies.ERR_NICKNAMEINUSE:
			return req('/lib/message/reply/nickname-in-use');

		case Enum_Replies.ERR_NOTONCHANNEL:
			return req('/lib/message/reply/not-on-channel');

		case Enum_Replies.ERR_NOTIMPLEMENTED:
			return req('/lib/message/reply/not-implemented');

		case Enum_Replies.ERR_NOTREGISTERED:
			return req('/lib/message/reply/not-registered');

		case Enum_Replies.ERR_NEEDMOREPARAMS:
			return req('/lib/message/reply/need-more-parameters');

		case Enum_Replies.ERR_ALREADYREGISTRED:
			return req('/lib/message/reply/already-registered');

		case Enum_Replies.ERR_PASSWDMISMATCH:
			return req('/lib/message/reply/password-mismatch');

		case Enum_Replies.ERR_LINKCHANNEL:
			return req('/lib/message/reply/link-channel');

		case Enum_Replies.ERR_CHANNELISFULL:
			return req('/lib/message/reply/channel-is-full');

		case Enum_Replies.ERR_UNKNOWNMODE:
			return req('/lib/message/reply/unknown-mode');

		case Enum_Replies.ERR_INVITEONLYCHAN:
			return req('/lib/message/reply/invite-only-channel');

		case Enum_Replies.ERR_NEEDREGGEDNICK:
			return req('/lib/message/reply/need-regged-nick');

		case Enum_Replies.ERR_NOCHANMODES:
			return req('/lib/message/reply/no-channel-modes');

		case Enum_Replies.ERR_NOPRIVILEGES:
			return req('/lib/message/reply/no-privileges');

		case Enum_Replies.ERR_CHANOPRIVSNEEDED:
			return req('/lib/message/reply/channel-operator-privileges-needed');

		case Enum_Replies.ERR_RESTRICTED:
			return req('/lib/message/reply/restricted');

		case Enum_Replies.ERR_UMODEUNKNOWNFLAG:
			return req('/lib/message/reply/user-mode-unknown-flag');

		case Enum_Replies.ERR_USERSDONTMATCH:
			return req('/lib/message/reply/users-dont-match');

		case Enum_Replies.RPL_WHOISSECURE:
			return req('/lib/message/reply/whois-secure');

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
