function isAdmin(sender) {
  return sender === process.env.ADMIN_NUMBER;
}

module.exports = { isAdmin };
