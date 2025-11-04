exports.translate = function(dictionary, language, symbol) {
  if (!dictionary || typeof dictionary !== 'object') {
    throw new Error("Invalid dictionary!");
  }

  if (!language || !dictionary.hasOwnProperty(language)) {
    throw new Error("Invalid language: " + language);
  }

  if (!symbol || !dictionary[language].hasOwnProperty(symbol)) {
    throw new Error("Invalid symbol: " + symbol + " for language: " + language);
  }

  return dictionary[language][symbol];
};
