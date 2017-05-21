
var
	Commands      = req('/lib/constants/commands'),
	ReplyNumerics = req('/lib/constants/reply-numerics'),
	MessageParser = req('/lib/message-parser'),
	createReply   = req('/lib/utilities/create-reply');

var
	ServerJoinMessage     = req('/lib/server/messages/join'),
	ServerModeMessage     = req('/lib/server/messages/mode'),
	ServerNickMessage     = req('/lib/server/messages/nick'),
	ServerNoticeMessage   = req('/lib/server/messages/notice'),
	ServerPingMessage     = req('/lib/server/messages/ping'),
	ServerPartMessage     = req('/lib/server/messages/part'),
	ServerPrivateMessage  = req('/lib/server/messages/private'),
	ServerISupportMessage = req('/lib/server/messages/i-support'),
	ServerTopicMessage    = req('/lib/server/messages/topic'),
	ServerQuitMessage     = req('/lib/server/messages/quit');


class ClientMessageParser extends MessageParser {

	getConstructorForCommand(command) {
		switch (command) {
			case Commands.JOIN:
				return ServerJoinMessage;

			case Commands.MODE:
				return ServerModeMessage;

			case Commands.NICK:
				return ServerNickMessage;

			case Commands.NOTICE:
				return ServerNoticeMessage;

			case Commands.PART:
				return ServerPartMessage;

			case Commands.PING:
				return ServerPingMessage;

			case Commands.PRIVMSG:
				return ServerPrivateMessage;

			case Commands.QUIT:
				return ServerQuitMessage;

			case Commands.TOPIC:
				return ServerTopicMessage;

			default:
				return null;
		}
	}

	getConstructorForReplyNumeric(reply_numeric, raw_message) {
		// Special logic is needed in several cases, because of the unfortunate
		// overlapping of multiple message types for the same reply numeric:
		if (reply_numeric === ReplyNumerics.RPL_BOUNCE) {
			if (raw_message.indexOf(':Try') === -1) {
				return ServerISupportMessage;
			}
		}

		return createReply(reply_numeric);
	}

}

module.exports = new ClientMessageParser();
