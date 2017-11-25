
var
	extend        = req('/lib/utility/extend'),
	Message_Reply = req('/lib/message/reply'),
	Enum_Replies  = req('/lib/enum/replies');

class Message_Reply_ISupport extends Message_Reply {

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

extend(Message_Reply_ISupport.prototype, {

	reply: Enum_Replies.RPL_ISUPPORT,
	abnf:  '1*(<tag> " ") ":are supported by this server"',
	tags:  null

});

module.exports = Message_Reply_ISupport;
