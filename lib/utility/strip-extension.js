
function stripExtension(filepath) {
	var parts = filepath.split('.');

	if (parts.length === 1) {
		return filepath;
	}

	parts.pop();

	return parts.join('.');
}

module.exports = stripExtension;
