
var
	_add    = req('/lib/utility/add'),
	_remove = req('/lib/utility/remove'),
	extend  = req('/lib/utility/extend');


class CallbackList {

	add(callback) {
		_add(callback).to(this.getCallbacks());
	}

	remove(callback) {
		_remove(callback).from(this.getCallbacks());
	}

	dispatch(error, result) {
		var callbacks = this.getCallbacks();

		this.callbacks = [ ];

		callbacks.forEach(function each(callback) {
			callback(error, result);
		});
	}

	getCallbacks() {
		if (!this.callbacks) {
			this.callbacks = [ ];
		}

		return this.callbacks;
	}

}

extend(CallbackList.prototype, {
	callbacks: null
});

module.exports = CallbackList;
