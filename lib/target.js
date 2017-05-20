
var
	InvalidTargetError = req('/lib/errors/invalid-target'),
	TargetTypes        = req('/lib/constants/target-types'),
	ErrorReasons       = req('/lib/constants/error-reasons'),
	extend             = req('/lib/utilities/extend'),
	has                = req('/lib/utilities/has');

class Target {

	constructor(target_string) {
		if (!target_string) {
			throw new InvalidTargetError(target_string, ErrorReasons.OMITTED);
		}

		this.target_string = target_string;

		this.doSanityChecks();
	}

	doSanityChecks() {
		if (!this.type) {
			throw new InvalidTargetError(this.type, ErrorReasons.OMITTED);
		}

		if (!has(TargetTypes, this.type)) {
			throw new InvalidTargetError(this.type, ErrorReasons.UNKNOWN_TYPE);
		}
	}

	getTargetString() {
		return this.target_string;
	}

	getType() {
		return this.type;
	}

	matches(target) {
		if (this.getType() !== target.getType()) {
			return false;
		}

		if (this.getTargetString() !== target.getTargetString()) {
			return false;
		}

		return true;
	}

}

extend(Target.prototype, {
	target_string: null
});

module.exports = Target;

