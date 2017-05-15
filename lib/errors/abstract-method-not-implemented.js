
var
	extend       = req('/utilities/extend'),
	BaseError    = req('/lib/errors/base'),
	ErrorCodes   = req('/constants/error-codes'),
	ErrorReasons = req('/constants/error-reasons');

class AbstractMethodNotImplementedError extends BaseError {

	getMessage() {
		return 'Abstract method not implemented: ' + this.value;
	}

}

extend(AbstractMethodNotImplementedError.prototype, {
	code:   ErrorCodes.ABSTRACT_METHOD_NOT_IMPLEMENTED,
	reason: ErrorReasons.NOT_YET_IMPLEMENTED
});

module.exports = AbstractMethodNotImplementedError;
