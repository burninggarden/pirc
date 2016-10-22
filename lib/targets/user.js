
var
	Target                 = req('/lib/target'),
	TargetTypes            = req('/constants/target-types'),
	NotYetImplementedError = req('/lib/errors/not-yet-implemented'),
	extend                 = req('/utilities/extend');

class UserTarget extends Target {

	constructor() {
		throw new NotYetImplementedError(`
			Actually instantiating user targets
		`);
	}

}

extend(UserTarget.prototype, {
	type: TargetTypes.USER
});

module.exports = UserTarget;
