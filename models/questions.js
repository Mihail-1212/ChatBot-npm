const TableNames = require("./modelConfig");

function QuestionsModel(connection) {
  this.connection = connection;
}

QuestionsModel.prototype.getAll = function() {
  return this.connection.any("SELECT * FROM " + TableNames.question);
}

QuestionsModel.prototype.getInitialQuestion = function() {
  return this.connection.one("SELECT * FROM " + TableNames.question + ' WHERE "isFirst"=True');
}

QuestionsModel.prototype.getQuestionById = function({ id }) {
  return this.connection.one("SELECT * FROM " + TableNames.question + ' WHERE id=${id}', {
    id: id
  });
}

QuestionsModel.prototype.getNextQuestion = function(answerId, questionId) {
  return this.connection.one("SELECT * FROM " + TableNames.question + ' WHERE "isFirst"=True');
}

QuestionsModel.prototype.createQuestion = function({ text }) {
  return this.connection.none('INSERT INTO ' + TableNames.question + '(text) VALUES (${text})', {
    text: text
  });
}


function createQuestionsModel(connection) {
  return new QuestionsModel(connection);
}


module.exports = createQuestionsModel;