
var
	Target                 = req('/lib/target'),
	TargetTypes            = req('/constants/target-types'),
	NotYetImplementedError = req('/lib/errors/not-yet-implemented'),
	extend                 = req('/utilities/extend');

class ServerTarget extends Target {

	constructor() {
		throw new NotYetImplementedError(`
			Actually instantiating server targets
		`);
	}

}

extend(ServerTarget.prototype, {
	type: TargetTypes.SERVER
});

module.exports = ServerTarget;
