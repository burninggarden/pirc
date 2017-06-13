
var
	extend           = req('/lib/utilities/extend'),
	ReplyMessage     = req('/lib/messages/reply'),
	ReplyNumerics    = req('/lib/constants/reply-numerics'),
	InvalidNickError = req('/lib/errors/invalid-nick'),
	ErrorReasons     = req('/lib/constants/error-reasons'),
	isChannelName    = req('/lib/utilities/is-channel-name'),
	isNick           = req('/lib/utilities/is-nick');


class NoSuchNickMessage extends ReplyMessage {

	setNick(nick) {
		this.nick = nick;
	}

	getNick(nick) {
		return this.nick;
	}

	hasNick() {
		return this.getNick() !== null;
	}

	setChannelName(channel_name) {
		this.channel_name = channel_name;
	}

	getChannelName(channel_name) {
		return this.channel_name;
	}

	hasChannelName() {
		return this.getChannelName() !== null;
	}

	serializeParameters() {
		var
			targets = this.serializeTargets(),
			body    = this.getBody();

		// NOTICE: We're never going to pull the channel name to include here,
		// because this type of message should never be generated by pirc
		// when a channel target needs to be specified. This message should
		// really only be for missing nicks, not missing channels.
		var nick = this.getNick();

		return `${targets} ${nick} :${body}`;
	}

	applyParsedParameters(middle_parameters, trailing_parameter) {
		var token = middle_parameters.pop();

		// You may be wondering why we're checking for channel tokens inside
		// of a reply numeric that seems like it should be specific to nicks.
		// Well... some IRCD's (looking at you, InspIRCd) return information
		// about missing channel names using this numeric, as well.
		if (isChannelName(token)) {
			this.setChannelName(token);
		} else if (isNick(token)) {
			this.setNick(token);
		} else {
			throw new Error('Invalid target token: ' + token);
		}

		this.setTargetStrings(middle_parameters);
		this.setBody(trailing_parameter);
	}

	toError() {
		return new InvalidNickError(this.getNick(), ErrorReasons.NOT_FOUND);
	}

}

extend(NoSuchNickMessage.prototype, {
	reply_numeric: ReplyNumerics.ERR_NOSUCHNICK,
	body:          'No such nick/channel',
	nick:          null,
	channel_name:  null
});

module.exports = NoSuchNickMessage;