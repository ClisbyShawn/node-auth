module.exports = createError = (code, name, message) => {
  return {
    code,
    name,
    message,
  };
};
