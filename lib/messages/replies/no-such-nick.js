
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Enum_Replies = req('/lib/enum/replies');


class NoSuchNickMessage extends ReplyMessage {

	setNickname(nickname) {
		this.nickname = nickname;
		return this;
	}

	getNickname() {
		return this.nickname;
	}

	setChannelName(channel_name) {
		this.channel_name = channel_name;
		return this;
	}

	getChannelName() {
		return this.channel_name;
	}

	hasChannelName() {
		return this.getChannelName() !== null;
	}

	getValuesForParameters() {
		return {
			nickname: this.getNickname()
		};
	}

	setValuesFromParameters(parameters) {
		this.setNickname(parameters.get('nickname'));

		// You may be wondering why we're checking for channel tokens inside
		// of a reply numeric that seems like it should be specific to nicks.
		// Well... some IRCD's (looking at you, InspIRCd) return information
		// about missing channel names using this numeric, as well.
		this.setChannelName(parameters.get('channel_name'));
	}

}

extend(NoSuchNickMessage.prototype, {
	reply:        Enum_Replies.ERR_NOSUCHNICK,
	abnf:         '( <nickname> / <channel-name> )" :No such nick/channel"',
	nickname:     null,
	channel_name: null
});

module.exports = NoSuchNickMessage;
