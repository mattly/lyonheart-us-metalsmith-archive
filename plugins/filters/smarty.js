var typogr = require('typogr');

module.exports = function(text) {
  t = typogr(text).chain().amp()
  if (text.split(' ').length > 2) {
    t = t.widont()
  }
  return t.smartypants().initQuotes().caps().ord().value()
}
