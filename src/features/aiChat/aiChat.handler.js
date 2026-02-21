const { askAI } = require("./aiChat.service");

async function handleAIChat(sock, sender, text) {
  const reply = await askAI(text);

  return sock.sendMessage(sender, {
    text: reply
  });
}

module.exports = { handleAIChat };