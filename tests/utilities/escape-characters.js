var originalEscapeCharacters = require('../../utilities/escape-characters');

function escapeCharacters(test) {
	test.expect(1);

	var result = originalEscapeCharacters('foobar\\baz/%');

	test.equals(result, '\f\o\o\b\a\r\\\b\a\z\/\%');

	test.done();
}

module.exports = {
	escapeCharacters: escapeCharacters
};
