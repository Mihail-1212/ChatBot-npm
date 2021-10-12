function AnswersService(models) {
  this.models = models;
};

AnswersService.prototype.getAll = function() {
  return this.models.answers.getAll();
}

AnswersService.prototype.getAnswersOfQuestion = function({ id }) {
  return this.models.answers.getAnswersOfQuestion({ id: id });
}

AnswersService.prototype.getAnswerByIdAndQuestionId = function(answerId, questionId) {
  return this.models.answers.getAnswerByIdAndQuestionId(answerId, questionId); 
}

function createAnswersService(models) {
  return new AnswersService(models);
}


module.exports = createAnswersService;