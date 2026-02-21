# 🍪 MamaCookies AI WhatsApp Bot

AI-powered WhatsApp bot for handling pre-orders (PO) of homemade cookies.

Built with Node.js, Baileys, MongoDB, and local AI (Ollama - Qwen).

---

## 🚀 Features

- 🤖 AI Chat Assistant (Local AI - Qwen)
- 🛒 Pre-order system (PO)
- 📦 Order management with MongoDB
- 📲 WhatsApp automation (Baileys)
- 🧾 Auto order ID generator
- 🔔 Admin notification system

---

## 🧠 AI Capability

This bot uses **local AI (Ollama - Qwen model)** to:
- Answer customer questions
- Recommend products
- Handle casual conversations

No external API required.

---

## 🏗️ Tech Stack

- Node.js
- Baileys (WhatsApp Web API)
- MongoDB
- Ollama (Local AI)
- Axios

---

## 📁 Project Structure


src/
├── core/
│ ├── bot.js
│ ├── router.js
│ └── sessionManager.js
│
├── features/
│ ├── aiChat/
│ ├── preorder/
│ ├── catalog/
│ └── adminNotify/
│
├── database/
│ └── models/
│
└── utils/


---

## ⚙️ Installation

### 1. Clone repository
```bash
git clone https://github.com/USERNAME/mamacookies-ai-bot.git
cd mamacookies-ai-bot
2. Install dependencies
npm install
3. Setup environment

Create .env file:

MONGO_URI=mongodb://127.0.0.1:27017/mamacookies
ADMIN_NUMBER=628xxxxxxxxxx@s.whatsapp.net
MAPS_LINK=https://maps.google.com/...
4. Run MongoDB

Make sure MongoDB is running locally.

5. Run AI (Ollama)
ollama run qwen2.5:7b
6. Start bot
npm start

Scan QR code from WhatsApp.

📌 Usage
Customer Commands

.menu → View product catalog

.pesan → Start order

Chat normally → AI will respond

Admin

.list → View all orders

🛒 Order Flow

Customer starts order (.pesan)

Input name

Input items + quantity

Confirm order

Data saved to MongoDB

Admin receives notification

📸 Preview

WhatsApp AI bot handling real customer order conversation.

🧠 Future Improvements

Payment integration

Web dashboard

Order status tracking

Multi-admin support

👨‍💻 Author

Fendy Ramadhani
Vocational student (TJKT) | AI & Backend Enthusias