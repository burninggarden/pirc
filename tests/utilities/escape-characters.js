var escapeCharacters = req('/lib/utilities/escape-characters');

function testEscapeCharacters(test) {
	test.expect(1);

	var result = escapeCharacters('foobar\\baz/%');

	test.equals(result, '\f\o\o\b\a\r\\\b\a\z\/\%');

	test.done();
}

module.exports = {
	testEscapeCharacters
};
