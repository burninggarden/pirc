
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Enum_Replies = req('/lib/enum/replies');

class CreatedMessage extends ReplyMessage {

	setTimestamp(timestamp) {
		this.timestamp = timestamp;
		return this;
	}

	getTimestamp() {
		return this.timestamp;
	}

	getDate() {
		var
			timestamp = this.getTimestamp(),
			date      = new Date(timestamp * 1000);

		return date.toLocaleTimeString('en-us', {
			weekday: 'long',
			year:    'numeric',
			month:   'short',
			day:     'numeric',
			hour:    '2-digit',
			minute:  '2-digit'
		});
	}

	setDate(date_string) {
		var timestamp = Math.floor(Date.parse(date_string) / 1000);

		this.setTimestamp(timestamp);
		return this;
	}

	getValuesForParameters() {
		return {
			date: this.getDate()
		};
	}

	setValuesFromParameters(parameters) {
		this.setDate(parameters.get('date'));
	}

}

extend(CreatedMessage.prototype, {

	reply:     Enum_Replies.RPL_CREATED,
	abnf:      '"This server was created " <date>',
	timestamp: null

});

module.exports = CreatedMessage;
