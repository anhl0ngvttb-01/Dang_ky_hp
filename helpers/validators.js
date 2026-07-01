module.exports = {
  isRequired(value) {
    return value !== undefined && value !== null && String(value).trim() !== "";
  },

  isEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || ""));
  },

  isUsername(value) {
    return /^[A-Za-z0-9_]{3,50}$/.test(String(value || ""));
  },

  isStrongPassword(value) {
    return String(value || "").length >= 6;
  },
};
