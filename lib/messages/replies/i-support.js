
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Replies      = req('/lib/constants/replies');

class ISupportMessage extends ReplyMessage {

	setTags(tags) {
		this.tags = tags;
		return this;
	}

	setWords(words) {
		return this.setTags(words);
	}

	getSettings() {
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

	reply: Replies.RPL_ISUPPORT,
	abnf:  '1*(<tag> " ") ":are supported by this server"',
	tags:  null

});

module.exports = ISupportMessage;
