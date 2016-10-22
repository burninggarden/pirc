
var
	Regexes = req('/constants/regexes');


function testNickRegexAgainstChannel(test) {
	test.expect(1);
	test.equals(
		Regexes.NICK.test('#foobar'),
		false
	);

	test.done();
}

module.exports = {
	testNickRegexAgainstChannel
};
