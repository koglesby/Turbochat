import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  initialize() {
    this.resetScrollWithoutThreshold(messages);
  }

  connect() {
    console.log('connected');
    const messages = document.getElementById('messages');
    messages.addEventListener('DOMNodeInserted', this.resetScroll);
    this.resetScroll(messages);
  }

  disconnect() {
    console.log('disconnected');
  }

  // custom function (not from stimulus)
  resetScroll() {
    const bottomOfScroll = messages.scrollHeight - messages.clientHeight;
    const upperScrollThreshold = bottomOfScroll - 500;
    // Scroll down if not withing the threshold
    if (messages.scrollTop > upperScrollThreshold) {
      messages.scrollTop = messages.scrollHeight - messages.clientHeight;
    }
  }

  resetScrollWithoutThreshold(messages) {
    messages.scrollTop = messages.scrollHeight - messages.clientHeight;
  }
}
