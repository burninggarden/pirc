
var
	Message        = req('/lib/message'),
	ReplyValidator = req('/lib/validators/reply'),
	UserDetails    = req('/lib/user-details');

var
	extend = req('/lib/utilities/extend');


class ReplyMessage extends Message {

	validateReply(reply) {
		ReplyValidator.validate(reply);
	}

	addTarget(target) {
		if (this.hasUserTarget()) {
			throw new Error('duplicate user target');
		}

		if (!(target instanceof UserDetails)) {
			throw new Error('invalid target, expected user details');
		}

		return super.addTarget(target);
	}

}

extend(ReplyMessage.prototype, {
	reply: null
});


module.exports = ReplyMessage;
