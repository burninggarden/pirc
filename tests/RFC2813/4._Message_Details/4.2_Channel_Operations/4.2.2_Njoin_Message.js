
/**
 *
 * 4.2.2 Njoin message
 *
 *       Command: NJOIN
 *    Parameters: <channel> [ "@@" / "@" ] [ "+" ] <nickname>
 *                          *( "," [ "@@" / "@" ] [ "+" ] <nickname> )
 *
 *    The NJOIN message is used between servers only.  If such a message is
 *    received from a client, it MUST be ignored.  It is used when two
 *    servers connect to each other to exchange the list of channel members
 *    for each channel.
 *
 *    Even though the same function can be performed by using a succession
 *    of JOIN, this message SHOULD be used instead as it is more efficient.
 *    The prefix "@@" indicates that the user is the "channel creator", the
 *    character "@" alone indicates a "channel operator", and the character
 *    '+' indicates that the user has the voice privilege.
 *
 *    Numeric Replies:
 *
 *            ERR_NEEDMOREPARAMS              ERR_NOSUCHCHANNEL
 *            ERR_ALREADYREGISTRED
 *
 *    Examples:
 *
 *    :ircd.stealth.net NJOIN #Twilight_zone :@WiZ,+syrk,avalon ; NJOIN
 *                                    message from ircd.stealth.net
 *                                    announcing users joining the
 *                                    #Twilight_zone channel: WiZ with
 *                                    channel operator status, syrk with
 *                                    voice privilege and avalon with no
 *                                    privilege.
 */


var
	Promix = require('promix');


function ERR_NEEDMOREPARAMS(test) {
	test.bypass();
}

function ERR_NOSUCHCHANNEL(test) {
	test.bypass();
}

function ERR_ALREADYREGISTRED(test) {
	test.bypass();
}

function fromClient(test) {
	// TODO: write a test that ensures that the server ignores any NJOIN
	// message sent by a client.
	test.bypass();
}

function fromServer(test) {
	var hostname = 'localhost';

	var server_a = test.createServer({
		password: 'glamdring',

		authenticateServer(parameters, callback) {
			test.equals(parameters.hostname, hostname);
			test.equals(parameters.password, 'orcrist');
			test.done();
		},

		authenticateOperator(parameters, callback) {
			test.equals(parameters.username, 'charizard');
			test.equals(parameters.password, 'blastoise');

			callback(null, ['o', 'O']);
		}
	});

	var server_b = test.createServer({
		password: 'orcrist',

		authenticateServer(parameters, callback) {
			test.equals(parameters.hostname, hostname);
			test.equals(parameters.password, 'glamdring');

			if (
				   parameters.hostname === hostname
				&& parameters.password === 'glamdring'
			) {
				return void callback(null);
			} else {
				test.ok(false, 'Credentials mismatch');
				test.done();
			}
		}
	});

	var client_a = test.createClient({
		nickname:              'cloudbreaker',
		username:              'cloudbreaker',
		port:                  server_a.getPort(),
		log_outgoing_messages: true
	});

	var client_b = test.createClient({
		nickname: 'seventh',
		username: 'seventh',
		port:     server_b.getPort()
	});

	var
		username = 'charizard',
		password = 'blastoise';

	var chain = Promix.chain();

	chain.andOnce(client_a, 'registered');
	chain.andOnce(client_b, 'registered');

	chain.then(test.clearTimeout).bind(test);

	chain.then(client_a.registerAsOperator, username, password).bind(client_a);
	chain.then(client_a.joinChannel, '#pokemon').bind(client_a);
	chain.then(client_b.joinChannel, '#pokemon').bind(client_b);

	chain.then(client_a.sendConnectMessage, hostname, server_b.getPort());
	chain.bind(client_a);

	chain.then(test.clearTimeout).bind(test);
}

module.exports = {
	ERR_NEEDMOREPARAMS,
	ERR_NOSUCHCHANNEL,
	ERR_ALREADYREGISTRED,
	fromClient,
	fromServer
};
