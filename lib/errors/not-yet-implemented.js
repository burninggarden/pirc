var
	extend       = require('../../utilities/extend'),
	BaseError    = require('./base'),
	ErrorCodes   = require('../../constants/error-codes'),
	ErrorReasons = require('../../constants/error-reasons');

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
