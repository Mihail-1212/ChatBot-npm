
class Helper {

  constructor() {
    this.initPrototypeUpdates()
  }

  initPrototypeUpdates() {
    HTMLElement.prototype.clearNodeChild = function() {
      while (this.hasChildNodes()) {
        this.removeChild(this.lastChild);
      }
    } 

    HTMLElement.prototype.updateNodeChild = function(callback) {
      Array.from(this.children).forEach((item) => {
        callback(item, this)
      }) 
    }

    HTMLElement.prototype.scrollToBottom = function() {
      this.scrollBy({
        top: this.scrollHeight,
        behavior: 'smooth'
      })
    }
  }

  /**
   * Check firstNode is same node as secondNode or secondNode is parent of firstNode
   */
  isNodeOrParent(firstNode, secondNode) {
    return firstNode == secondNode || (firstNode.parentElement != null && this.isNodeOrParent(firstNode.parentElement, secondNode))
  }


  isNodeOrParentByClassName(dom, className) {
    if (dom.classList.contains(className)) {
      return dom
    }
    var parentBtn = dom.closest('.' + className)
    if (parentBtn) {
      return parentBtn
    }
    return undefined
  }
}

function createHelper() {
  return new Helper()
}

exports.default = { createHelper }
