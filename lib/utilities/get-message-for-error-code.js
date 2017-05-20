var
	ErrorCodes = req('/lib/constants/error-codes');


function instantiate(key) {
	var constructor = req('/lib/server/messages/' + key);

	return new constructor();
}


function getMessageForError(error_code) {
	switch (error_code) {
		case ErrorCodes.INVALID_COMMAND:
			return instantiate('unknown-command');

		default:
			throw new Error('Unsupported error code: ' + error_code);
	}
}

module.exports = getMessageForError;
