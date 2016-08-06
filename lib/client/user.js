
var
	UsernameValidator = req('/validators/username'),
	HostnameValidator = req('/validators/hostname'),
	NickValidator     = req('/validators/nick');

class User {

	setUsername(username) {
		UsernameValidator.validate(username);
		this.username = username;
		return this;
	}

	setHostname(hostname) {
		HostnameValidator.validate(hostname);
		this.hostname = hostname;
		return this;
	}

	setNick(nick) {
		NickValidator.validate(nick);
		this.nick = nick;
		return this;
	}

	setUserId(user_id) {
		this.user_id = user_id;
		return this;
	}

}

module.exports = User;
