var
	toArray    = req('/lib/utilities/to-array'),
	isFunction = req('/lib/utilities/is-function');

var
	ErrorReasons         = req('/lib/constants/error-reasons'),
	InvalidCallbackError = req('/lib/errors/invalid-callback');


function defer() {
	var
		args     = toArray(arguments),
		callback = args.shift();

	if (!isFunction(callback)) {
		let reason;

		if (!callback) {
			reason = ErrorReasons.OMITTED;
		} else {
			reason = ErrorReasons.WRONG_TYPE;
		}

		throw new InvalidCallbackError(callback, reason);
	}

	setTimeout(function deferred() {
		callback.apply(this, args);
	}, 0);
}

module.exports = defer;
