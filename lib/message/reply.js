
var
	Message         = require('../message'),
	Validator_Reply = require('../validator/reply');

var
	extend = require('../utility/extend');


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
