
var
	extend       = req('/utilities/extend'),
	BaseError    = req('/lib/errors/base'),
	ErrorCodes   = req('/constants/error-codes'),
	ErrorReasons = req('/constants/error-reasons');

class NoServerMotdError extends BaseError {

	setMessage() {
		this.message = 'Server did not return a MOTD: ' + this.value;
	}

}

extend(NoServerMotdError.prototype, {
	code:   ErrorCodes.NO_SERVER_MOTD,
	reason: ErrorReasons.OMITTED
});

module.exports = NoServerMotdError;