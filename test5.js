
global.req = require('req');

var
	ISupportMessage = req('/lib/server/messages/i-support'),
	ServerDetails   = req('/lib/server-details');

var message = new ISupportMessage();

message.setBody('This is the body of the isupport message');

var server_details = ServerDetails.fromIdentifier('irc.burninggarden.com');

message.setServerDetails(server_details);

console.log(message.serialize());
