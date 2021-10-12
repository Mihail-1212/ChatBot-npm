var fnObj = {
  addMessage: null,
}

const messageListProxyHandler = {
  /* Push, etc methods */
  set (target, property, value) {
    // Call add message function if property is number
    if (!isNaN(property)) {
      fnObj.addMessage != null && fnObj.addMessage(value, property)
    }

    target[property] = value

    return true
  }
}

function createNewMessageListProxy(target, { addMessage }) {
  fnObj.addMessage = addMessage
  return new Proxy(target, messageListProxyHandler)
}

exports.default = { createNewMessageListProxy }