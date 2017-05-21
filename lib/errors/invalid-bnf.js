
var
	extend       = req('/lib/utilities/extend'),
	BaseError    = req('/lib/errors/base'),
	ErrorCodes   = req('/lib/constants/error-codes'),
	ErrorReasons = req('/lib/constants/error-reasons');


class InvalidBnfError extends BaseError {

	getBody() {
		switch (this.reason) {
			case ErrorReasons.OMITTED:
				return 'You must specify a BNF';
			default:
				return 'Invalid BNF';
		}
	}

}

extend(InvalidBnfError.prototype, {
	code: ErrorCodes.INVALID_BNF
});

module.exports = InvalidBnfError;
