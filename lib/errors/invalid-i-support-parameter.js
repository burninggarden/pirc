var
	extend       = req('/utilities/extend'),
	BaseError    = req('/lib/errors/base'),
	ErrorCodes   = req('/constants/error-codes'),
	ErrorReasons = req('/constants/error-reasons');


class InvalidISupportParameterError extends BaseError {

	setMessage() {
		switch (this.reason) {
			case ErrorReasons.WRONG_TYPE:
				this.message = `Invalid ISUPPORT parameter: ${this.value}`;
				break;

			case ErrorReasons.OMITTED:
			default:
				this.message = 'Must specify a valid ISUPPORT parameter';
				break;
		}
	}

}

extend(InvalidISupportParameterError.prototype, {
	code: ErrorCodes.INVALID_I_SUPPORT_PARAMETER
});

module.exports = InvalidISupportParameterError;
