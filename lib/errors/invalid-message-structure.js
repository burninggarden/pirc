
var
	extend     = req('/utilities/extend'),
	BaseError  = req('/lib/errors/base'),
	ErrorCodes = req('/lib/constants/error-codes');

class InvalidMessageStructureError extends BaseError {

	getBody() {
		return 'Invalid message structure: ' + this.value;
	}

}

extend(InvalidMessageStructureError.prototype, {
	code:   ErrorCodes.INVALID_MESSAGE_STRUCTURE,
	reason: false
});

module.exports = InvalidMessageStructureError;
