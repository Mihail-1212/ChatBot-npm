/* Config file */
const URL = {
  urlProtocol: "http",
  domain: "127.0.0.1",
  port: "3000",

  chatApi: "chat-api",

  get fullURL() {
    return this.urlProtocol + "://" +  this.domain + ":" + this.port;
  },

  get fullURLChatApi() {
    return this.fullURL + "/" + this.chatApi; 
  },
};

module.exports = URL;