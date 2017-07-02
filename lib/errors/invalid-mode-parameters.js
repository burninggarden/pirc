var
	extend       = req('/lib/utilities/extend'),
	BaseError    = req('/lib/errors/base'),
	ErrorCodes   = req('/lib/constants/error-codes'),
	ErrorReasons = req('/lib/constants/error-reasons'),
	Replies      = req('/lib/constants/replies'),
	Commands     = req('/lib/constants/commands');


class InvalidModeParametersError extends BaseError {

	constructor(mode, target_type, parameters, reason) {
		super(parameters, reason);

		this.setMode(mode);
		this.setTargetType(target_type);
	}

	getBody() {
		var
			mode       = this.getMode(),
			type       = this.getTargetType(),
			parameters = JSON.stringify(this.getValue());

		switch (this.getReason()) {
			case ErrorReasons.TOO_MANY_PARAMETERS:
				return `Too many parameters for ${type} mode ${mode}: ${parameters}`;

			case ErrorReasons.NOT_ENOUGH_PARAMETERS:
				return `Not enough parameters for ${type} mode ${mode}: ${parameters}`;

			default:
				return `Invalid parameters for ${type} mode ${mode}: ${parameters}`;
		}

	}

	setMode(mode) {
		this.mode = mode;
		return this;
	}

	getMode() {
		return this.mode;
	}

	getTargetType() {
		return this.target_type;
	}

	setTargetType(target_type) {
		this.target_type = target_type;
		return this;
	}

	toReply() {
		switch (this.getReason()) {
			case ErrorReasons.NOT_ENOUGH_PARAMETERS:
				return this.createReply(Replies.ERR_NEEDMOREPARAMS)
					.setAttemptedCommand(Commands.MODE);

			default:
				throw new Error('implement for ' + this.getReason());
		}
	}

}

extend(InvalidModeParametersError.prototype, {
	code:        ErrorCodes.INVALID_MODE_PARAMETERS,
	mode:        null,
	target_type: null
});

module.exports = InvalidModeParametersError;
