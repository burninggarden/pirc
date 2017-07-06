
require('req');

var
	Client     = req('/lib/client'),
	Server     = req('/lib/server'),
	TestRunner = req('/lib/test-runner');

function testServer(createServer) {
	(new TestRunner(createServer)).run();
}

module.exports = {
	Client,
	Server,
	testServer
};
