
/**
 * From RFC1459/RFC2812:
 *
 * ########################################################################
 *
 * 4.1.2 Nick message
 *
 *       Command: NICK
 *    Parameters: <nickname> [ <hopcount> ]
 *
 *    NICK message is used to give user a nickname or change the previous
 *    one.  The <hopcount> parameter is only used by servers to indicate
 *    how far away a nick is from its home server.  A local connection has
 *    a hopcount of 0.  If supplied by a client, it must be ignored.
 *
 *    If a NICK message arrives at a server which already knows about an
 *    identical nickname for another client, a nickname collision occurs.
 *    As a result of a nickname collision, all instances of the nickname
 *    are removed from the server's database, and a KILL command is issued
 *    to remove the nickname from all other server's database. If the NICK
 *    message causing the collision was a nickname change, then the
 *    original (old) nick must be removed as well.
 *
 *    If the server recieves an identical NICK from a client which is
 *    directly connected, it may issue an ERR_NICKCOLLISION to the local
 *    client, drop the NICK command, and not generate any kills.
 *
 *    Numeric Replies:
 *
 *            ERR_NONICKNAMEGIVEN             ERR_ERRONEUSNICKNAME
 *            ERR_NICKNAMEINUSE               ERR_NICKCOLLISION
 *            ERR_UNAVAILRESOURCE             ERR_RESTRICTED
 *
 *    Examples:
 *
 *    NICK Wiz                ; Introducing new nick "Wiz" if session is
 *                            still unregistered, or user changing his
 *                            nickname to "Wiz"
 *
 *    :WiZ!jto@tolsun.oulu.fi NICK Kilroy
 *                            ; Server telling that WiZ changed his
 *                            nickname to Kilroy.
 *
 *
 * ########################################################################
 *
 *
 * From RFC2813:
 *
 * ########################################################################
 *
 * 4.1.3 Nick
 *
 *       Command: NICK
 *    Parameters: <nickname> <hopcount> <username> <host> <servertoken>
 *                <umode> <realname>
 *
 *    This form of the NICK message MUST NOT be allowed from user
 *    connections. However, it MUST be used instead of the NICK/USER pair
 *    to notify other servers of new users joining the IRC network.
 *
 *    This message is really the combination of three distinct messages:
 *    NICK, USER and MODE [IRC-CLIENT].
 *
 *    The <hopcount> parameter is used by servers to indicate how far away
 *    a user is from its home server.  A local connection has a hopcount of
 *    0.  The hopcount value is incremented by each passed server.
 *
 *    The <servertoken> parameter replaces the <servername> parameter of
 *    the USER (See section 4.1.2 for more information on server tokens).
 *
 *    Examples:
 *
 *    NICK syrk 5 kalt millennium.stealth.net 34 +i :Christophe Kalt ; New
 *                                    user with nickname "syrk", username
 *                                    "kalt", connected from host
 *                                    "millennium.stealth.net" to server
 *                                    "34" ("csd.bu.edu" according to the
 *                                    previous example).
 *
 *    :krys NICK syrk                 ; The other form of the NICK message,
 *                                    as defined in "IRC Client Protocol"
 *                                    [IRC-CLIENT] and used between
 *                                    servers: krys changed his nickname to
 *                                    syrk
 *
 * ########################################################################
 */

var
	Heket = require('heket');

var
	add               = require('../../utility/add'),
	extend            = require('../../utility/extend'),
	Message_Command   = require('../../message/command'),
	ModeChange        = require('../../mode-change'),
	Parser_ModeChange = require('../../parser/mode-change');

var
	Error_InvalidUserMode = require('../../error/invalid-user-mode');


var
	Enum_Commands    = require('../../enum/commands'),
	Enum_Replies     = require('../../enum/replies'),
	Enum_TargetTypes = require('../../enum/target-types'),
	Enum_ModeActions = require('../../enum/mode-actions');

var
	Message_Reply_NoNicknameGiven   = require('../../message/reply/no-nickname-given'),
	Message_Reply_ErroneousNickname = require('../../message/reply/erroneous-nickname');


class Message_Command_Nick extends Message_Command {

	setNickname(nickname) {
		this.nickname = nickname;
		return this;
	}

	getNickname() {
		return this.nickname;
	}

	setHopCount(hop_count) {
		this.hop_count = hop_count;
		return this;
	}

	getHopCount() {
		return this.hop_count;
	}

	setUsername(username) {
		this.username = username;
		return this;
	}

	getUsername() {
		return this.username;
	}

	setHostname(hostname) {
		this.hostname = hostname;
		return this;
	}

	getHostname() {
		return this.hostname;
	}

	setServerToken(server_token) {
		this.server_token = server_token;
		return this;
	}

	getServerToken() {
		return this.server_token;
	}

	setRealname(realname) {
		this.realname = realname;
		return this;
	}

	getRealname() {
		return this.realname;
	}

	/**
	 * @param   {Enum_UserModes.XXX} modes
	 * @returns {self}
	 */
	addUserModes(modes) {
		modes.forEach(this.addUserMode, this);
		return this;
	}

	addUserMode(mode, parameters = null) {
		var mode_change = new ModeChange();

		mode_change.setTargetType(Enum_TargetTypes.USER);
		mode_change.setMode(mode);
		mode_change.setAction(Enum_ModeActions.ADD);

		if (parameters) {
			mode_change.setParameters(parameters);
		}

		return this.addModeChange(mode_change);
	}

	/**
	 * @param   {ModeChange} mode_change
	 * @returns {self}
	 */
	addModeChange(mode_change) {
		mode_change.validate();
		add(mode_change).to(this.getModeChanges());

		return this;
	}

	getModeChanges() {
		if (!this.mode_changes) {
			this.mode_changes = [ ];
		}

		return this.mode_changes;
	}

	hasModeChanges() {
		return this.getModeChanges().length > 0;
	}

	/**
	 * @param   {Enum_UserModes.XXX[]} modes
	 * @returns {self}
	 */
	setUserModes(modes) {
		return this.addUserModes(modes);
	}

	/**
	 * @returns {Enum_UserModes.XXX[]}
	 */
	getUserModes() {
		return this.getModeChanges().map(function map(mode_change) {
			return mode_change.getMode();
		});
	}

	getValuesForParameters() {
		return {
			nickname:     this.getNickname(),
			hop_count:    this.getHopCount(),
			username:     this.getUsername(),
			hostname:     this.getHostname(),
			server_token: this.getServerToken(),
			mode_change:  this.getModeChangeValuesForParameters(),
			realname:     this.getRealname()
		};
	}

	getModeChangeValuesForParameters() {
		if (!this.hasModeChanges()) {
			return [ ];
		}

		var
			mode_action     = null,
			mode_chars      = [ ],
			mode_parameters = [ ];

		this.getModeChanges().forEach(function each(mode_change) {
			mode_action = mode_change.getAction();
			mode_chars.push(mode_change.getMode());

			if (mode_change.hasParameters()) {
				mode_parameters = mode_parameters.concat(
					mode_change.getParameters()
				);
			}
		});

		return [{
			mode_action: mode_action,
			mode_char:   mode_chars,
			mode_param:  mode_parameters
		}];
	}

	setValuesFromParameters(parameters) {
		this.setNickname(parameters.get('nickname'));
		this.setHopCount(parameters.get('hop_count'));
		this.setUsername(parameters.get('username'));
		this.setHostname(parameters.get('hostname'));
		this.setServerToken(parameters.get('server_token'));
		this.setRealname(parameters.get('realname'));

		try {
			this.addModeChangesFromStrings(parameters.getAll('mode_change'));
		} catch (error) {
			if (!(error instanceof Error_InvalidUserMode)) {
				throw error;
			}

			return this.handleParameterParsingError(error);
		}
	}

	addModeChangesFromStrings(mode_change_strings) {
		mode_change_strings.forEach(this.addModeChangeFromString, this);
	}

	addModeChangeFromString(mode_change_string) {
		var
			match       = Parser_ModeChange.parse(mode_change_string),
			mode_action = match.get('mode_action');

		if (mode_action !== Enum_ModeActions.ADD) {
			throw new Error('Invalid mode action: ' + mode_change_string);
		}


		var mode_params = match.getAll('mode_param');

		if (mode_params.length) {
			throw new Error('Invalid mode params: ' + mode_change_string);
		}

		var
			mode_chars = match.getAll('mode_char'),
			index      = 0;

		while (index < mode_chars.length) {
			let
				mode_change = new ModeChange(),
				mode_char   = mode_chars[index];

			mode_change.setNickname(this.getNickname());
			mode_change.setMode(mode_char);
			mode_change.setAction(mode_action);

			this.addModeChange(mode_change);

			index++;
		}
	}

	handleParameterParsingError(error) {
		if (
			   error instanceof Heket.MissingRuleValueError
			&& error.getRuleName() === 'nickname'
		) {
			return void this.setImmediateResponse(new Message_Reply_NoNicknameGiven());
		}

		if (
			   error instanceof Heket.InvalidRuleValueError
			&& error.getRuleName() === 'nickname'
		) {
			let message = new Message_Reply_ErroneousNickname();

			message.setNickname(error.getValue());

			return void this.setImmediateResponse(message);
		}
	}

	getPossibleReplies() {
		return [
			Enum_Replies.ERR_NONICKNAMEGIVEN,
			Enum_Replies.ERR_ERRONEUSNICKNAME,
			Enum_Replies.ERR_NICKNAMEINUSE,
			Enum_Replies.ERR_NICKCOLLISION,
			Enum_Replies.ERR_UNAVAILRESOURCE,
			Enum_Replies.ERR_RESTRICTED
		];
	}

}

extend(Message_Command_Nick.prototype, {
	command:      Enum_Commands.NICK,
	abnf:         '<nickname> [ " " <hop-count> " " <username> " " <hostname> " " <server-token> [ " " <mode-change> ] " " <realname>',
	nickname:     null,
	hop_count:    null,
	username:     null,
	hostname:     null,
	server_token: null,
	realname:     null,
	mode_changes: null
});

extend(Message_Command_Nick, {

	fromClientConnection(client_connection) {
		return (new Message_Command_Nick())
			.setNickname(client_connection.getNickname())
			.setHopCount(client_connection.getHopCount())
			.setUsername(client_connection.getUsername())
			.setHostname(client_connection.getHostname())
			.setServerToken(client_connection.getServerToken())
			.setUserModes(client_connection.getUserModes())
			.setRealname(client_connection.getRealname());
	}

});


module.exports = Message_Command_Nick;
