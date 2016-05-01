
var
	extend       = require('../../utilities/extend'),
	has          = require('../../utilities/has'),
	ErrorCodes   = require('../../constants/error-codes'),
	ErrorReasons = require('../../constants/error-reasons');

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

		if (!this.message) {
			this.setMessage();
		}
	}

	validateCode() {
		if (!has(ErrorCodes, this.code)) {
			// Note: we're not throwing an instance of BaseError here,
			// for once. Mostly because it would be a little crazy to
			// have something like InvalidErrorError...
			throw new Error('Must specify a valid error code');
		}
	}

	validateReason() {
		if (!has(ErrorReasons, this.reason)) {
			throw new Error('Must specify a valid error reason');
		}
	}

	setMessage() {
		throw new Error('Must override BaseError.setMessage()');
	}

}

extend(BaseError.prototype, {
	// This should be overridden in child classes
	// with a value from the ErrorCodes enum
	code: null,

	value: null,

	reason: null,

	message: null
});

module.exports = BaseError;
