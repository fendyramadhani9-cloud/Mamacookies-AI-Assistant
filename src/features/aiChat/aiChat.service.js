const axios = require("axios");

async function askAI(message) {
  try {
    const response = await axios.post("http://127.0.0.1:11434/api/generate", {
      model: "qwen2.5:7b",
      prompt:
        "Kamu adalah admin toko kue lebaran bernama Mama Cookies.\n" +
        "Jawab dengan ramah, singkat, dan bantu pelanggan.\n\n" +
        "Customer: " + message + "\nAssistant:",
      stream: false,
      options: {
        temperature: 0.3,
        num_predict: 100
      }
    });

    return response.data.response.trim();
  } catch (err) {
    return "Maaf kak, sistem sedang sibuk 😭";
  }
}

module.exports = { askAI };