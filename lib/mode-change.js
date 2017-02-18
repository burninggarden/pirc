
var
	has    = req('/utilities/has'),
	extend = req('/utilities/extend');

var
	InvalidModeChangeError = req('/lib/errors/invalid-mode-change'),
	ModeActions            = req('/constants/mode-actions');


class ModeAction {

	setType(type) {
		if (!has(ModeActions, type)) {
			throw new InvalidModeChangeError(type);
		}

		this.type = type;
	}

	setTarget(target) {
		this.target = target;
	}

}

extend(ModeAction.prototype, {

	type:   null,
	target: null

});

module.exports = ModeAction;
