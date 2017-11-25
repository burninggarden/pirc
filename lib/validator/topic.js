
function validate(topic) {
	if (!topic) {
		throw new Error('Invalid topic: ' + topic);
	}
}

module.exports = {
	validate
};
