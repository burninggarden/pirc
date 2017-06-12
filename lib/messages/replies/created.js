
var
	extend        = req('/lib/utilities/extend'),
	ReplyMessage  = req('/lib/messages/reply'),
	ReplyNumerics = req('/lib/constants/reply-numerics');

class CreatedMessage extends ReplyMessage {

	getBody() {
		var
			server_details    = this.getLocalDetails(),
			created_timestamp = server_details.getCreatedTimestamp(),
			date              = new Date(created_timestamp * 1000);

		var formatted_date = date.toLocaleTimeString('en-us', {
			weekday: 'long',
			year:    'numeric',
			month:   'short',
			day:     'numeric',
			hour:    '2-digit',
			minute:  '2-digit'
		});

		return `This server was created ${formatted_date}`;
	}

	serializeParameters() {
		return ' ' + this.serializeTargets() + ' :' + this.getBody();
	}

	applyParsedParameters(middle_parameters, trailing_parameter) {
		this.setTargetStrings(middle_parameters);
		this.setBody(trailing_parameter);
	}

}

extend(CreatedMessage.prototype, {

	reply_numeric: ReplyNumerics.RPL_CREATED

});

module.exports = CreatedMessage;
