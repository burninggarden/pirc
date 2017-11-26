
var has = require('./has');

function remove(value) {

	function from(array) {
		if (has(array, value)) {
			array.splice(array.indexOf(value), 1);
			return true;
		} else {
			return false;
		}
	}

	return {
		from: from
	};
}

module.exports = remove;
