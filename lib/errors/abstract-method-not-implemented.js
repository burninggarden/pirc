
var
	extend       = req('/utilities/extend'),
	BaseError    = req('/lib/errors/base'),
	ErrorCodes   = req('/lib/constants/error-codes'),
	ErrorReasons = req('/lib/constants/error-reasons');

class AbstractMethodNotImplementedError extends BaseError {

	getBody() {
		return 'Abstract method not implemented: ' + this.value;
	}

}

extend(AbstractMethodNotImplementedError.prototype, {
	code:   ErrorCodes.ABSTRACT_METHOD_NOT_IMPLEMENTED,
	reason: ErrorReasons.NOT_YET_IMPLEMENTED
});

module.exports = AbstractMethodNotImplementedError;
