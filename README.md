# MamaCookies AI WhatsApp Bot

AI-powered WhatsApp bot designed to handle pre-orders for a homemade cookies business.

This project combines WhatsApp automation, local AI (Ollama + Qwen), and MongoDB to create an intelligent ordering assistant capable of handling customer interactions without relying on external AI APIs.

---

## Features

- AI-powered WhatsApp assistant
- Pre-order (PO) management system
- MongoDB-based order storage
- WhatsApp automation using Baileys
- Automatic order ID generation
- Admin notification system

---

## AI Capability

The bot uses a locally hosted Qwen model through Ollama to:

- Answer customer questions
- Recommend products
- Handle casual conversations
- Operate completely offline without external AI APIs

---

## Technology Stack

- Node.js
- Baileys (WhatsApp Web API)
- MongoDB
- Ollama
- Qwen2.5
- Axios

---

## Project Structure

```text
src/
├── core/
│   ├── bot.js
│   ├── router.js
│   └── sessionManager.js
│
├── features/
│   ├── aiChat/
│   ├── preorder/
│   ├── catalog/
│   └── adminNotify/
│
├── database/
│   └── models/
│
└── utils/
```

---

## Installation

### 1. Clone Repository

```bash
git clone https://github.com/USERNAME/mamacookies-ai-bot.git

cd mamacookies-ai-bot
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create a `.env` file.

```env
MONGO_URI=mongodb://127.0.0.1:27017/mamacookies

ADMIN_NUMBER=628xxxxxxxxxx@s.whatsapp.net

MAPS_LINK=https://maps.google.com/...
```

### 4. Start MongoDB

Make sure your local MongoDB server is running.

### 5. Start Ollama

```bash
ollama run qwen2.5:7b
```

### 6. Run the Bot

```bash
npm start
```

Scan the QR code using WhatsApp to authenticate the session.

---

## Usage

### Customer Commands

| Command | Description |
|----------|-------------|
| `.menu` | View product catalog |
| `.pesan` | Start a new order |
| Normal chat | AI responds automatically |

### Admin Commands

| Command | Description |
|----------|-------------|
| `.list` | View all customer orders |

---

## Order Workflow

1. Customer starts an order using `.pesan`
2. Customer enters name
3. Customer selects products and quantity
4. Customer confirms the order
5. Order is stored in MongoDB
6. Admin receives an order notification

---

## Preview

The project includes a WhatsApp AI assistant capable of handling real customer conversations and pre-order requests.

Screenshots can be added to demonstrate:

- QR Login
- WhatsApp Conversation
- Order Processing
- MongoDB Data
- Terminal Output

---

## Future Improvements

- Payment gateway integration
- Web dashboard
- Order status tracking
- Multi-admin support

---

## Author

**Fendy Ramadhani**

TJKT Student | AI & Cloud enthusias

GitHub  : https://github.com/fendyramadhani9-cloud
Email   : fendyramadhani9@gmail.com
LinkedIn: https://www.linkedin.com/in/fendy-ramadhani9

---

## License

This project is intended for educational and portfolio purposes.
