const UrlHelper = {
  getBaseURL(request) {
    return request.protocol + '://' + request.get('host') + '/';
  },

  getCurrentUrl(request) {
    return this.getBaseURL(request) + request.originalUrl;
  }
}

module.exports = UrlHelper;