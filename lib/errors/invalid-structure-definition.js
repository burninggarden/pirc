
var
	extend     = req('/utilities/extend'),
	BaseError  = req('/lib/errors/base'),
	ErrorCodes = req('/lib/constants/error-codes');

class InvalidStructureDefinitionError extends BaseError {

	getBody() {
		var serialized_structure = JSON.stringify(this.value);

		return 'Invalid structure definition: ' + serialized_structure;
	}

}

extend(InvalidStructureDefinitionError.prototype, {
	code:   ErrorCodes.INVALID_STRUCTURE_DEFINITION,
	reason: false
});

module.exports = InvalidStructureDefinitionError;
