/*
3.2.4 Topic message

      Command: TOPIC
   Parameters: <channel> [ <topic> ]

   The TOPIC command is used to change or view the topic of a channel.
   The topic for channel <channel> is returned if there is no <topic>
   given.  If the <topic> parameter is present, the topic for that
   channel will be changed, if this action is allowed for the user
   requesting it.  If the <topic> parameter is an empty string, the
   topic for that channel will be removed.






Kalt                         Informational                     [Page 19]
--------------------------------------------------------------------------------
RFC 2812          Internet Relay Chat: Client Protocol        April 2000


   Numeric Replies:

           ERR_NEEDMOREPARAMS              ERR_NOTONCHANNEL
           RPL_NOTOPIC                     RPL_TOPIC
           ERR_CHANOPRIVSNEEDED            ERR_NOCHANMODES

   Examples:

   :WiZ!jto@tolsun.oulu.fi TOPIC #test :New topic ; User Wiz setting the
                                   topic.

   TOPIC #test :another topic      ; Command to set the topic on #test
                                   to "another topic".

   TOPIC #test :                   ; Command to clear the topic on
                                   #test.

   TOPIC #test                     ; Command to check the topic for
                                   #test.
*/

var
	Promix = require('promix');


function setTopic(test) {
	var client_a = test.createServerAndClient({
		nickname: 'cloudbreaker',
		username: 'cloudbreaker'
	});

	var client_b = test.createClient({
		nickname: 'domino',
		username: 'domino'
	});

	var chain = Promix.chain();

	chain.andOnce(client_a, 'registered');
	chain.andOnce(client_b, 'registered');
	chain.then(client_a.joinChannel, '#ganondorf').as('channel_a');
	chain.then(client_b.joinChannel, '#ganondorf').as('channel_b');

	chain.then(client_a.getTopicForChannel, chain.channel_a)
		.as('original_topic_a');

	chain.then(client_b.getTopicForChannel, chain.channel_b)
		.as('original_topic_b');

	chain.then(
		client_a.setTopicForChannel,
		chain.channel_a,
		'King of the Gerudo'
	);

	chain.then(client_a.getTopicForChannel, chain.channel_a)
		.as('new_topic_a');

	chain.then(client_b.getTopicForChannel, chain.channel_b)
		.as('new_topic_b');

	chain.then(function finisher(results) {
		test.equals(results.original_topic_a, '');
		test.equals(results.original_topic_b, '');
		test.equals(results.new_topic_a, 'King of the Gerudo');
		test.equals(results.new_topic_b, 'King of the Gerudo');

		test.done();
	});

	chain.otherwise(test.handleError);
}

function checkTopic(test) {
	test.bypass();
}

function clearTopic(test) {
	test.bypass();
}

function ERR_NEEDMOREPARAMS(test) {
	test.bypass();
}

function RPL_NOTOPIC(test) {
	test.bypass();
}

function ERR_CHANOPRIVSNEEDED(test) {
	test.bypass();
}

function ERR_NOTONCHANNEL(test) {
	test.bypass();
}

function ERR_NOCHANMODES(test) {
	test.bypass();
}

module.exports = {
	checkTopic,
	setTopic,
	clearTopic,
	ERR_NEEDMOREPARAMS,
	RPL_NOTOPIC,
	ERR_CHANOPRIVSNEEDED,
	ERR_NOTONCHANNEL,
	ERR_NOCHANMODES
};
