
var
	extend        = req('/lib/utility/extend'),
	Message_Reply = req('/lib/message/reply'),
	Enum_Replies  = req('/lib/enum/replies');

class Message_Reply_Created extends Message_Reply {

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

extend(Message_Reply_Created.prototype, {

	reply:     Enum_Replies.RPL_CREATED,
	abnf:      '"This server was created " <date>',
	timestamp: null

});

module.exports = Message_Reply_Created;
