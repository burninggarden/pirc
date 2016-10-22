
var
	getTargetFromString = req('/utilities/get-target-from-string'),
	ChannelTarget       = req('/lib/targets/channel');


function getChannelTarget(test) {
	test.expect(1);

	var target = getTargetFromString('#ganondorf');

	test.ok(target instanceof ChannelTarget);
	test.done();
}

module.exports = {
	getChannelTarget
};
