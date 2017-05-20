var
	extend = req('/lib/utilities/extend');


class ServiceDetails {

	setName(name) {
		this.name = name;
	}

	getName() {
		return this.name;
	}

	getTargetString() {
		return this.getName();
	}

}

extend(ServiceDetails.prototype, {

	name: null

});

ServiceDetails.fromName = function fromName(name) {
	var details = new ServiceDetails();

	details.setName(name);

	return details;
};

module.exports = ServiceDetails;
