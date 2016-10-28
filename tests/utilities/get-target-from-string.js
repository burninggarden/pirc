
var
	getTargetFromString = req('/utilities/get-target-from-string'),
	ChannelDetails      = req('/lib/channel-details');


function getChannelTarget(test) {
	test.expect(1);

	var target = getTargetFromString('#ganondorf');

	test.ok(target instanceof ChannelDetails);
	test.done();
}

module.exports = {
	getChannelTarget
};
