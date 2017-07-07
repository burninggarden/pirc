
var
	extend = req('/lib/utilities/extend'),
	add    = req('/lib/utilities/add');

var
	UserDetails = req('/lib/user-details');


class UserDetailsRegistry {

	constructor() {
		this.user_detail_records = [ ];
	}

	getUserDetailsForMessage(message) {
		var user_id = message.getOriginUserId();

		if (!user_id) {
			let nickname = message.getTarget();

			if (!nickname) {
				let string = message.getRawMessage();

				throw new Error(
					`Unable to determine user details for message: ${string}`
				);
			}

			return this.getOrStoreUserDetailsForNickname(nickname);
		}

		try {
			return this.getOrStoreUserDetailsForUserId(user_id);
		} catch (error) {
			throw error;
		}
	}

	getOrStoreUserDetails(user_details) {
		if (!(user_details instanceof UserDetails)) {
			throw new Error(`
				Invalid user details argument supplied: ${typeof user_details}
			`);
		}

		return (
			   this.getMatchingUserDetails(user_details)
			|| this.storeUserDetails(user_details)
		);
	}

	getOrStoreUserDetailsForNickname(nickname) {
		var user_details = UserDetails.fromNickname(nickname);

		return this.getOrStoreUserDetails(user_details);
	}

	getOrStoreUserDetailsForUserId(user_id) {
		var user_details = UserDetails.fromUserId(user_id);

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

}

extend(UserDetailsRegistry.prototype, {

	user_detail_records: null

});


module.exports = UserDetailsRegistry;
