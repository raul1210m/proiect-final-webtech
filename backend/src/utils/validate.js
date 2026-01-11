function isEmail(s) {
  return typeof s === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

function requiredString(s, min = 1) {
  return typeof s === "string" && s.trim().length >= min;
}

module.exports = { isEmail, requiredString };
