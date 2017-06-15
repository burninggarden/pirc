
var
	Heket       = require('heket'),
	FS          = require('fs'),
	getBasePath = require('../utilities/get-base-path');

var spec = FS.readFileSync(getBasePath() + '/abnf/irc.abnf', 'utf8');

module.exports = Heket.createParser(spec);
