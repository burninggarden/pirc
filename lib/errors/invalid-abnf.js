
var
	extend       = req('/lib/utilities/extend'),
	BaseError    = req('/lib/errors/base'),
	ErrorCodes   = req('/lib/constants/error-codes'),
	ErrorReasons = req('/lib/constants/error-reasons');


class InvalidABNFError extends BaseError {

	getBody() {
		switch (this.reason) {
			case ErrorReasons.OMITTED:
				return 'You must specify an ABNF declaration';
			default:
				return 'Invalid ABNF declaration';
		}
	}

}

extend(InvalidABNFError.prototype, {
	code: ErrorCodes.INVALID_ABNF
});

module.exports = InvalidABNFError;
