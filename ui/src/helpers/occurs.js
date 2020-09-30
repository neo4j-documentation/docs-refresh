'use strict'

module.exports = (str, substring) => {
  // if (!util.isString(str)) return '';
  var len = substring.length;
  var pos = 0;
  var n = 0;

  while ((pos = str.indexOf(substring, pos)) > -1) {
    n++;
    pos += len;
  }
  return n != 0 ? true: false;
}
