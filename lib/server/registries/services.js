
var
	add    = req('/utilities/add'),
	extend = req('/utilities/extend');


class ServiceRegistry {

	constructor() {
		this.services = [ ];
	}

	addService(service) {
		add(service).to(this.services);
	}

	getServiceByType(service_type) {
		var index = 0;

		while (index < this.services.length) {
			let service = this.services[index];

			if (service.getType() === service_type) {
				return service;
			}

			index++;
		}

		return null;
	}

}

extend(ServiceRegistry.prototype, {

	services: null

});

module.exports = ServiceRegistry;
