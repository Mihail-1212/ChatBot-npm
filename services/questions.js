function QuestionsService(models) {
  this.models = models;
};

QuestionsService.prototype.getAll = function() {
  return this.models.questions.getAll();
}

QuestionsService.prototype.createQuestion = function({ text }) {
  return this.models.questions.createQuestion({ text });
}

QuestionsService.prototype.getInitialQuestion = function() {
  return this.models.questions.getInitialQuestion();
}

QuestionsService.prototype.getQuestionById = function({ id }) {
  return this.models.questions.getQuestionById({ id: id });
}

// Return promise
QuestionsService.prototype.getNextQuestion = async function(answerId, questionId) {
  var nextQuestionId = (await this.models.answers.getAnswerByIdAndQuestionId(answerId, questionId)).nextquestionid;
  return await this.models.questions.getQuestionById({ id: nextQuestionId });
}

function createQuestionsService(models) {
  return new QuestionsService(models);
}


module.exports = createQuestionsService;