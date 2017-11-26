
var
	Enum_TimeIntervals = require('../enum/time-intervals');

function getCurrentTimestamp() {
	return Math.floor(Date.now() / Enum_TimeIntervals.ONE_SECOND);
}

module.exports = getCurrentTimestamp;
