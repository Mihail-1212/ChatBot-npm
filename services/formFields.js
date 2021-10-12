function FormFieldsService(models) {
  this.models = models;
};

FormFieldsService.prototype.getAll = function() {
  return this.models.formFields.getAll();
}

FormFieldsService.prototype.getFormFields = function(formId) {
  return this.models.formFields.getFormFields(formId);
}


function createFormFieldsService(models) {
  return new FormFieldsService(models);
}


module.exports = createFormFieldsService;