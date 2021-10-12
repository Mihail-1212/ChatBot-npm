const TableNames = require("./modelConfig");

function AnswersModel(connection) {
  this.connection = connection;
}

AnswersModel.prototype.getAll = function() {
  return this.connection.any("SELECT * FROM "+ TableNames.answer);
}

AnswersModel.prototype.getAnswersOfQuestion = function({ id }) {
  return this.connection.any("SELECT * FROM "+ TableNames.answer + ' WHERE questionid=${id}', {
    id: id
  });
}

AnswersModel.prototype.getAnswerByIdAndQuestionId = function(answerId, questionId) {
  return this.connection.oneOrNone('SELECT * FROM '+ TableNames.answer +' WHERE questionid=${questionId} AND id=${id}', {
    questionId: questionId,
    id: answerId,
  });
}


function createAnswersModel(connection) {
  return new AnswersModel(connection);
}

module.exports = createAnswersModel;