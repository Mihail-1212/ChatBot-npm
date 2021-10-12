var express = require('express');

const urlHelper = require("../helpers/urlHelper");

/* GET home pages. */
function initIndexRoutes(routes) {
  var router = express.Router();
  var services = routes.services;

  router.get('/', getIndexPage(services));

  return router;
}

function getIndexPage(services) {
  return function(req, res, next) {
    res.render('index', { 
      title: 'Express',
      baseURL: urlHelper.getBaseURL(req)
    });
  };
}


module.exports = initIndexRoutes;
