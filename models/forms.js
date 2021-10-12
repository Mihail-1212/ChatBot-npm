const TableNames = require("./modelConfig");

function FormsModel(connection) {
  this.connection = connection;
}

FormsModel.prototype.getAll = function() {
  return this.connection.any("SELECT * FROM " + TableNames.form);
}

FormsModel.prototype.getQuestionForm = function(questionId) {
  return this.connection.oneOrNone("SELECT * FROM " + TableNames.form + ' WHERE questionid=${questionid}', {
    questionid: questionId
  });
}


function createFormsModel(connection) {
  return new FormsModel(connection);
}

module.exports = createFormsModel;
