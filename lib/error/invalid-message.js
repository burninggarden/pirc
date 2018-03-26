
var
	extend = require('../utility/extend');


class Error_InvalidMessage extends Error {

	/**
	 * @param   {string} raw_message
	 * @returns {self}
	 */
	setRawMessage(raw_message) {
		this.raw_message = raw_message;
		return this;
	}

	/**
	 * @returns {string}
	 */
	getRawMessage() {
		return this.raw_message;
	}

}

extend(Error_InvalidMessage.prototype, {
	raw_message: null
});


module.exports = Error_InvalidMessage;
