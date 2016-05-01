var req = require('req');

var
	PortValidator = req('/validators/port');

var
	AlreadyListeningError = req('/lib/errors/already-listening');

module.exports = {

	validatePort(port) {
		if (this.isListening()) {
			throw new AlreadyListeningError();
		}

		PortValidator.validate(port);

		this.port = port;
	}

};
