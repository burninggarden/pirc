/*
3.2.1 Join message

      Command: JOIN
   Parameters: ( <channel> *( "," <channel> ) [ <key> *( "," <key> ) ] )
               / "0"

   The JOIN command is used by a user to request to start listening to
   the specific channel.  Servers MUST be able to parse arguments in the
   form of a list of target, but SHOULD NOT use lists when sending JOIN
   messages to clients.

   Once a user has joined a channel, he receives information about
   all commands his server receives affecting the channel.  This
   includes JOIN, MODE, KICK, PART, QUIT and of course PRIVMSG/NOTICE.
   This allows channel members to keep track of the other channel
   members, as well as channel modes.

   If a JOIN is successful, the user receives a JOIN message as
   confirmation and is then sent the channel's topic (using RPL_TOPIC) and
   the list of users who are on the channel (using RPL_NAMREPLY), which
   MUST include the user joining.

   Note that this message accepts a special argument ("0"), which is
   a special request to leave all channels the user is currently a member
   of.  The server will process this message as if the user had sent
   a PART command (See Section 3.2.2) for each channel he is a member
   of.

   Numeric Replies:

           ERR_NEEDMOREPARAMS              ERR_BANNEDFROMCHAN
           ERR_INVITEONLYCHAN              ERR_BADCHANNELKEY
           ERR_CHANNELISFULL               ERR_BADCHANMASK
           ERR_NOSUCHCHANNEL               ERR_TOOMANYCHANNELS
           ERR_TOOMANYTARGETS              ERR_UNAVAILRESOURCE
           RPL_TOPIC

   Examples:

   JOIN #foobar                    ; Command to join channel #foobar.

   JOIN &foo fubar                 ; Command to join channel &foo using
                                   key "fubar".

   JOIN #foo,&bar fubar            ; Command to join channel #foo using
                                   key "fubar" and &bar using no key.

   JOIN #foo,#bar fubar,foobar     ; Command to join channel #foo using
                                   key "fubar", and channel #bar using
                                   key "foobar".

   JOIN #foo,#bar                  ; Command to join channels #foo and
                                   #bar.

   JOIN 0                          ; Leave all currently joined
                                   channels.

   :WiZ!jto@tolsun.oulu.fi JOIN #Twilight_zone ; JOIN message from WiZ
                                   on channel #Twilight_zone
*/


var
	Promix = require('promix');


function joinSingle(test) {
	test.expect(2);

	var client = test.createServerAndClient({
		nickname:              'cloudbreaker',
		username:              'cloudbreaker',
		log_incoming_messages: true
	});

	client.once('registered', function handler(connection) {
		client.joinChannel('#ganondorf', function handler(error, channel) {
			if (error) {
				test.ok(false, error.toString());
				return void test.done();
			}

			console.log('CHECK');

			test.equals(channel.getName(), '#ganondorf');
			test.deepEquals(channel.getNicknames(), ['cloudbreaker']);
			test.done();
		});
	});
}

function joinMultiple(test) {
	test.expect(4);

	var client = test.createServerAndClient({
		nickname: 'cloudbreaker',
		username: 'cloudbreaker'
	});

	client.once('registered', function handler(connection) {
		var channel_names = [
			'#charizard',
			'#blastoise'
		];

		client.joinChannels(channel_names, function handler(error, channels) {
			if (error) {
				test.ok(false, error.toString());
				return void test.done();
			}

			test.equals(channels[0].getName(), '#charizard');
			test.deepEquals(channels[0].getNicknames(), [
				'cloudbreaker'
			]);

			test.equals(channels[1].getName(), '#blastoise');
			test.deepEquals(channels[0].getNicknames(), [
				'cloudbreaker'
			]);

			test.done();
		});
	});
}

function joinWithKey(test) {
	test.expect(1);

	var
		server = test.createServer(),
		chain  = Promix.chain();

	var first_client = test.createClient({
		nickname: 'cloudbreaker',
		username: 'cloudbreaker',
		port:     server.getPort()
	});

	var second_client = test.createClient({
		nickname: 'domino',
		username: 'domino',
		port:     server.getPort()
	});

	chain.andOnce(first_client, 'registered');
	chain.andOnce(second_client, 'registered');
	chain.then(first_client.joinChannel, '#ganondorf');
	chain.bind(first_client).as('first_channel');
	chain.then(first_client.setChannelKey, '#ganondorf', 'gerudo');
	chain.bind(first_client);
	chain.then(second_client.joinChannelWithKey, '#ganondorf', 'gerudo');
	chain.bind(second_client).as('second_channel');

	chain.then(function success() {
		test.ok(true, 'Channel joined successfully with key');
		test.done();
	});

	chain.otherwise(function failure(error) {
		test.ok(false, error.toString());
		test.done();
	});
}

function joinMixedKeyAndNoKey(test) {
	test.bypass();
}

function joinMultipleKeys(test) {
	test.bypass();
}

function leaveAllChannels(test) {
	test.bypass();
}

function receiveJoinMessage(test) {
	test.bypass();
}

function ERR_NEEDMOREPARAMS(test) {
	test.bypass();
}

function ERR_INVITEONLYCHAN(test) {
	test.bypass();
}

function ERR_CHANNELISFULL(test) {
	test.bypass();
}

function ERR_NOSUCHCHANNEL(test) {
	test.bypass();
}

function ERR_TOOMANYTARGETS(test) {
	test.bypass();
}

function ERR_BANNEDFROMCHAN(test) {
	test.bypass();
}

function ERR_BADCHANNELKEY(test) {
	test.bypass();
}

function ERR_BADCHANMASK(test) {
	test.bypass();
}

function ERR_TOOMANYCHANNELS(test) {
	test.bypass();
}

function ERR_UNAVAILRESOURCE(test) {
	test.bypass();
}

function RPL_TOPIC(test) {
	test.bypass();
}

module.exports = {
	joinSingle,
	joinMultiple,
	joinWithKey,
	joinMixedKeyAndNoKey,
	joinMultipleKeys,
	leaveAllChannels,
	receiveJoinMessage,
	ERR_NEEDMOREPARAMS,
	ERR_INVITEONLYCHAN,
	ERR_CHANNELISFULL ,
	ERR_NOSUCHCHANNEL ,
	ERR_TOOMANYTARGETS,
	ERR_BANNEDFROMCHAN,
	ERR_BADCHANNELKEY,
	ERR_BADCHANMASK,
	ERR_TOOMANYCHANNELS,
	ERR_UNAVAILRESOURCE,
	RPL_TOPIC
};
