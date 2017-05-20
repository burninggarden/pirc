
var
	extend       = req('/lib/utilities/extend'),
	BaseError    = req('/lib/errors/base'),
	ErrorCodes   = req('/lib/constants/error-codes'),
	ErrorReasons = req('/lib/constants/error-reasons');

class NoServerMotdError extends BaseError {

	getBody() {
		return 'Server did not return a MOTD: ' + this.value;
	}

}

extend(NoServerMotdError.prototype, {
	code:   ErrorCodes.NO_SERVER_MOTD,
	reason: ErrorReasons.OMITTED
});

module.exports = NoServerMotdError;
