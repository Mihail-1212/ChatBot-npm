function Models() {

  const dbConnection = require("./dbconnection");

  this.answers = require("./answers")(dbConnection);
  this.questions = require("./questions")(dbConnection);
  this.forms = require("./forms")(dbConnection);
  this.formFields = require("./formFields")(dbConnection);
}

function createModels() {
  return new Models();
}

module.exports = createModels;