
var
	extend = req('/utilities/extend'),
	add    = req('/utilities/add');

var
	UserDetails = req('/lib/user-details');


class UserDetailsRegistry {

	constructor() {
		this.user_detail_records = [ ];
	}

	getUserDetailsForMessage(message) {
		return this.getOrStoreUserDetails(message.getUserDetails());
	}

	getOrStoreUserDetails(user_details) {
		return (
			   this.getMatchingUserDetails(user_details)
			|| this.storeUserDetails(user_details)
		);
	}

	getOrStoreUserDetailsForNick(nick) {
		var user_details = UserDetails.fromNick(nick);

		return this.getOrStoreUserDetails(user_details);
	}

	getMatchingUserDetails(user_details) {
		var index = 0;

		while (index < this.user_detail_records.length) {
			let current_user_details = this.user_detail_records[index];

			if (current_user_details.matches(user_details)) {
				return current_user_details;
			}

			index++;
		}

		return null;
	}

	storeUserDetails(user_details) {
		add(user_details).to(this.user_detail_records);
		return user_details;
	}

	addWhoisCallback(callback) {
		add(callback).to(this.getWhoisCallbacks());
	}

	getWhoisCallbacks() {
		if (!this.whois_callbacks) {
			this.whois_callbacks = [ ];
		}
	}

}

extend(UserDetailsRegistry.prototype, {

	user_detail_records: null,
	whois_callbacks:     null

});


module.exports = UserDetailsRegistry;
