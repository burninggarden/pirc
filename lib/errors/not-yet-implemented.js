var
	extend       = req('/lib/utilities/extend'),
	BaseError    = req('/lib/errors/base'),
	ErrorCodes   = req('/lib/constants/error-codes'),
	ErrorReasons = req('/lib/constants/error-reasons');

class NotYetImplementedError extends BaseError {

	getBody() {
		return 'Not yet implemented: ' + this.value;
	}

}

extend(NotYetImplementedError.prototype, {
	code:   ErrorCodes.NOT_YET_IMPLEMENTED,
	reason: ErrorReasons.NOT_YET_IMPLEMENTED
});

module.exports = NotYetImplementedError;
