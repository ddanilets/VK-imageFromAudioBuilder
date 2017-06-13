const locales = ['en', 'ru'];
import en from './locale/en';
import ru from './locale/ru';


export const availableLocales = (locale) => {
  if (typeof locale === 'string') {
    if (locales.includes(locale.toLowerCase())) {
      return {
        contains: true,
        locale: locale.toLowerCase(),
      };
    }
  }
  return {
    contains: false,
  };
};

export function getAvailableLocales() {
  return locales;
}

export function getLocale(language, id) {
  switch (language) {
    case 'en': {
      const idArray = id.split('.');
      let result = en;
      idArray.forEach(el => {
        result = result[el];
      });
      return result;
    }
    case 'ru': {
      const idArray = id.split('.');
      let result = ru;
      idArray.forEach(el => {
        result = result[el];
      });
      return result;
    }
    default: {
      return `no translate for ${id}`;
    }
  }
}

export function getHeaders(language, page) {
  switch (language) {
    case 'en':
      return en[page].header;
    case 'ru':
      return ru[page].header;
    default:
      return en[page].header;
  }
}
