var req = require('req');

var
	PortValidator       = req('/validators/port'),
	ServerNameValidator = req('/validators/server-name');

var
	AlreadyListeningError = req('/lib/errors/already-listening');

module.exports = {

	validateName(name) {
		ServerNameValidator.validate(name);
	},

	validatePort(port) {
		if (this.isListening()) {
			throw new AlreadyListeningError();
		}

		PortValidator.validate(port);

		this.port = port;
	}

};
