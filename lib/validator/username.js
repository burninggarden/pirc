
var isString = req('/lib/utility/is-string');

function validate(username) {
	if (!username) {
		throw new Error('Invalid username: ' + username);
	}

	if (!isString(username)) {
		throw new Error('Invalid username: ' + username);
	}
}

module.exports = {
	validate: validate
};
