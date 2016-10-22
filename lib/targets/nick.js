
var
	Target        = req('/lib/target'),
	extend        = req('/utilities/extend'),
	TargetTypes   = req('/constants/target-types'),
	NickValidator = req('/validators/nick');

class NickTarget extends Target {

	constructor(nick) {
		super(nick);

		NickValidator.validate(nick);
	}

}

extend(NickTarget.prototype, {
	type: TargetTypes.NICK
});

module.exports = NickTarget;
