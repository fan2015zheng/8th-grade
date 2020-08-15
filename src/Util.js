

export default class Util {
  static trunkText = trunkText
}

function trunkText(text, count) {
  if (!text) {
    return ""
  }
  if (text.length <= count) {
    return text
  } else {
    return text.substring(0,count-1)+'…'
  }
}