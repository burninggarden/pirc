var
	UserRegistry = req('/lib/client/user-registry');


module.exports = {

	init() {
		this.user_registry = new UserRegistry();
	},

	getUserRegistry() {
		return this.user_registry;
	}

};
