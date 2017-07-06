

function getExtension(filepath) {
	var
		parts = filepath.split('/'),
		tail  = parts.pop();

	if (tail.indexOf('.') === -1) {
		return null;
	}

	return filepath.split('.').pop().toLowerCase();
}

module.exports = getExtension;
