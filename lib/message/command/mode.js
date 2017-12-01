/**
 * Even though they're defined as separate sections in the RFC's, user mode
 * and channel mode messages are more easily implemented as a single command
 * class. Because of parsing. Below find the relevant sections of the spec
 * for each variant.
 *
 *
 * From RFC2812:
 *
 * ##########################################################################
 *
 * 3.1.5 User mode message
 *
 *       Command: MODE
 *    Parameters: <nickname>
 *                *( ( "+" / "-" ) *( "i" / "w" / "o" / "O" / "r" ) )
 *
 *    The user MODE's are typically changes which affect either how the
 *    client is seen by others or what 'extra' messages the client is sent.
 *
 *    A user MODE command MUST only be accepted if both the sender of the
 *    message and the nickname given as a parameter are both the same.  If
 *    no other parameter is given, then the server will return the current
 *    settings for the nick.
 *
 *       The available modes are as follows:
 *
 *            a - user is flagged as away;
 *            i - marks a users as invisible;
 *            w - user receives wallops;
 *            r - restricted user connection;
 *            o - operator flag;
 *            O - local operator flag;
 *            s - marks a user for receipt of server notices.
 *
 *    Additional modes may be available later on.
 *
 *    The flag 'a' SHALL NOT be toggled by the user using the MODE command,
 *    instead use of the AWAY command is REQUIRED.
 *
 *    If a user attempts to make themselves an operator using the "+o" or
 *    "+O" flag, the attempt SHOULD be ignored as users could bypass the
 *    authentication mechanisms of the OPER command.  There is no
 *    restriction, however, on anyone `deopping' themselves (using "-o" or
 *    "-O").
 *
 *    On the other hand, if a user attempts to make themselves unrestricted
 *    using the "-r" flag, the attempt SHOULD be ignored.  There is no
 *    restriction, however, on anyone `deopping' themselves (using "+r").
 *    This flag is typically set by the server upon connection for
 *    administrative reasons.  While the restrictions imposed are left up
 *    to the implementation, it is typical that a restricted user not be
 *    allowed to change nicknames, nor make use of the channel operator
 *    status on channels.
 *
 *    The flag 's' is obsolete but MAY still be used.
 *
 *    Numeric Replies:
 *
 *            ERR_NEEDMOREPARAMS              ERR_USERSDONTMATCH
 *            ERR_UMODEUNKNOWNFLAG            RPL_UMODEIS
 *
 *    Examples:
 *
 *    MODE WiZ -w                     ; Command by WiZ to turn off
 *                                    reception of WALLOPS messages.
 *
 *    MODE Angel +i                   ; Command from Angel to make herself
 *                                    invisible.
 *
 *    MODE WiZ -o                     ; WiZ 'deopping' (removing operator
 *                                    status).
 *
 * ##########################################################################
 *
 *
 * 3.2.3 Channel mode message
 *
 *       Command: MODE
 *    Parameters: <channel> *( ( "-" / "+" ) *<modes> *<modeparams> )
 *
 *    The MODE command is provided so that users may query and change the
 *    characteristics of a channel.  For more details on available modes
 *    and their uses, see "Internet Relay Chat: Channel Management" [IRC-
 *    CHAN].  Note that there is a maximum limit of three (3) changes per
 *    command for modes that take a parameter.
 *
 *    Numeric Replies:
 *
 *            ERR_NEEDMOREPARAMS              ERR_KEYSET
 *            ERR_NOCHANMODES                 ERR_CHANOPRIVSNEEDED
 *            ERR_USERNOTINCHANNEL            ERR_UNKNOWNMODE
 *            RPL_CHANNELMODEIS
 *            RPL_BANLIST                     RPL_ENDOFBANLIST
 *            RPL_EXCEPTLIST                  RPL_ENDOFEXCEPTLIST
 *            RPL_INVITELIST                  RPL_ENDOFINVITELIST
 *            RPL_UNIQOPIS
 *
 *    The following examples are given to help understanding the syntax of
 *    the MODE command, but refer to modes defined in "Internet Relay Chat:
 *    Channel Management" [IRC-CHAN].
 *
 *    Examples:
 *
 *    MODE #Finnish +imI *!*@*.fi     ; Command to make #Finnish channel
 *                                    moderated and 'invite-only' with user
 *                                    with a hostname matching *.fi
 *                                    automatically invited.
 *
 *    MODE #Finnish +o Kilroy         ; Command to give 'chanop' privileges
 *                                    to Kilroy on channel #Finnish.
 *
 *    MODE #Finnish +v Wiz            ; Command to allow WiZ to speak on
 *                                    #Finnish.
 *
 *    MODE #Fins -s                   ; Command to remove 'secret' flag
 *                                    from channel #Fins.
 *
 *    MODE #42 +k oulu                ; Command to set the channel key to
 *                                    "oulu".
 *
 *    MODE #42 -k oulu                ; Command to remove the "oulu"
 *                                    channel key on channel "#42".
 *
 *    MODE #eu-opers +l 10            ; Command to set the limit for the
 *                                    number of users on channel
 *                                    "#eu-opers" to 10.
 *
 *    :WiZ!jto@tolsun.oulu.fi MODE #eu-opers -l
 *                                    ; User "WiZ" removing the limit for
 *                                    the number of users on channel "#eu-
 *                                    opers".
 *
 *    MODE &oulu +b                   ; Command to list ban masks set for
 *                                    the channel "&oulu".
 *
 *    MODE &oulu +b *!*@*             ; Command to prevent all users from
 *                                    joining.
 *
 *    MODE &oulu +b *!*@*.edu +e *!*@*.bu.edu
 *                                    ; Command to prevent any user from a
 *                                    hostname matching *.edu from joining,
 *                                    except if matching *.bu.edu
 *
 *    MODE #bu +be *!*@*.edu *!*@*.bu.edu
 *                                    ; Comment to prevent any user from a
 *                                    hostname matching *.edu from joining,
 *                                    except if matching *.bu.edu
 *
 *    MODE #meditation e              ; Command to list exception masks set
 *                                    for the channel "#meditation".
 *
 *    MODE #meditation I              ; Command to list invitations masks
 *                                    set for the channel "#meditation".
 *
 *    MODE !12345ircd O               ; Command to ask who the channel
 *                                    creator for "!12345ircd" is
 */

var
	Heket = require('heket');


var
	extend = require('../../utility/extend'),
	add    = require('../../utility/add');

var
	Message_Command   = require('../../message/command'),
	ModeChange        = require('../../mode-change'),
	Parser_ModeChange = require('../../parser/mode-change');

var
	Enum_Commands           = require('../../enum/commands'),
	Enum_Replies            = require('../../enum/replies'),
	Enum_TargetTypes        = require('../../enum/target-types'),
	Enum_ModeActions        = require('../../enum/mode-actions'),
	Enum_ModeParameterTypes = require('../../enum/mode-parameter-types');

var
	Error_InvalidUserMode = require('../../error/invalid-user-mode');

var
	Message_Reply_NeedMoreParameters  = require('../../message/reply/need-more-parameters'),
	Message_Reply_UserModeUnknownFlag = require('../../message/reply/user-mode-unknown-flag');




class Message_Command_Mode extends Message_Command {

	addUserMode(user_mode) {
		return this.addUserModes([user_mode]);
	}

	removeUserMode(user_mode) {
		return this.removeUserModes([user_mode]);
	}

	addUserModes(user_modes) {
		this.setTargetType(Enum_TargetTypes.USER);
		return this.addModes(user_modes);
	}

	removeUserModes(user_modes) {
		this.setTargetType(Enum_TargetTypes.USER);
		return this.removeModes(user_modes);
	}

	addChannelMode(channel_mode) {
		return this.addChannelModes([channel_mode]);
	}

	removeChannelMode(channel_mode) {
		return this.removeChannelModes([channel_mode]);
	}

	addChannelModes(channel_modes) {
		this.setTargetType(Enum_TargetTypes.CHANNEL);
		return this.addModes(channel_modes);
	}

	removeChannelModes(channel_modes) {
		this.setTargetType(Enum_TargetTypes.CHANNEL);
		return this.removeModes(channel_modes);
	}

	addModes(modes) {
		modes.forEach(function each(mode) {
			this.addMode(mode);
		}, this);

		return this;
	}

	removeModes(modes) {
		modes.forEach(this.removeMode, this);
		return this;
	}

	addMode(mode, parameters = null) {
		var mode_change = new ModeChange();

		mode_change.setTargetType(this.getTargetType());
		mode_change.setMode(mode);
		mode_change.setAction(Enum_ModeActions.ADD);

		if (parameters) {
			mode_change.setParameters(parameters);
		}

		return this.addModeChange(mode_change);
	}

	removeMode(mode) {
		var mode_change = new ModeChange();

		mode_change.setTargetType(this.getTargetType());
		mode_change.setMode(mode);
		mode_change.setAction(Enum_ModeActions.REMOVE);

		return this.addModeChange(mode_change);
	}

	getChannelName() {
		return this.channel_name;
	}

	hasChannelName() {
		return this.getChannelName() !== null;
	}

	setChannelName(channel_name = null) {
		if (channel_name) {
			this.setTargetType(Enum_TargetTypes.CHANNEL);
		}

		this.channel_name = channel_name;
		return this;
	}

	getNickname() {
		return this.nickname;
	}

	hasNickname() {
		return this.getNickname() !== null;
	}

	setNickname(nickname = null) {
		if (nickname) {
			this.setTargetType(Enum_TargetTypes.USER);
		}

		this.nickname = nickname;
		return this;
	}

	getValuesForParameters() {
		return {
			channel_name: this.getChannelName(),
			nickname:     this.getNickname(),
			mode_change:  this.getModeChangeValuesForParameters(),
			// TODO: this
			mode_query:   null
		};
	}

	getModeChangeValuesForParameters() {
		var
			addition_changes   = this.getAdditionChanges(),
			removal_changes    = this.getRemovalChanges(),
			mode_change_values = [ ];

		if (addition_changes.length) {
			mode_change_values.push(
				this.getParameterValueForModeChangeSubset(addition_changes)
			);
		}

		if (removal_changes.length) {
			mode_change_values.push(
				this.getParameterValueForModeChangeSubset(removal_changes)
			);
		}

		return mode_change_values;

	}

	getParameterValueForModeChangeSubset(mode_changes) {
		var
			mode_action     = null,
			mode_chars      = [ ],
			mode_parameters = [ ];

		mode_changes.forEach(function each(mode_change) {
			mode_action = mode_change.getAction();
			mode_chars.push(mode_change.getMode());

			if (mode_change.hasParameters()) {
				mode_parameters = mode_parameters.concat(
					mode_change.getParameters()
				);
			}
		});

		return {
			mode_action: mode_action,
			mode_char:   mode_chars,
			mode_param:  mode_parameters
		};
	}

	getAdditionChanges() {
		return this.getModeChanges().filter(function filter(mode_change) {
			return mode_change.isAdditionAction();
		});
	}

	getRemovalChanges() {
		return this.getModeChanges().filter(function filter(mode_change) {
			return mode_change.isRemovalAction();
		});
	}

	setValuesFromParameters(parameters) {
		var
			nickname     = parameters.get('nickname'),
			channel_name = parameters.get('channel_name');

		if (nickname) {
			this.setNickname(nickname);
			this.setTargetType(Enum_TargetTypes.USER);
		} else if (channel_name) {
			this.setChannelName(channel_name);
			this.setTargetType(Enum_TargetTypes.CHANNEL);
		}

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
			mode_action = match.get('mode_action'),
			mode_chars  = match.getAll('mode_char'),
			mode_params = match.getAll('mode_param'),
			index       = 0;

		while (index < mode_chars.length) {
			let
				mode_change = new ModeChange(),
				mode_char   = mode_chars[index];

			if (this.isUserModeMessage()) {
				mode_change.setNickname(this.getNickname());
			} else if (this.isChannelModeMessage()) {
				mode_change.setChannelName(this.getChannelName());
			} else {
				throw new Error(
					'MODE command message did not have a valid target type'
				);
			}

			mode_change.setMode(mode_char);
			mode_change.setAction(mode_action);

			let
				parameter_type = mode_change.getParameterType(),
				mode_parameter = mode_params[0];

			if (
				   parameter_type !== Enum_ModeParameterTypes.NONE
				&& mode_parameter
			) {
				mode_change.addParameter(mode_parameter);
				mode_params.shift();
			}

			this.addModeChange(mode_change);

			index++;
		}

		while (mode_params.length) {
			this.getLastModeChange().addParameter(mode_params.shift());
		}

	}

	setModeChanges(mode_changes) {
		this.mode_changes = [ ];

		mode_changes.forEach(this.addModeChange, this);

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

	getLastModeChange() {
		var mode_changes = this.getModeChanges();

		return mode_changes[mode_changes.length - 1];
	}

	setTargetFromModeChange(mode_change) {
		if (!mode_change.hasNickname() && !mode_change.hasChannelName()) {
			return;
		}

		if (this.isUserModeMessage()) {
			this.setNickname(mode_change.getNickname());
		} else if (this.isChannelModeMessage()) {
			this.setChannelName(mode_change.getChannelName());
		}
	}

	/**
	 * @returns {boolean}
	 */
	isUserModeMessage() {
		return this.getTargetType() === Enum_TargetTypes.USER;
	}

	/**
	 * @returns {boolean}
	 */
	isChannelModeMessage() {
		return this.getTargetType() === Enum_TargetTypes.CHANNEL;
	}

	validateModeChange(mode_change) {
		var target_type = this.getTargetType();

		if (target_type !== mode_change.getTargetType()) {
			let actual_type = mode_change.getTargetType();

			throw new Error(`
				Mode change type mismatch;
				got ${actual_type}, expected ${target_type}
			`);
		}

		mode_change.validate();
	}

	addModeChange(mode_change) {
		this.validateModeChange(mode_change);
		this.setTargetFromModeChange(mode_change);

		add(mode_change).to(this.getModeChanges());

		return this;
	}

	validate() {
		this.getModeChanges().forEach(this.validateModeChange, this);
	}

	getTargetType() {
		return this.target_type;
	}

	setTargetType(target_type) {
		this.target_type = target_type;
		return this;
	}

	handleParameterParsingError(error) {
		if (
			   error instanceof Heket.InputTooShortError
			|| error instanceof Heket.NoMatchingAlternativeError
		) {
			let message = new Message_Reply_NeedMoreParameters();

			message.setAttemptedCommand(Enum_Commands.MODE);

			return this.setImmediateResponse(message);
		}

		if (error instanceof Error_InvalidUserMode) {
			let message = new Message_Reply_UserModeUnknownFlag();

			return this.setImmediateResponse(message);
		}
	}

	getPossibleReplies() {
		if (this.isUserModeMessage()) {
			return [
				Enum_Replies.ERR_NEEDMOREPARAMS,
				Enum_Replies.ERR_USERSDONTMATCH,
				Enum_Replies.ERR_UMODEUNKNOWNFLAG,
				Enum_Replies.RPL_UMODEIS
			];
		} else if (this.isChannelModeMessage()) {
			return [
				// Holy fucking shit.
				Enum_Replies.ERR_NEEDMOREPARAMS,
				Enum_Replies.ERR_KEYSET,
				Enum_Replies.ERR_NOCHANMODES,
				Enum_Replies.ERR_CHANOPRIVSNEEDED,
				Enum_Replies.ERR_USERNOTINCHANNEL,
				Enum_Replies.ERR_UNKNOWNMODE,
				Enum_Replies.RPL_CHANNELMODEIS,
				Enum_Replies.RPL_BANLIST,
				Enum_Replies.RPL_ENDOFBANLIST,
				Enum_Replies.RPL_EXCEPTLIST,
				Enum_Replies.RPL_ENDOFEXCEPTLIST,
				Enum_Replies.RPL_INVITELIST,
				Enum_Replies.RPL_ENDOFINVITELIST,
				Enum_Replies.RPL_UNIQOPIS
			];
		} else {
			throw new Error('Mode message did not have a valid target type');
		}
	}

}


extend(Message_Command_Mode.prototype, {
	command:      Enum_Commands.MODE,
	abnf:         '( <channel-name> / <nickname> ) ( *( " " <mode-change> ) / *<mode-query> )',
	mode_changes: null,
	channel_name: null,
	nickname:     null
});

module.exports = Message_Command_Mode;
