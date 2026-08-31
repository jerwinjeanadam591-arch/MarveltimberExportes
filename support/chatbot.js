// Marvel AI Chatbot - $0 Cost Implementation
// Pure JavaScript, no backend, no APIs required

class MarvelChatbot {
  constructor() {
    this.knowledgeBase = [];
    this.conversationHistory = [];
    this.isOpen = false;
    this.initChat();
  }

  async initChat() {
    // Load knowledge base
    try {
      const response = await fetch('/support/knowledge-base.json');
      this.knowledgeBase = await response.json();
    } catch (e) {
      console.log('Knowledge base loaded from inline fallback');
      this.knowledgeBase = { faq: [] };
    }

    // Create UI
    this.createChatUI();
    this.attachEventListeners();
    this.loadChatHistory();
  }

  createChatUI() {
    // Chat widget container
    const widget = document.createElement('div');
    widget.id = 'marvel-chat-widget';
    widget.className = 'marvel-chat-widget';
    widget.innerHTML = `
      <div class="marvel-chat-header" id="marvel-chat-header">
        <div class="marvel-chat-title">
          <span class="marvel-chat-icon">💬</span>
          <span class="marvel-chat-name">Marvel Support</span>
        </div>
        <button id="marvel-chat-toggle" class="marvel-chat-toggle" aria-label="Toggle chat">
          <span class="marvel-chat-close">✕</span>
        </button>
      </div>
      
      <div class="marvel-chat-body" id="marvel-chat-body">
        <div class="marvel-chat-messages" id="marvel-chat-messages">
          <div class="marvel-chat-message bot">
            <div class="marvel-chat-bubble">
              Hello! 👋 I'm Marvel's AI Assistant. Ask me about our timber products, agro commodities, services, or anything else. How can I help?
            </div>
          </div>
        </div>
        
        <div class="marvel-chat-input-area">
          <input 
            type="text" 
            id="marvel-chat-input" 
            class="marvel-chat-input" 
            placeholder="Type your question..."
            autocomplete="off"
          />
          <button id="marvel-chat-send" class="marvel-chat-send" aria-label="Send message">
            <span>→</span>
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(widget);
  }

  attachEventListeners() {
    const toggleBtn = document.getElementById('marvel-chat-toggle');
    const sendBtn = document.getElementById('marvel-chat-send');
    const input = document.getElementById('marvel-chat-input');
    const header = document.getElementById('marvel-chat-header');

    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleChat();
    });
    header.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleChat();
    });
    
    sendBtn.addEventListener('click', () => this.sendMessage());
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.sendMessage();
    });

    // Click outside to close
    document.addEventListener('click', (e) => {
      const widget = document.getElementById('marvel-chat-widget');
      if (widget && !widget.contains(e.target) && this.isOpen) {
        this.toggleChat();
      }
    });
  }

  toggleChat() {
    const widget = document.getElementById('marvel-chat-widget');
    this.isOpen = !this.isOpen;
    widget.classList.toggle('open', this.isOpen);
    
    if (this.isOpen) {
      document.getElementById('marvel-chat-input').focus();
    }
  }

  sendMessage() {
    const input = document.getElementById('marvel-chat-input');
    const message = input.value.trim();

    if (!message) return;

    // Add user message
    this.addMessageToUI(message, 'user');
    input.value = '';

    // Save to history
    this.conversationHistory.push({ role: 'user', content: message });
    this.saveToLocalStorage();

    // Get AI response (with small delay for natural feel)
    setTimeout(() => {
      const response = this.getResponse(message);
      this.addMessageToUI(response, 'bot');
      this.conversationHistory.push({ role: 'bot', content: response });
      this.saveToLocalStorage();
    }, 300);
  }

  getResponse(userMessage) {
    const messageLower = userMessage.toLowerCase();
    let bestMatch = null;
    let bestScore = 0;

    // Search knowledge base for matches
    for (const item of this.knowledgeBase.faq) {
      for (const keyword of item.keywords) {
        if (messageLower.includes(keyword.toLowerCase())) {
          const score = keyword.length; // Longer keywords = better match
          if (score > bestScore) {
            bestScore = score;
            bestMatch = item;
          }
        }
      }
    }

    if (bestMatch) {
      return bestMatch.response;
    }

    // Fallback responses for common patterns
    if (messageLower.includes('thank') || messageLower.includes('thanks')) {
      return 'You\'re welcome! Anything else I can help with?';
    }

    if (messageLower.includes('?')) {
      return 'That\'s a great question! For specific details about that topic, please WhatsApp us at +255 758 458 404 or email marveltimberexporters@gmail.com. We\'re here to help!';
    }

    return 'I\'d love to help! Could you be more specific? Ask me about: timber products, agro commodities, services, pricing, delivery, certifications, or contact info. Or reach out directly: +255 758 458 404 🙂';
  }

  addMessageToUI(message, sender) {
    const messagesContainer = document.getElementById('marvel-chat-messages');
    const messageEl = document.createElement('div');
    messageEl.className = `marvel-chat-message ${sender}`;
    messageEl.innerHTML = `
      <div class="marvel-chat-bubble">
        ${this.escapeHtml(message)}
      </div>
    `;

    messagesContainer.appendChild(messageEl);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  saveToLocalStorage() {
    try {
      localStorage.setItem('marvelChatHistory', JSON.stringify(this.conversationHistory));
    } catch (e) {
      console.log('Chat history not saved (localStorage full or disabled)');
    }
  }

  loadChatHistory() {
    try {
      const saved = localStorage.getItem('marvelChatHistory');
      if (saved) {
        this.conversationHistory = JSON.parse(saved);
        // Don't display old history to keep UI clean
      }
    } catch (e) {
      console.log('Could not load chat history');
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new MarvelChatbot();
  });
} else {
  new MarvelChatbot();
}
