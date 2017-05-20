
var
	TimeIntervals = req('/lib/constants/time-intervals');

function getCurrentTimestamp() {
	return Math.floor(Date.now() / TimeIntervals.ONE_SECOND);
}

module.exports = getCurrentTimestamp;
