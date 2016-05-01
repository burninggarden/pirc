
function escapeCharacters(string) {
	return string.split('').join('\\');
}

module.exports = escapeCharacters;
