
var
	has       = req('/lib/utilities/has'),
	UserModes = req('/lib/constants/user-modes');


function validate(mode) {
	if (!mode) {
		throw new Error('Invalid user mode: ' + mode);
	}

	if (!has(UserModes, mode)) {
		throw new Error('Invalid user mode: ' + mode);
	}
}

module.exports = {
	validate: validate
};
