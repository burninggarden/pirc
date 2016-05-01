var	req = require('req');

var
	defer      = req('/utilities/defer'),
	isFunction = req('/utilities/is-function');

var
	InvalidCallbackError   = req('/lib/errors/invalid-callback'),
	NotConnectedError      = req('/lib/errors/not-connected'),
	NotYetImplementedError = req('/lib/errors/not-yet-implemented'),

	AlreadyConnectedError  = req('/lib/errors/already-connected');


module.exports = {

	setAddress(address) {
		if (this.isConnected()) {
			throw new AlreadyConnectedError();
		}

		this.validateAddress(address);

		this.address = address;
	},

	addMode(mode, callback) {
		if (callback !== null && !isFunction(callback)) {
			throw new InvalidCallbackError();
		}

		try {
			this.validateMode(mode);
		} catch (error) {
			if (callback !== null) {
				return void defer(callback, error);
			} else {
				throw error;
			}
		}

		this.modes.add(mode);

		if (this.isConnected()) {
			this.sendModeMessage(mode, callback);
		}
	},

	setNick(nick, callback) {
		if (callback !== null && !isFunction(callback)) {
			throw new InvalidCallbackError();
		}

		try {
			this.validateNick(nick);
		} catch (error) {
			if (callback !== null) {
				return void defer(callback, error);
			} else {
				throw error;
			}
		}

		if (!this.isConnected()) {
			if (callback !== null) {
				return void defer(callback, new NotConnectedError());
			}

			this.nick = nick;
			return;
		}

		throw new NotYetImplementedError();
	},

	setPort(port) {
		if (this.isConnected()) {
			throw new AlreadyConnectedError();
		}

		this.validatePort(port);

		this.port = port;
	},

	setSSL(ssl) {
		if (this.isConnected()) {
			throw new AlreadyConnectedError();
		}

		this.validateSSL(ssl);

		this.ssl = ssl;
	},

	setName(name) {
		this.validateName(name);

		this.name = name;
	},

	setUsername(username, callback) {
		if (callback !== null && !isFunction(callback)) {
			throw new InvalidCallbackError();
		}

		try {
			this.validateUsername(username);
		} catch (error) {
			if (callback !== null) {
				return void defer(callback, error);
			} else {
				throw error;
			}
		}
	},

	setRealname(realname, callback) {
		this.validateRealname(realname);
	}

};
