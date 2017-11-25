
var isString = req('/lib/utility/is-string');

function validate(realname) {
	if (!realname) {
		throw new Error('Invalid realname: ' + realname);
	}

	if (!isString(realname)) {
		throw new Error('Invalid realname: ' + realname);
	}
}

module.exports = {
	validate: validate
};
