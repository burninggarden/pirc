

function sanitize(string) {
	return string.replace(/[^\x00-\xFFF]|[\r\n]/g, '');
}

module.exports = sanitize;
