const TableNames = require("./modelConfig");

function FormFieldsModel(connection) {
  this.connection = connection;
}

FormFieldsModel.prototype.getAll = function() {
  return this.connection.any("SELECT * FROM " + TableNames.formField);
}

FormFieldsModel.prototype.getFormFields = function(formId) {
  return this.connection.many("SELECT * FROM " + TableNames.formField + ' WHERE formid=${formid}', {
    formid: formId
  });
}

function createFormFieldsModel(connection) {
  return new FormFieldsModel(connection);
}

module.exports = createFormFieldsModel;
