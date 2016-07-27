global.req = require('req');

var
	Client = require('./lib/client'),
	Server = require('./lib/server');

module.exports = {
	Client: Client,
	Server: Server
};
