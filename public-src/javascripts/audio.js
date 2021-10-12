class Audio {
  constructor(element) {
    this.element = element
  }

  playAudioSend() {
    this.playAudio(this.getAudioSend())
  }

  playAudioReceive() {
    this.playAudio(this.getAudioReceive())
  }

  playAudio(audioElement) {
    audioElement.pause()
    audioElement.currentTime = 0
    audioElement.play()
  }

  getAudioSend() {
    return this.element.querySelector('#chat-message-send')
  }

  getAudioReceive() {
    return this.element.querySelector('#chat-message-receive')
  }
}

function createAudio(element) {
  return new Audio(element)
}

exports.default = { createAudio }