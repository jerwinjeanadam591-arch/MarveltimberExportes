// Translation System for Marvel Timber Exporters Website
// Supports: English, French, Arabic, German, Spanish

class Translator {
  constructor() {
    this.currentLanguage = localStorage.getItem('siteLanguage') || 'en';
    this.translations = {};
    this.supportedLanguages = {
      en: 'English',
      fr: 'Français',
      ar: 'العربية',
      de: 'Deutsch',
      es: 'Español'
    };
  }

  async loadTranslations() {
    try {
      const response = await fetch('/support/translations.json');
      if (!response.ok) throw new Error('Failed to load translations');
      this.translations = await response.json();
    } catch (error) {
      console.error('Error loading translations:', error);
      // Fallback to English if load fails
      this.currentLanguage = 'en';
    }
  }

  translate(key, defaultValue = key) {
    const parts = key.split('.');
    let value = this.translations[this.currentLanguage] || {};
    
    for (const part of parts) {
      value = value[part];
      if (value === undefined) return defaultValue;
    }
    
    return value || defaultValue;
  }

  setLanguage(lang) {
    if (!this.supportedLanguages[lang]) {
      console.warn(`Unsupported language: ${lang}`);
      return;
    }
    
    this.currentLanguage = lang;
    localStorage.setItem('siteLanguage', lang);
    
    // Set HTML lang attribute and direction
    document.documentElement.lang = lang;
    document.documentElement.dir = (lang === 'ar') ? 'rtl' : 'ltr';
    
    // Translate all elements with data-i18n attribute
    this.translatePage();
  }

  translatePage() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
      const key = element.getAttribute('data-i18n');
      const type = element.getAttribute('data-i18n-type') || 'text';
      const translation = this.translate(key);
      
      if (type === 'text') {
        element.textContent = translation;
      } else if (type === 'html') {
        element.innerHTML = translation;
      } else if (type === 'placeholder') {
        element.placeholder = translation;
      } else if (type === 'title') {
        element.title = translation;
      } else if (type === 'alt') {
        element.alt = translation;
      } else if (type === 'aria-label') {
        element.setAttribute('aria-label', translation);
      }
    });
    
    // Update page title
    const titleKey = document.documentElement.getAttribute('data-page-title');
    if (titleKey) {
      document.title = this.translate(titleKey);
    }
    
    // Update meta description
    const descriptionKey = document.documentElement.getAttribute('data-page-description');
    if (descriptionKey) {
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', this.translate(descriptionKey));
      }
    }
  }

  initLanguageSwitcher() {
    // Update language links
    const langOptions = document.querySelectorAll('.lang-option');
    langOptions.forEach(option => {
      const lang = option.getAttribute('data-lang');
      if (!lang) return;
      
      // Remove aria-disabled and make functional
      option.removeAttribute('aria-disabled');
      option.classList.toggle('is-current', lang === this.currentLanguage);
      
      option.addEventListener('click', (e) => {
        e.preventDefault();
        this.setLanguage(lang);
        
        // Update visual indicator
        document.querySelectorAll('.lang-option').forEach(opt => {
          opt.classList.remove('is-current');
        });
        option.classList.add('is-current');
      });
    });
    
    // Close dropdown after selection
    const languageDropdown = document.querySelector('.language-dropdown');
    if (languageDropdown) {
      const dropdown = languageDropdown.querySelector('.dropdown-menu');
      const toggle = languageDropdown.querySelector('.nav-toggle');
      
      if (toggle) {
        toggle.addEventListener('click', () => {
          dropdown.classList.toggle('active');
        });
        
        document.addEventListener('click', (e) => {
          if (!languageDropdown.contains(e.target)) {
            dropdown.classList.remove('active');
          }
        });
      }
    }
  }

  init() {
    // Set initial language on HTML element
    document.documentElement.lang = this.currentLanguage;
    document.documentElement.dir = (this.currentLanguage === 'ar') ? 'rtl' : 'ltr';
    
    // Initialize language switcher
    this.initLanguageSwitcher();
    
    // Translate page content
    this.translatePage();
  }
}

// Global translator instance
let translator = new Translator();

// Load translations and initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', async () => {
    await translator.loadTranslations();
    translator.init();
  });
} else {
  translator.loadTranslations().then(() => {
    translator.init();
  });
}
