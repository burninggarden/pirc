
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Enum_Replies = req('/lib/enum/replies');

class ISupportMessage extends ReplyMessage {

	setTags(tags) {
		this.tags = tags;
		return this;
	}

	setWords(words) {
		return this.setTags(words);
	}

	getTags() {
		return this.tags;
	}

	getValuesForParameters() {
		return {
			tag: this.getTags()
		};
	}

	setValuesFromParameters(parameters) {
		this.setTags(parameters.get('tag'));
	}

}

extend(ISupportMessage.prototype, {

	reply: Enum_Replies.RPL_ISUPPORT,
	abnf:  '1*(<tag> " ") ":are supported by this server"',
	tags:  null

});

module.exports = ISupportMessage;
