# Real Estate AI Coach 🏠🤖

An AI-powered roleplay training application for Real Estate Agents, helping them practice negotiation and client communication.

## 🛠️ Tech Stack

- **Frontend:** React, Vite, TailwindCSS v4
- **Backend:** Node.js, Express, LangChain, OpenAI
- **Database:** MongoDB (Mongoose)
- **Language:** TypeScript (Monorepo structure)

## 🚀 Quick Start

### 1\. Prerequisites

- Node.js (v18 or higher)
- MongoDB (Running locally or Atlas connection string)

### 2\. Installation

```bash
# Clone the repository
git clone <repo-url>

# Install dependencies (Root level installs for both client & server)
npm install
```

### 3\. Configuration

Create a `.env` file in the root directory:

```ini
# Backend
PORT=8080
MONGODB_URI=mongodb://localhost:27017/real-estate-coach
OPENAI_API_KEY=sk-proj-your-openai-key

# Frontend
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

### 4\. Run Development

Start both Frontend and Backend concurrently:

```bash
npm run dev
```

- **Frontend:** [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000)
- **Backend API:** [http://localhost:8080](https://www.google.com/search?q=http://localhost:8080)

---

## 📂 Project Structure

- `/client` - React frontend application.
- `/server` - Express backend & LangChain logic.
- `/scripts` - Database utility scripts (seeding).
- `/docs` - Project documentation (API Spec, Database Schema).
