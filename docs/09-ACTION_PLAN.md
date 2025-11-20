# 🚀 Project Action Plan: Real Estate AI Coach (MVP)

**Timeline:** 2 Days
**Goal:** Functional MVP allowing users to select a scenario, view practice tasks, and simulate a roleplay conversation with an AI Client.

---

## 🏗️ Phase 1: Foundation & Setup (Est. 2-3 Hours)

_Objective: Get the "Hello World" running on everyone's machine and database ready._

- [x] **Repo Setup**
  - [x] Initialize Monorepo (Client + Server).
  - [x] Configure `concurrently` to run both apps with one command.
  - [x] Set up `.gitignore` and `tsconfig.json` (TypeScript NodeNext).
  - [x] Install all dependencies (`npm install`).
- [x] **Database Init**
  - [x] Create MongoDB Atlas cluster (or local setup).
  - [x] Define Mongoose Schema (`Scenario.ts`) matching the spec.
  - [x] Run `npm run seed` to populate the 5 sample scenarios.
- [x] **Environment Variables**
  - [x] Create `.env` file (shared securely among team).
  - [x] Verify `OPENAI_API_KEY` is working.
  - [x] Verify `MONGODB_URI` connection.

---

## 🎨 Phase 2: Frontend - Practice Mode

_Objective: User can see the list of scenarios and the details of a selected scenario._

- [ ] **UI Skeleton**
  - [x] Setup Tailwind CSS v4.
  - [ ] Create basic Layout (Header, Main Content area).
- [ ] **Scenario Selection Page**
  - [ ] Fetch data from `GET /api/scenarios`.
  - [ ] Render a Grid/List of Scenario Cards (Title, Description).
  - [ ] specific: On click -> Navigate to Practice Page (pass ID).
- [ ] **Practice Page (Read-Only Mode)**
  - [ ] Fetch details from `GET /api/scenarios/:id`.
  - [ ] **Left Panel:** Display "Context" & "Client Appearance".
  - [ ] **Right Panel:** Display "Tasks" list (Checklist UI).
  - [ ] **Interaction:** Add a simple "Next / Start Simulation" button.
  - [ ] **Logic:** Simple state to show one task at a time (optional) or list all.

---

## ⚙️ Phase 3: Backend - Simulation Logic

_Objective: The AI can receive a message and reply as the specific persona._

- [ ] **Server Endpoint Setup**
  - [ ] Implement `POST /api/chat/simulation`.
  - [x] Implement `DELETE /api/chat/:sessionId`.
- [ ] **In-Memory Session Store**
  - [ ] Create global object/map to hold chat history by `sessionId`.
  - [ ] Logic to clear history on restart.
- [ ] **LangChain Integration**
  - [ ] **Initialization:** On first message, fetch Scenario from DB.
  - [ ] **Prompt Engineering:** Construct System Prompt using `context` + `transcript`.
  - [ ] **Chain:** Input -> History -> LLM -> Output.
- [ ] **Testing**
  - [ ] Verify with Postman/cURL that the AI remembers context (e.g., ask "Who are you?").

---

## 💬 Phase 4: Frontend - Simulation Mode

_Objective: The actual chat interface where the user talks to the AI._

- [ ] **Chat UI Layout**
  - [ ] Chat bubble components (User right, AI left).
  - [ ] Input field with "Send" button (and Enter key support).
  - [ ] "Restart Session" button.
- [ ] **Integration Logic**
  - [ ] Generate `sessionId` using `crypto.randomUUID()` on mount.
  - [ ] **API Call:** Send message + sessionId + scenarioId to Backend.
  - [ ] **Loading State:** Show "AI is typing..." indicator while waiting.
  - [ ] **State Management:** Append new messages to local state array.
- [ ] **Transition Flow**
  - [ ] Connect "Start Simulation" button from Practice Page to Chat Page.
  - [ ] Ensure `scenarioId` is passed correctly.

---

## 💅 Phase 5: Polish & Demo Prep

_Objective: Make it look good and ensure no critical bugs._

- [ ] **UI/UX Refinement**
  - [ ] Add avatars for User (Realtor icon) and AI (Person icon).
  - [ ] Improve typography and spacing (Tailwind).
  - [ ] Handle Markdown/Newlines in AI responses (if any).
- [ ] **Error Handling**
  - [ ] Show error toast if Server/OpenAI fails.
  - [ ] Handle 404 if Scenario ID is missing.
- [ ] **Final Smoke Test**
  - [ ] Run through the full flow: Select -> Practice (Read Tasks) -> Simulate (Chat 5 turns) -> Reset.
- [ ] **Deployment (Optional)**
  - [ ] Prepare for local demo (ensure `npm run dev` works perfectly).

---

## 📝 Check-in Milestones

1.  **Milestone 1:** Database seeded & API returning JSON. (Target: Day 1, 12:00 PM)
2.  **Milestone 2:** Practice Page UI displays correct data. (Target: Day 1, 5:00 PM)
3.  **Milestone 3:** "Hello World" chat with AI (Backend working). (Target: Day 1, 8:00 PM)
4.  **Milestone 4:** Full Chat UI working with AI. (Target: Day 2, 12:00 PM)
5.  **Milestone 5:** Code Freeze & UI Polish. (Target: Day 2, 4:00 PM)
