
var
	has            = req('/lib/utility/has'),
	Enum_UserModes = req('/lib/enum/user-modes');

var
	Error_InvalidUserMode = req('/lib/error/invalid-user-mode');


function validate(mode) {
	if (!mode) {
		throw new Error_InvalidUserMode('Invalid user mode: ' + mode);
	}

	if (!has(Enum_UserModes, mode)) {
		throw new Error_InvalidUserMode('Invalid user mode: ' + mode);
	}
}

module.exports = {
	validate
};
