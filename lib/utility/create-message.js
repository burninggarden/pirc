

var
	Enum_Commands      = require('../enum/commands'),
	Enum_Replies       = require('../enum/replies'),
	Enum_ReplyNumerics = require('../enum/reply-numerics');

var
	has = require('./has');


function getConstructorForCommand(command) {
	switch (command) {
		case Enum_Commands.AWAY:
			return require('../message/command/away');

		case Enum_Commands.CAP:
			return require('../message/command/cap');

		case Enum_Commands.ERROR:
			return require('../message/command/error');

		case Enum_Commands.JOIN:
			return require('../message/command/join');

		case Enum_Commands.MODE:
			return require('../message/command/mode');

		case Enum_Commands.NICK:
			return require('../message/command/nick');

		case Enum_Commands.NOTICE:
			return require('../message/command/notice');

		case Enum_Commands.OPER:
			return require('../message/command/oper');

		case Enum_Commands.PART:
			return require('../message/command/part');

		case Enum_Commands.PASS:
			return require('../message/command/pass');

		case Enum_Commands.PING:
			return require('../message/command/ping');

		case Enum_Commands.PONG:
			return require('../message/command/pong');

		case Enum_Commands.PRIVMSG:
			return require('../message/command/private');

		case Enum_Commands.QUIT:
			return require('../message/command/quit');

		case Enum_Commands.RESTART:
			return require('../message/command/restart');

		case Enum_Commands.TOPIC:
			return require('../message/command/topic');

		case Enum_Commands.USER:
			return require('../message/command/user');

		case Enum_Commands.WHO:
			return require('../message/command/who');

		case Enum_Commands.WHOIS:
			return require('../message/command/whois');

		case Enum_Commands.WHOWAS:
			return require('../message/command/whowas');

		default:
			throw new Error('Invalid command: ' + command);
	}
}

function getConstructorForReply(reply) {
	switch (reply) {
		case Enum_Replies.RPL_WELCOME:
			return require('../message/reply/welcome');

		case Enum_Replies.RPL_YOURHOST:
			return require('../message/reply/your-host');

		case Enum_Replies.RPL_CREATED:
			return require('../message/reply/created');

		case Enum_Replies.RPL_MYINFO:
			return require('../message/reply/my-info');

		case Enum_Replies.RPL_BOUNCE:
			return require('../message/reply/bounce');

		case Enum_Replies.RPL_ISUPPORT:
			return require('../message/reply/i-support');

		case Enum_Replies.RPL_UMODEIS:
			return require('../message/reply/user-mode-is');

		case Enum_Replies.RPL_STATSDLINE:
			return require('../message/reply/stats-dline');

		case Enum_Replies.RPL_LUSERCLIENT:
			return require('../message/reply/l-user-client');

		case Enum_Replies.RPL_LUSEROP:
			return require('../message/reply/l-user-op');

		case Enum_Replies.RPL_LUSERUNKNOWN:
			return require('../message/reply/l-user-unknown');

		case Enum_Replies.RPL_LUSERCHANNELS:
			return require('../message/reply/l-user-channels');

		case Enum_Replies.RPL_LUSERME:
			return require('../message/reply/l-user-me');

		case Enum_Replies.RPL_LOCALUSERS:
			return require('../message/reply/local-users');

		case Enum_Replies.RPL_GLOBALUSERS:
			return require('../message/reply/global-users');

		case Enum_Replies.RPL_AWAY:
			return require('../message/reply/away');

		case Enum_Replies.RPL_USERHOST:
			return require('../message/reply/user-host');

		case Enum_Replies.RPL_UNAWAY:
			return require('../message/reply/unaway');

		case Enum_Replies.RPL_NOWAWAY:
			return require('../message/reply/now-away');

		case Enum_Replies.RPL_WHOISUSER:
			return require('../message/reply/whois-user');

		case Enum_Replies.RPL_WHOISSERVER:
			return require('../message/reply/whois-server');

		case Enum_Replies.RPL_WHOISIDLE:
			return require('../message/reply/whois-idle');

		case Enum_Replies.RPL_ENDOFWHOIS:
			return require('../message/reply/end-of-whois');

		case Enum_Replies.RPL_WHOISCHANNELS:
			return require('../message/reply/whois-channels');

		case Enum_Replies.RPL_CHANNEL_URL:
			return require('../message/reply/channel-url');

		case Enum_Replies.RPL_WHOISACCOUNT:
			return require('../message/reply/whois-account');

		case Enum_Replies.RPL_NOTOPIC:
			return require('../message/reply/no-channel-topic');

		case Enum_Replies.RPL_TOPIC:
			return require('../message/reply/channel-topic');

		case Enum_Replies.RPL_TOPICWHOTIME:
			return require('../message/reply/channel-topic-details');

		case Enum_Replies.RPL_NAMREPLY:
			return require('../message/reply/names-reply');

		case Enum_Replies.RPL_ENDOFNAMES:
			return require('../message/reply/end-of-names');

		case Enum_Replies.RPL_MOTD:
			return require('../message/reply/motd');

		case Enum_Replies.RPL_MOTDSTART:
			return require('../message/reply/motd-start');

		case Enum_Replies.RPL_ENDOFMOTD:
			return require('../message/reply/end-of-motd');

		case Enum_Replies.RPL_YOUREOPER:
			return require('../message/reply/you-are-operator');

		case Enum_Replies.RPL_WHOISHOST:
			return require('../message/reply/whois-host');

		case Enum_Replies.RPL_WHOISMODES:
			return require('../message/reply/whois-modes');

		case Enum_Replies.ERR_NOSUCHNICK:
			return require('../message/reply/no-such-nick');

		case Enum_Replies.ERR_NOSUCHSERVER:
			return require('../message/reply/no-such-server');

		case Enum_Replies.ERR_NOSUCHCHANNEL:
			return require('../message/reply/no-such-channel');

		case Enum_Replies.ERR_UNKNOWNCOMMAND:
			return require('../message/reply/unknown-command');

		case Enum_Replies.ERR_NOMOTD:
			return require('../message/reply/no-motd');

		case Enum_Replies.ERR_NONICKNAMEGIVEN:
			return require('../message/reply/no-nickname-given');

		case Enum_Replies.ERR_ERRONEUSNICKNAME:
			return require('../message/reply/erroneous-nickname');

		case Enum_Replies.ERR_NICKNAMEINUSE:
			return require('../message/reply/nickname-in-use');

		case Enum_Replies.ERR_NOTONCHANNEL:
			return require('../message/reply/not-on-channel');

		case Enum_Replies.ERR_NOTIMPLEMENTED:
			return require('../message/reply/not-implemented');

		case Enum_Replies.ERR_NOTREGISTERED:
			return require('../message/reply/not-registered');

		case Enum_Replies.ERR_NEEDMOREPARAMS:
			return require('../message/reply/need-more-parameters');

		case Enum_Replies.ERR_ALREADYREGISTRED:
			return require('../message/reply/already-registered');

		case Enum_Replies.ERR_PASSWDMISMATCH:
			return require('../message/reply/password-mismatch');

		case Enum_Replies.ERR_LINKCHANNEL:
			return require('../message/reply/link-channel');

		case Enum_Replies.ERR_CHANNELISFULL:
			return require('../message/reply/channel-is-full');

		case Enum_Replies.ERR_UNKNOWNMODE:
			return require('../message/reply/unknown-mode');

		case Enum_Replies.ERR_INVITEONLYCHAN:
			return require('../message/reply/invite-only-channel');

		case Enum_Replies.ERR_NEEDREGGEDNICK:
			return require('../message/reply/need-regged-nick');

		case Enum_Replies.ERR_NOCHANMODES:
			return require('../message/reply/no-channel-modes');

		case Enum_Replies.ERR_NOPRIVILEGES:
			return require('../message/reply/no-privileges');

		case Enum_Replies.ERR_CHANOPRIVSNEEDED:
			return require('../message/reply/channel-operator-privileges-needed');

		case Enum_Replies.ERR_RESTRICTED:
			return require('../message/reply/restricted');

		case Enum_Replies.ERR_UMODEUNKNOWNFLAG:
			return require('../message/reply/user-mode-unknown-flag');

		case Enum_Replies.ERR_USERSDONTMATCH:
			return require('../message/reply/users-dont-match');

		case Enum_Replies.RPL_WHOISSECURE:
			return require('../message/reply/whois-secure');

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
