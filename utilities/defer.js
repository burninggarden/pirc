var
	toArray    = require('./to-array'),
	isFunction = require('./is-function');

var
	InvalidCallbackError = require('../lib/errors/invalid-callback');


function defer() {
	var
		args     = toArray(arguments),
		callback = args.shift();

	if (!isFunction(callback)) {
		throw new InvalidCallbackError(callback);
	}

	setTimeout(function deferred() {
		callback.apply(this, args);
	}, 0);
}

module.exports = defer;
