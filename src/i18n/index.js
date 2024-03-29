import * as translations from './translations';

export default class I18nService {
  constructor(services, config = {}) {
    this.services = services;
    this.config = config;
    const lang = this.initLanguage()
    this.services.api.setHeader('X-Lang', lang);
    localStorage.setItem('lang', lang);
    this.listeners = [];
  }

  initLanguage() {
    const lang = localStorage.getItem('lang') || 'ru';
    this.lang = lang;
    return lang
  }

  subscribe(listener) {
    this.listeners.push(listener);

    return () => {
      this.listeners = this.listeners.filter(item => item !== listener);
    }
  }

   setLanguage(lang) {
    this.lang = lang;
    this.services.api.setHeader('X-Lang', lang);
    localStorage.setItem('lang', lang);
    this.listeners.forEach(listener => listener(lang));
  }

  translate(lang = this.lang, text, plural) {
    let result = translations[lang] && (text in translations[lang])
      ? translations[lang][text]
      : text;

    if (typeof plural !== 'undefined') {
      const key = new Intl.PluralRules(lang).select(plural);
      if (key in result) {
        result = result[key];
      }
    }

    return result;
  }
}