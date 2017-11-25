
var
	Enum_TimeIntervals = req('/lib/enum/time-intervals');

function getCurrentTimestamp() {
	return Math.floor(Date.now() / Enum_TimeIntervals.ONE_SECOND);
}

module.exports = getCurrentTimestamp;
