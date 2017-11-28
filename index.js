
var
	Client     = require('./lib/client'),
	Server     = require('./lib/server'),
	TestRunner = require('./lib/test/runner');

function testServer(createServer) {
	(new TestRunner(createServer)).run();
}

module.exports = {
	Client,
	Server,
	testServer
};
