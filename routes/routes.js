var express = require('express');

const initIndexRoutes = require("./index"),
  initChatApiRoutes = require("./chat-api");

function Routes(services) {
  this.services = services;
}

Routes.prototype.initRoutes = function() {
  router = express.Router();

  router.use('/', initIndexRoutes(this));
  router.use('/chat-api', initChatApiRoutes(this));

  return router;
}

function createNewRoutes(services) {
  return new Routes(services);
}

module.exports = createNewRoutes; 