const axios = require ('axios');

// Require config URL object
const URL = require("./config");

function DataSource() {

}

DataSource.prototype.getInitialChatBotResponse = function(cb) {
  axios.get(URL.fullURLChatApi + "/initial").then(response => {
    cb(response.data.chatBotMessage);
  }).catch(err => {
    console.error(err);
    cb(null);
  });
}

DataSource.prototype.sendChatBotRequest = function(request, cb) {
  axios.post(URL.fullURLChatApi + "/send-answer", request).then(response => {
    console.log(response);
    cb(response.data.chatBotMessage);
  }).catch(err => {
    console.error(err);
    cb(null);
  });
}

function createDataSource() {
  return new DataSource()
}


exports.default = { createDataSource }