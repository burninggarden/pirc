
var
	extend = req('/utilities/extend'),
	User   = req('/lib/client/user');


class UserRegistry {

	constructor() {
		this.users_by_id = { };
	}

	createUserForMessage(message) {
		var
			user_id  = message.getUserIdentifier(),
			username = message.getUsername(),
			hostname = message.getHostname(),
			nick     = message.getNick();

		var user = new User();

		user.setUserId(user_id);
		user.setUsername(username);
		user.setHostname(hostname);
		user.setNick(nick);

		this.users_by_id[user_id] = user;

		return user;
	}

	getUserForMessage(message) {
		var user_id = message.getUserIdentifier();

		return this.users_by_id[user_id];
	}

	getOrCreateUserForMessage(message) {
		return (
			   this.getUserForMessage(message)
			|| this.createUserForMessage(message)
		);
	}

}

extend(UserRegistry.prototype, {

	users_by_id: null

});


module.exports = UserRegistry;
