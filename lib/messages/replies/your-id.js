
var
	extend        = req('/lib/utilities/extend'),
	ReplyMessage  = req('/lib/messages/reply'),
	ReplyNumerics = req('/lib/constants/reply-numerics');

class YourIdMessage extends ReplyMessage {

	serializeParameters() {
		var
			targets = this.serializeTargets(),
			id      = this.getId(),
			body    = this.getBody();

		return `${targets} ${id} :${body}`;
	}

	setId(id) {
		this.getTargetUserDetails().setUniqueId(id);
	}

	getId() {
		return this.getTargetUserDetails().getUniqueId();
	}

	applyParsedParameters(middle_parameters, trailing_parameter) {
		this.addTargetFromString(middle_parameters.shift());
		this.setId(middle_parameters.shift());
		this.setBody(trailing_parameter);
	}

}

extend(YourIdMessage.prototype, {

	reply_numeric: ReplyNumerics.RPL_YOURID,
	body:          'your unique ID'

});

module.exports = YourIdMessage;
