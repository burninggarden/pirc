

function getFilename(filepath) {
	var parts = filepath.split('/');

	return parts.pop();
}

module.exports = getFilename;
