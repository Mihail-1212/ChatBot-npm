function FormsService(models) {
  this.models = models;
};

FormsService.prototype.getAll = function() {
  return this.models.forms.getAll();
}

FormsService.prototype.getQuestionForm = function(questionId) {
  return this.models.forms.getQuestionForm(questionId);
}

function createFormsService(models) {
  return new FormsService(models);
}


module.exports = createFormsService;