
var
	Regexes           = req('/constants/regexes'),
	NickValidator     = req('/validators/nick'),
	HostnameValidator = req('/validators/hostname'),
	UsernameValidator = req('/validators/username'),
	RealnameValidator = req('/validators/realname'),
	extend            = req('/utilities/extend');

var
	InvalidClientIdentifierError = req('/lib/errors/invalid-client-identifier');

class ClientDetails {

	setNick(nick) {
		this.validateNick(nick);
		this.nick = nick;
		return this;
	}

	getNick() {
		this.validateNick(this.nick);
		return this.nick;
	}

	hasNick() {
		return this.nick !== null;
	}

	validateNick(nick) {
		NickValidator.validate(nick);
	}

	setUsername(username) {
		this.validateUsername(username);
		this.username = username;
		return this;
	}

	getUsername() {
		this.validateUsername(this.username);
		return this.username;
	}

	hasUsername() {
		return this.username !== null;
	}

	validateUsername(username) {
		UsernameValidator.validate(username);
	}

	setHostname(hostname) {
		this.validateHostname(hostname);
		this.hostname = hostname;
		return this;
	}

	getHostname() {
		this.validateHostname(this.hostname);
		return this.hostname;
	}

	hasHostname() {
		return this.hostname !== null;
	}

	validateHostname(hostname) {
		HostnameValidator.validate(hostname);
	}

	setRealname(realname) {
		RealnameValidator.validate(realname);
		this.realname = realname;
		return this;
	}

	getRealname() {
		RealnameValidator.validate(this.realname);
		return this.realname;
	}

	setHasIdent(has_ident) {
		this.has_ident = has_ident;
		return this;
	}

	hasIdent() {
		return this.has_ident;
	}

	getIdentPrefix() {
		if (this.hasIdent()) {
			return '';
		} else {
			return '~';
		}
	}

	getHostmask() {
		return this.getIdentPrefix() + this.getUsername() + '@' + this.getHostname();
	}

	hasHostmask() {
		return this.hasUsername() && this.hasHostname();
	}

	getIdentifier() {
		return this.getNick() + '!' + this.getHostmask();
	}

	hasIdentifier() {
		return this.hasNick() && this.hasHostmask();
	}

	addMode(mode) {
		this.modes.push(mode);
		return this;
	}

	getModes() {
		if (!this.modes) {
			this.modes = [ ];
		}

		return this.modes;
	}

	getTargetString() {
		return this.getNick();
	}

}

ClientDetails.fromIdentifier = function fromIdentifier(client_identifier) {
	var match = client_identifier.match(Regexes.CLIENT_IDENTIFIER);

	if (!match) {
		throw new InvalidClientIdentifierError(client_identifier);
	}

	var
		nick      = match[1],
		username  = match[2],
		hostname  = match[3],
		has_ident = true;

	if (username[0] === '~') {
		has_ident = false;
		username = username.slice(1);
	}

	return (new ClientDetails())
		.setNick(nick)
		.setUsername(username)
		.setHostname(hostname)
		.setHasIdent(has_ident);
};

ClientDetails.fromNick = function fromNick(nick) {
	return (new ClientDetails()).setNick(nick);
};

extend(ClientDetails.prototype, {

	nick:      null,
	username:  null,
	hostname:  null,
	has_ident: false

});

module.exports = ClientDetails;
