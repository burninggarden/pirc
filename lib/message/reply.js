
var
	Message         = req('/lib/message'),
	Validator_Reply = req('/lib/validator/reply');

var
	extend = req('/lib/utility/extend');


class Message_Reply extends Message {

	validateReply(reply) {
		Validator_Reply.validate(reply);
	}

	setTarget(target) {
		if (this.hasTarget()) {
			throw new Error('duplicate target');
		}

		return super.setTarget(target);
	}

}

extend(Message_Reply.prototype, {
	reply: null
});


module.exports = Message_Reply;
