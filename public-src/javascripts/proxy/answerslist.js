var fnObj = {
  addAnswerButton: null,
}

const answerListProxyHandler = {
  /* Push, etc methods */
  set (target, property, value) {
    // Call add message function if property is number
    if (!isNaN(property)) {
      fnObj.addAnswerButton != null && fnObj.addAnswerButton(value, property)
    }

    target[property] = value

    return true
  },

  /* Splice etc */
  deleteProperty: function(target, property) {
    console.log("Deleted %s", property);
    return true;
  },

}

function createNewAnswerListProxy(target, { addAnswerButton }) {
  fnObj.addAnswerButton = addAnswerButton
  // fnObj.addMessage = addMessage
  return new Proxy(target, answerListProxyHandler)
}

exports.default = { createNewAnswerListProxy }