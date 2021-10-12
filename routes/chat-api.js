const express = require('express'),
  jsonParser = express.json();

const ObjectHelper = require('../helpers/objectHelper');


function initChatApiRoutes(routes) {
  var router = express.Router();
  var services = routes.services;

  router.get('/initial', getInitialData(services));

  router.post('/send-answer', jsonParser, sendAnswerChat(services));

  // router.get('/answers', getAnswerList(services));

  // router.get('/questions', getQuestionList(services));

  // router.get('/forms', getFormList(services));

  // router.get('/form-fields', getFormFieldList(services));

  return router;
}


function getInitialData(services) {
  return async function(req, res, next) {
    try {
      var initialQuestion = await services.questions.getInitialQuestion();
      initialQuestion.answers = await services.answers.getAnswersOfQuestion({ id: initialQuestion.id });

      var response = {
        chatBotMessage: initialQuestion
      };

      return res.send(response);
    } catch(err) {
      return res.send(err);
    }
  };
}

const ChatBotRequest = {
  answerId: null,
  questionId: null,
}

function sendAnswerChat(services) {
  return async function(req, res, next) {
    var body = req.body;

    if (!body || !ObjectHelper.ObjectKeysIncludedInSecondObjectKeys(ChatBotRequest, body)) {
      return res.sendStatus(400);
    }

    var answerId = body.answerId,
      questionId = body.questionId;
    
    try {

      var nextQuestion = await services.questions.getNextQuestion(answerId, questionId);
      nextQuestion.answers = await services.answers.getAnswersOfQuestion({ id: nextQuestion.id });
      nextQuestion.form = await services.forms.getQuestionForm(nextQuestion.id);
      if (nextQuestion.form != null) {
        nextQuestion.form.fields = await services.formFields.getFormFields(nextQuestion.form.id);
      }

      var response = {
        chatBotMessage: nextQuestion
      };

      return res.send(response);
    } catch(err) {
      return res.send(err);
    }
  };
}


function getAnswerList(services) {
  return function(req, res, next) {
    services.answers.getAll().then(answers => {
      return res.send(answers);
    }).catch(err => {
      return res.sendStatus(500);
    })
  };
}


function getQuestionList(services) {
  return function(req, res, next) {
    services.questions.getAll().then(answers => {
      return res.send(answers);
    }).catch(err => {
      return res.sendStatus(500);
    })
  };
}

function getFormList(services) {
  return function(req, res, next) {
    services.forms.getAll().then(answers => {
      return res.send(answers);
    }).catch(err => {
      return res.sendStatus(500);
    })
  };
}


function getFormFieldList(services) {
  return function(req, res, next) {
    services.formFields.getAll().then(answers => {
      return res.send(answers);
    }).catch(err => {
      return res.sendStatus(500);
    })
  };
}

module.exports = initChatApiRoutes;