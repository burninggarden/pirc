
var
	InvalidTopicError = req('/lib/errors/invalid-topic'),
	ErrorReasons      = req('/constants/error-reasons');


function validate(topic) {
	if (!topic) {
		throw new InvalidTopicError(topic, ErrorReasons.OMITTED);
	}
}

module.exports = {
	validate
};
