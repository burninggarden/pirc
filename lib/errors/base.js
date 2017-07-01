
var
	extend        = req('/lib/utilities/extend'),
	has           = req('/lib/utilities/has'),
	ErrorCodes    = req('/lib/constants/error-codes'),
	ErrorReasons  = req('/lib/constants/error-reasons'),
	createMessage = req('/lib/utilities/create-message');


class BaseError extends Error {

	constructor(value, reason) {
		super();

		if (value !== undefined) {
			this.value = value;
		}

		if (reason !== undefined) {
			this.reason = reason;
		}

		this.validateCode();
		this.validateReason();
	}

	validateCode() {
		if (!has(ErrorCodes, this.getCode())) {
			// Note: we're not throwing an instance of BaseError here,
			// for once. Mostly because it would be a little crazy to
			// have something like InvalidErrorError. Also, circular
			// dependencies.
			throw new Error('Must specify a valid error code');
		}
	}

	getCode() {
		return this.code;
	}

	validateReason() {
		var reason = this.getReason();

		if (reason === false) {
			reason = ErrorReasons.GENERIC;
			return;
		}

		if (!has(ErrorReasons, reason)) {
			throw new Error(
				`Must specify a valid error reason (got ${reason})`
			);
		}
	}

	getReason() {
		return this.reason;
	}

	get message() {
		return this.getBody();
	}

	getBody() {
		// NOTICE: We can't throw an instance of AbstractMethodNotImplemented
		// here; because circular dependencies. Blah.

		var code = this.getCode();

		throw new Error(
			`Must override BaseError.getBody() in subclass ${code}`
		);
	}

	setCommand(command) {
		this.command = command;
		return this;
	}

	getCommand() {
		return this.command;
	}

	getValue() {
		return this.value;
	}

	toReply() {
		// NOTICE: We can't throw an instance of AbstractMethodNotImplemented
		// here; because circular dependencies. Blah.

		var code = this.getCode();

		throw new Error(
			`Must override BaseError.toReply() in subclass ${code}`
		);
	}

	createReply(reply_numeric) {
		return createMessage(reply_numeric);
	}

}

extend(BaseError.prototype, {
	// This should be overridden in child classes
	// with a value from the ErrorCodes enum
	code:    null,

	value:   null,
	reason:  null,
	command: null
});

module.exports = BaseError;
