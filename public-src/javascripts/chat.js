const { createHelper } = require("./helper").default;
const { createAudio } = require("./audio").default;
const { createDataSource } = require("./datasource").default;
const { createNewMessageListProxy } = require("./proxy/messageslist").default;
const { createNewAnswerListProxy } = require("./proxy/answerslist").default;

(function(w, d) {
  "use strict";

  /// ================================
  //  JoomlaChat object requirements
  /// ================================

  const JoomlaChat = function(element, options) {
    this.element = element
    this.options = options

    // Helper initial
    this.helper = createHelper()

    // Audio initial
    this.audio = createAudio(this.element)

    // DataSource initial
    this.dataSource = createDataSource()

    // Elements initial
    this.previewChatButton = null
    this.chatBlock = null

    this.chatEvent = new ChatEvent(this)

    // Data initial
    this.messages = []
    this.messagesProxy = createNewMessageListProxy(this.messages, {
      addMessage: this.addMessage.bind(this),
    })

    this.avaibleAnswers = []
    
    this.answers = []
    this.answersProxy = createNewAnswerListProxy(this.answers, { 
      addAnswerButton: this.addAnswerButton.bind(this),
    })

    this.maxBtnAnswer = 4
    // Init current answer page
    this.numAnswerPage = 1

    // Call init method
    this.init()
  }

  /**
   * Chat base initital func
   */
  JoomlaChat.prototype.init = function() {
    // Build UI
    this.buildUI()

    // Register handlers
    this.registerHandlers()

    // Fill with data
    this.dataFill()
  }

  /**
   * Main build ui method
   */
  JoomlaChat.prototype.buildUI = function() {
    // Preview chat block button
    this.buildPreviewChatButton()
    // Chat block
    this.buildChatBlock()
  }

  /**
   * Main register handlers method
   */
  JoomlaChat.prototype.registerHandlers = function() {
    this.element.addEventListener("click", this.clickHandler.bind(this))
  }

  /// ================================
  //  Build methods
  /// ================================

  JoomlaChat.prototype.buildPreviewChatButton = function() {
    // Set previewChatButton var
    this.previewChatButton = this.element.querySelector(this.options.selectors.prevChatButton)
    // On initial ".i-active" div have "hide" class
    this.previewChatButton.querySelector(".i-active").classList.add("hide")
  }

  JoomlaChat.prototype.buildChatBlock = function() {
    // Set chatBlock var
    this.chatBlock = this.element.querySelector(this.options.selectors.chatBlock)
    this.chatBlock.classList.add("hide")

    this.chatMessagesWrapper = this.element.querySelector(this.options.selectors.chatMessageWrapper)

    this.chatMessagesBody = this.chatMessagesWrapper.querySelector(this.options.selectors.chatMessageBody)

    this.actionsMainBody = this.element.querySelector(this.options.selectors.actionsMainBody)

    this.answerBtnGroup = this.element.querySelector(this.options.selectors.answerButtonGroup)

    this.btnAnswerPrev = this.element.querySelector(this.options.selectors.btnAnswerPrev)
    this.btnAnswerNext = this.element.querySelector(this.options.selectors.btnAnswerNext)

    this.blockAnswerNumPage = this.element.querySelector(this.options.selectors.blockAnswerNumPage)
  }

  /// ================================
  //  Chat event handlers
  /// ================================

  const ChatEvent = function(joomlaChat) {
    this.joomlaChat = joomlaChat
  }

  ChatEvent.prototype.dataFilling = function() {

  }

  ChatEvent.prototype.dataFilled = function() {
      // Set Messages wrapper scroll to bottom
      this.joomlaChat.chatMessagesWrapper.scrollTop = this.joomlaChat.chatMessagesWrapper.scrollHeight
  }

  /// ================================
  //  Submit events
  /// ================================

  JoomlaChat.prototype.submitFormPrevent = function(event) {
    // Stop submit event
    event.preventDefault();

    var form = event.target,
      formData = new FormData(form);

  }

  /// ================================
  //  Getters/Setters
  /// ================================

  Object.defineProperty(JoomlaChat.prototype, "avaibleAnswersProperty", {
    get() {
      return this.avaibleAnswers
    },
    set(value) {
      this.avaibleAnswers = value

      // Set page number to first 
      this.numAnswerPage = 1
      // Render buttons and page number text
      this.renderBtnAnswersPaginator()
    }
  })

  Object.defineProperty(JoomlaChat.prototype, "maxNumberPage", {
    get: function maxNumberPage() {
      return Math.ceil(this.avaibleAnswersProperty.length / this.maxBtnAnswer)
    },
  });

  /// ================================
  //  Data fill methods
  /// ================================

  JoomlaChat.prototype.addChatBotResponse = function(response) {
    // Set response author type
    response.author = "chatbot";
    // Add message to message list
    this.messagesProxy.push(response);
    // Set answers
    this.avaibleAnswersProperty = response.answers;
    // Set last question id
    this.lastQuestionId = response.id;
  }

  JoomlaChat.prototype.dataFill = function() {
    // Call event
    this.chatEvent.dataFilling()

    // Отображение начального сообщения и получение кнопок для ответа
    this.dataSource.getInitialChatBotResponse(response => {
      this.addChatBotResponse(response);
    });

    this.renderBtnAnswersPaginator()

    // Call event
    this.chatEvent.dataFilled()
  }

  JoomlaChat.prototype.renderBtnAnswersPaginator = function() {
    this.renderAnswersBtnListAndPageNumber()

    this.setBtnAnswersDisabling()
  }

  JoomlaChat.prototype.renderAnswersBtnListAndPageNumber = function() {
    const { startIndex, endIndex } = this.renderAnswersBtnList()
    this.setBlockAnswerPageNumberText(startIndex, endIndex)
    return {
      startIndex, endIndex
    }
  }

  JoomlaChat.prototype.renderAnswersBtnList = function() {
    var endIndex = this.numAnswerPage * this.maxBtnAnswer,
      startIndex = endIndex - this.maxBtnAnswer,
      answerList = this.avaibleAnswersProperty.slice(startIndex, endIndex)

    this.answersProxy.length = 0
    this.answerBtnGroup.clearNodeChild()

    this.answersProxy.push(...answerList)

    return {
      startIndex,
      endIndex
    }
  }

  JoomlaChat.prototype.addAndSendUserMessage = function(answerId, message, options) {
    // Render message
    this.messagesProxy.push({
      text: message,
      date: new Date(),
      type: "message",
      author: "user",
    })
    // Send message
    var request = {
      answerId: answerId,
      questionId: this.lastQuestionId
    };
    this.dataSource.sendChatBotRequest(request, response => {
      if (response != null) {
        // Play audio
        this.audio.playAudioSend();
        // Render new answers
        this.addChatBotResponse(response);
        // Scroll to bottom
        this.chatMessagesWrapper.scrollToBottom()
      }
    });
  }

  /**
   * Add render message
   * @param {*} messageObj 
   * @param INT listPosition 
   */
  JoomlaChat.prototype.addMessage = function(messageObj, listPosition=0) {
    // Add message method
    var messageUIGroup = this.createMessageUI(messageObj)

    // Append dom message to div
    this.appendMessageUI(messageUIGroup)
  }

  JoomlaChat.prototype.addAnswerButton = function(answerObj, listPosition) {
    var answerBtnUI = this.createAnswerBtnUI(answerObj)

    this.appendAnswerBtnUI(answerBtnUI)
  }

  /// ================================
  //  Click handlers
  /// ================================

  /**
   * Main click handler
   * @param {Object} event 
   */
  JoomlaChat.prototype.clickHandler = function(event) {
    var target = event.target

    if (this.helper.isNodeOrParent(target, this.previewChatButton)) {
      this.previewChatButtonClickHandler(event)
    }
    if (this.helper.isNodeOrParent(target, this.chatBlock)) {
      this.chatBlockClickHandler(event)
    }
  }

  JoomlaChat.prototype.previewChatButtonClickHandler = function(event) {
    this.previewChatButtonIconToggle()

    this.chatBlockVisibilityToggle()
  }

  JoomlaChat.prototype.chatBlockClickHandler = function(event) {
    var target = event.target

    if (this.helper.isNodeOrParent(target, this.answerBtnGroup)) {
      this.answerBtnGroupCickHandler(event)
    }

    if (this.helper.isNodeOrParent(target, this.btnAnswerPrev)) {
      this.btnAnswerPrevClickHandler(event)
    }
    if (this.helper.isNodeOrParent(target, this.btnAnswerNext)) {
      this.btnAnswerNextClickHandler(event)
    }
  }

  JoomlaChat.prototype.btnAnswerPrevClickHandler = function(event) {
    var maxNumPage = this.maxNumberPage

    if (this.numAnswerPage <= 1) {
      console.error("Ошибка! Дальше нельзя!")
    } else {
      this.numAnswerPage--

      this.renderBtnAnswersPaginator()
    }
  }

  JoomlaChat.prototype.btnAnswerNextClickHandler = function(event) {
    var maxNumPage = this.maxNumberPage

    if (this.numAnswerPage >= maxNumPage ) {
      console.error("Ошибка! Дальше нельзя!")
    } else {
      this.numAnswerPage++

      this.renderBtnAnswersPaginator()
    }
  }

  JoomlaChat.prototype.setBlockAnswerPageNumberText = function(startIndex, endIndex) {
    this.blockAnswerNumPage.innerText = `${startIndex+1}-${Math.min(endIndex, this.avaibleAnswersProperty.length)} из ${this.avaibleAnswersProperty.length}`
  }

  JoomlaChat.prototype.answerBtnGroupCickHandler = function(event) {
    let target = event.target,
      button = this.helper.isNodeOrParentByClassName(target, 'button')

    if (button) {
      // Get id
      var id = button.dataset.answerId;
      // Get text
      var text = button.querySelector('span').innerText

      if (text) {
        this.addAndSendUserMessage(id, text)
      }
      this.chatMessagesWrapper.scrollToBottom()
    }
  }

  /// ================================
  //  Input event handlers
  /// ================================

  JoomlaChat.prototype.inputBlur = function(e) {
    const target = e.target
    
    let inputIconValidity = target.parentNode.getElementsByClassName('input__icon__validity')[0]
    if (!target.checkValidity()) {
      inputIconValidity.classList.add('error')
    }
  }

  JoomlaChat.prototype.inputChanged = function(e) {
    const target = e.target

    let inputIconValidity = target.parentNode.getElementsByClassName('input__icon__validity')[0],
      form = target.closest('form'),
      submitButton = form.querySelector('button[type=submit], input[type=submit]')

    inputIconValidity.classList.remove('success')
    inputIconValidity.classList.remove('error')

    submitButton.disabled = false

    if (target.checkValidity()) {
      inputIconValidity.classList.add('success')
    } else {
      submitButton.disabled = true
    }
  }

  /// ================================
  //  Low-level methods
  /// ================================
  /// Work with html, css and etc

  JoomlaChat.prototype.disableAnswBtnGroup = function() {
    this.answerBtnGroup.updateNodeChild((element) => {
      element.setAttribute("disabled", "disabled")
    })

    this.actionsMainBody.classList.add("load")

    this.disableBtnAnswerPrev()

    this.disableBtnAnswerNext()
  }

  JoomlaChat.prototype.enableAnswBtnGroup = function() {
    this.answerBtnGroup.updateNodeChild((element) => {
      element.removeAttribute("disabled", "disabled")
    })

    this.actionsMainBody.classList.remove("load")

    this.setBtnAnswersDisabling()
  }

  JoomlaChat.prototype.setBtnAnswersDisabling = function() {
    var maxNumPage = this.maxNumberPage

    this.btnAnswerNext.classList.remove('disabled')
    this.btnAnswerPrev.classList.remove('disabled')

    if (this.numAnswerPage <= 1) {
      this.disableBtnAnswerPrev()
    }
    
    if (this.numAnswerPage >= maxNumPage) {
      this.disableBtnAnswerNext()
    }
  }

  JoomlaChat.prototype.disableBtnAnswerPrev = function() {
    this.btnAnswerPrev.classList.add('disabled')
  }

  JoomlaChat.prototype.disableBtnAnswerNext = function() {
    this.btnAnswerNext.classList.add('disabled')
  }

  JoomlaChat.prototype.previewChatButtonIconToggle = function() {
    let deactiveIcon = this.previewChatButton.querySelector('.i-deactive'),
      activeIcon = this.previewChatButton.querySelector('.i-active')

    deactiveIcon.classList.toggle('hide')
    activeIcon.classList.toggle('hide')
  }

  JoomlaChat.prototype.chatBlockVisibilityToggle = function() {
    this.chatBlock.classList.toggle('hide')
  }

  JoomlaChat.prototype.createAnswerBtnUI = function(answerObj) {
    // <button class="button"><span>Привет</span></button>
    var button = d.createElement('button')

    button.classList.add('button')

    button.dataset.answerId = answerObj.id;

    var span = d.createElement('span')

    span.innerText = answerObj.text

    button.append(span)

    return button
  }

  JoomlaChat.prototype.appendAnswerBtnUI = function(answerBtnUI) {
    this.answerBtnGroup.append(answerBtnUI)
  }

  JoomlaChat.prototype.createMessageUI = function(messageObj) {
    var messages = [],
      messageUI = d.createElement("DIV")
    messageUI.classList.add("message")
    messageUI.innerText = messageObj.text

    var authorClassName = this.getAuthorClassName(messageObj)
    authorClassName != "" ? messageUI.classList.add(authorClassName) : null

    messageUI.classList.add(...this.getAdditiveGroupClassNames(messageObj))

    messages.push(messageUI)

    // TODO: show date - mb render?

    // Render form
    if (messageObj.form != null) {
      var labelFieldList = [];

      messageObj.form.fields.forEach(field => {
        var {name, type, required, placeholder} = field

        var label = d.createElement("LABEL")
        label.classList.add("input")

        var icon = d.createElement("I")
        icon.classList.add("input__icon__validity")
        label.append(icon)

        var input = d.createElement("INPUT")
        input.classList.add("input__field")
        input.name = name
        input.type = type
        if (required) {
          input.setAttribute("required", "required")
        }
        input.placeholder = " "
        input.addEventListener("input", this.inputChanged.bind(this))
        input.addEventListener("blur", this, this.inputBlur.bind(this))
        label.append(input)

        var span = d.createElement("SPAN")
        span.classList.add("input__label")
        span.innerText = placeholder
        label.append(span)

        labelFieldList.push(label)
      });

      var form = d.createElement("FORM")
      form.append(...labelFieldList);
      
      form.addEventListener('submit', this.submitFormPrevent.bind(this));

      var formButton = d.createElement("BUTTON")
      formButton.type = "submit"
      
      var formButtonSpan = d.createElement("SPAN")
      formButtonSpan.classList.add("submit-inner-span")
      formButtonSpan.innerText = "Отправить"
      // On button initial - disable button
      formButton.disabled = true

      formButton.append(formButtonSpan)

      form.append(formButton)

      var formDiv = d.createElement("DIV")
      formDiv.classList.add(...["message", "message__form"])

      var additiveGroupClassNames = this.getAdditiveGroupClassNames(messageObj)

      if (messages.length != 0) {
        var index = additiveGroupClassNames.indexOf("is-first")
        if (index !== -1) {
          additiveGroupClassNames.splice(index, 1);
        }
      }

      formDiv.classList.add(...additiveGroupClassNames)

      formDiv.append(form)

      messages.push(formDiv)
    }

    return messages
  }

  JoomlaChat.prototype.appendMessageUI = function(messageUIGroup) {
    // Append to main message
    this.chatMessagesBody.append(...messageUIGroup)
  }
  
  JoomlaChat.prototype.getAdditiveGroupClassNames = function(messageObj) {
    var classNames = [],
      lastMessage = this.messagesProxy.at(-1)
    classNames.push("is-group")

    // If new message is first in new group
    if (lastMessage && lastMessage.author != messageObj.author) {
      classNames.push("is-first")
    }

    return classNames
  }

  JoomlaChat.prototype.getAuthorClassName = function(messageObj) {
    switch(messageObj.author) {
      case "chatbot":
        return "chatbot-message"
      case "user":
        return "self-message"
    }
    return ""
  }

  /// ================================
  //  Document load requirements
  /// ================================

  function newJoomlaChatFromElementOptions(elementChat, options) {
    return new JoomlaChat(elementChat, options)
  }

  const documentLoad = function(event) {
    var elementChat = d.querySelector(".joomla-chat");
    if (elementChat == undefined) {
      throw new Error("Joomla chat block does not find!")
    }

    var options = {
      selectors: {
        prevChatButton: ".preview-chat",
        chatBlock: ".chat",

        chatMessageWrapper: ".chat-messages",
        chatMessageBody: ".chat-messages-body",

        answerButtonGroup: ".answer-button-group",

        audioSend: "#chat-message-send",
        audioReceive: "#chat-message-receive",

        actionsMainBody: ".chat-actions",

        btnAnswerPrev: "#button-prev-actions",
        btnAnswerNext: "#button-next-actions",
        blockAnswerNumPage: "#block-answers-page",
      },
    }

    let joomlaChat = newJoomlaChatFromElementOptions(elementChat, options)
  }
  
  document.addEventListener('DOMContentLoaded', documentLoad)
})(window, document)