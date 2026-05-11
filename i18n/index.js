import enUS from "./en-US.js";
import zhCN from "./zh-CN.js";
import jaJP from "./ja-JP.js";
import thTH from "./th-TH.js";
import frFR from "./fr-FR.js";
import itIT from "./it-IT.js";
import viVN from "./vi-VN.js";
import esES from "./es-ES.js";
import deDE from "./de-DE.js";
import ruRU from "./ru-RU.js";
import ptPT from "./pt-PT.js";
import koKR from "./ko-KR.js";
import svSE from "./sv-SE.js";
import ukUA from "./uk-UA.js";
import zhTW from "./zh-TW.js";
import daDK from "./da-DK.js";
import trTR from "./tr-TR.js";
import idID from "./id-ID.js";
import {
  LANGUAGE_STORAGE_KEY,
  DEFAULT_LANGUAGE_ENUM,
  LANGUAGE_OPTIONS,
  normalizeLanguageEnum,
  getLocaleByLanguageEnum,
  detectLanguageByNavigator
} from "./languages.js";

const CATALOGS = Object.freeze({
  "zh-CN": zhCN,
  "en-US": enUS,
  "ja-JP": jaJP,
  "th-TH": thTH,
  "fr-FR": frFR,
  "it-IT": itIT,
  "vi-VN": viVN,
  "es-ES": esES,
  "de-DE": deDE,
  "ru-RU": ruRU,
  "pt-PT": ptPT,
  "ko-KR": koKR,
  "sv-SE": svSE,
  "uk-UA": ukUA,
  "zh-TW": zhTW,
  "da-DK": daDK,
  "tr-TR": trTR,
  "id-ID": idID
});

let currentLanguageEnum = DEFAULT_LANGUAGE_ENUM;

export function getLanguage() {
  return currentLanguageEnum;
}

export function getLocaleCode(languageEnum = currentLanguageEnum) {
  return getLocaleByLanguageEnum(languageEnum);
}

export function resolveInitialLanguageEnum() {
  try {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    const normalizedSaved = normalizeLanguageEnum(saved);
    if (normalizedSaved) return normalizedSaved;
  } catch (e) {
    // ignore storage read failure
  }
  return detectLanguageByNavigator(navigator?.language);
}

export function setLanguage(languageEnum, persist = true) {
  const normalized = normalizeLanguageEnum(languageEnum) || DEFAULT_LANGUAGE_ENUM;
  currentLanguageEnum = normalized;
  if (persist) {
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, normalized);
    } catch (e) {
      // ignore storage write failure
    }
  }
  return currentLanguageEnum;
}

export function t(key, params) {
  const locale = getLocaleCode();
  const table = CATALOGS[locale] || CATALOGS["en-US"];
  const fallback = CATALOGS["en-US"];
  const zhFallback = CATALOGS["zh-CN"];
  let text = table[key] ?? fallback[key] ?? zhFallback[key] ?? key;
  if (params && typeof params === "object") {
    text = text.replace(/\{(\w+)\}/g, (_, name) => String(params[name] ?? `{${name}}`));
  }
  return text;
}

export {
  DEFAULT_LANGUAGE_ENUM,
  LANGUAGE_OPTIONS,
  normalizeLanguageEnum
};
