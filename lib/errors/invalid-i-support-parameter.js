var
	extend       = req('/lib/utilities/extend'),
	BaseError    = req('/lib/errors/base'),
	ErrorCodes   = req('/lib/constants/error-codes'),
	ErrorReasons = req('/lib/constants/error-reasons');


class InvalidISupportParameterError extends BaseError {

	getBody() {
		switch (this.reason) {
			case ErrorReasons.WRONG_TYPE:
				return 'Invalid ISUPPORT parameter: ' + this.value;
			case ErrorReasons.OMITTED:
			default:
				return 'Must specify a valid ISUPPORT parameter';
		}
	}

}

extend(InvalidISupportParameterError.prototype, {
	code: ErrorCodes.INVALID_I_SUPPORT_PARAMETER
});

module.exports = InvalidISupportParameterError;
