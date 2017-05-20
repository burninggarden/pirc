
var
	InvalidTopicError = req('/lib/errors/invalid-topic'),
	ErrorReasons      = req('/lib/constants/error-reasons');


function validate(topic) {
	if (!topic) {
		throw new InvalidTopicError(topic, ErrorReasons.OMITTED);
	}
}

module.exports = {
	validate
};
