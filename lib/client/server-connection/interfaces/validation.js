var req = require('req');

var
	isBoolean = req('/utilities/is-boolean');

var
	InvalidServerSSLError = req('/lib/errors/invalid-server-ssl'),

	ErrorReasons          = req('/constants/error-reasons'),
	NickValidator         = req('/validators/nick'),
	PortValidator         = req('/validators/port'),
	UsernameValidator     = req('/validators/username'),
	RealnameValidator     = req('/validators/realname'),
	UserModeValidator     = req('/validators/user-mode'),
	AddressValidator      = req('/validators/address'),
	ServerNameValidator   = req('/validators/server-name');

module.exports = {

	init() {
		// Deliberately a noop for the time being.
	},

	validateAddress(address) {
		AddressValidator.validate(address);
	},

	validateMode(mode) {
		UserModeValidator.validate(mode);
	},

	validateNick(nick) {
		NickValidator.validate(nick);
	},

	validatePort(port) {
		PortValidator.validate(port);
	},

	validateSSL(ssl) {
		if (!isBoolean(ssl)) {
			throw new InvalidServerSSLError(ssl, ErrorReasons.WRONG_TYPE);
		}
	},

	validateName(name) {
		ServerNameValidator.validate(name);
	},

	validateUsername(username) {
		UsernameValidator.validate(username);
	},

	validateRealname(realname) {
		RealnameValidator.validate(realname);
	}

};
