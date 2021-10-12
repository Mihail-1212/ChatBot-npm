function Services(models) {
  this.models = models;

  this.answers = require("./answers")(models);
  this.questions = require("./questions")(models);
  this.forms = require("./forms")(models);
  this.formFields = require("./formFields")(models);
}

function createServices(models) {
  return new Services(models);
}

// const models = require("../models/models");

module.exports = createServices;