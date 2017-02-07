
var
	extend = req('/utilities/extend');

class UserRegistry {

	constructor() {
		this.users_by_id = { };
	}

	getUserForId(id) {
		return this.users_by_id[id];
	}

	setUserForId(users, id) {
		this.users_by_id[id] = users;
	}

	getUserForMessage(message) {
		var
			user_details = message.getUserDetails(),
			user_id      = user_details.getIdentifier();

		var cached_details = this.getUserForId(user_id);

		if (cached_details) {
			// TODO: hydrate the cached value, or vice versa?
			return cached_details;
		}

		this.setUserForId(user_details, user_id);

		return user_details;
	}

}

extend(UserRegistry.prototype, {

	users_by_id: null

});


module.exports = UserRegistry;
