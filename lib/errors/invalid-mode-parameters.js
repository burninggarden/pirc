var
	extend       = req('/lib/utilities/extend'),
	BaseError    = req('/lib/errors/base'),
	ErrorCodes   = req('/lib/constants/error-codes'),
	ErrorReasons = req('/lib/constants/error-reasons');


class InvalidModeParametersError extends BaseError {

	constructor(mode, parameters, reason) {
		super(parameters, reason);

		this.setMode(mode);
	}

	getBody() {
		var
			mode       = this.getMode(),
			parameters = JSON.stringify(this.getValue());

		switch (this.getReason()) {
			case ErrorReasons.TOO_MANY_PARAMETERS:
				return `Too many parameters for mode ${mode}: ${parameters}`;

			case ErrorReasons.NOT_ENOUGH_PARAMETERS:
				return `Not enough parameters for mode ${mode}: ${parameters}`;

			default:
				return `Invalid parameters for mode ${mode}: ${parameters}`;
		}

	}

	setMode(mode) {
		this.mode = mode;
		return this;
	}

	getMode() {
		return this.mode;
	}

}

extend(InvalidModeParametersError.prototype, {
	code: ErrorCodes.INVALID_MODE_PARAMETERS,
	mode: null
});

module.exports = InvalidModeParametersError;
