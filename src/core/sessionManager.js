const sessions = {};

function getSession(sender) {
  if (!sessions[sender]) {
    sessions[sender] = {
      mode: "CHAT", // CHAT / CHECKOUT / CONFIRM
      step: null,
      order: {}
    };
  }
  return sessions[sender];
}

function resetSession(sender) {
  delete sessions[sender];
}

module.exports = { getSession, resetSession };
