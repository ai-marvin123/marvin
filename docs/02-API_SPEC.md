# API Specification

**Base URL:** `http://localhost:8080/api`
**Format:** JSON
**State Management:** **Server-side In-Memory**. The server maintains chat history in RAM using a unique `sessionId` provided by the client.

---

## 1\. Scenarios (Data Fetching)

### 1.1. Get All Scenarios

Retrieves the list of training scenarios to display on the dashboard selection menu.

- **Endpoint:** `GET /scenarios`
- **Auth:** None
- **Response:** `200 OK`

<!-- end list -->

```json
[
  {
    "_id": "653a1b2c...",
    "title": "The Overpriced Fixer-Upper",
    "description": "Handle a buyer who thinks the listing price is too high.",
    "videoSourceUrl": "https://youtube.com/...",
    "createdAt": "2023-10-27T10:00:00Z"
  },
  {
    "_id": "653a1b2d...",
    "title": "The Emotional Seller",
    "description": "Negotiate with a seller attached to their home.",
    "videoSourceUrl": "https://youtube.com/...",
    "createdAt": "2023-10-27T10:00:00Z"
  }
]
```

### 1.2. Get Scenario Details

Retrieves full details for a specific scenario.

- **Practice Page Usage:** Frontend renders the `tasks` array as a checklist for the user to read and `context` for background info.

- **Simulation Page Usage:** Frontend sends `_id` to the chat endpoint to initialize the AI persona.

- **Endpoint:** `GET /scenarios/:id`

- **Auth:** None

- **Response:** `200 OK`

<!-- end list -->

```json
{
  "_id": "653a1b2c...",
  "title": "The Overpriced Fixer-Upper",
  "videoSourceUrl": "https://youtube.com/...",
  "transcript": "Buyer: I've crunched the numbers...",

  "context": "You are meeting Robert Chen, a 45-year-old analytical engineer...",

  "tasks": [
    "Acknowledge his math regarding renovation costs.",
    "Shift focus to After Repair Value (ARV).",
    "Show comparable sales data."
  ],

  "createdAt": "2023-10-27T10:00:00Z"
}
```

---

## 2\. Simulation Flow (AI as Client)

In this mode, the AI acts strictly as the **Target Person** (Buyer/Seller) defined in the scenario. The user chats with the AI to practice the negotiation.

### 2.1. Send Simulation Message

- **Endpoint:** `POST /chat/simulation`
- **Content-Type:** `application/json`

**Client Implementation Note**

> The Client **MUST** generate a unique `sessionId` (e.g., using `crypto.randomUUID()`) when the chat session starts. This ID must be persisted in the React state and sent with **every** subsequent message to maintain the conversation history.

#### Request Body

```json
{
  "sessionId": "36b8f84d-df4e-4d49-b662-bcde71a8764f",
  "scenarioId": "653a1b2c...",
  "message": "Hi Robert, have you seen the renovated unit down the street?"
}
```

#### Response (`200 OK`)

```json
{
  "reply": "I saw it, but that one didn't need $50k in repairs like this one does! Why should I pay a premium for this shell?"
}
```

#### Backend Logic (In-Memory)

1.  **Check Memory:** Check `globalSessionStore[sessionId]`.
2.  **Init (if new):** \* Fetch `context` and `transcript` from MongoDB using `scenarioId`.
    - Create System Prompt:
      > "You are a real estate client defined by this context: {context}.
      > Here is a transcript of your previous thoughts/video: {transcript}.
      > Act naturally as this person. Do not break character."
    - Store in `globalSessionStore`.
3.  **Process:** Append user message -\> Run LangChain -\> Append AI response -\> Return reply.

---

## 3\. Session Management

### 3.1. Reset Session

Call this when the user clicks "Restart" or leaves the page to clear the server memory for that session ID.

- **Endpoint:** `DELETE /chat/:sessionId`
- **Response:** `200 OK`
- **Logic:** `delete globalSessionStore[req.params.sessionId]`

---

## 4\. Error Handling

- **400 Bad Request:** Missing `sessionId`, `scenarioId`, or `message`.
- **404 Not Found:** Scenario ID invalid.
- **500 Internal Server Error:** OpenAI API error or Database connection issue.

<!-- end list -->

```json
{
  "error": "Scenario not found"
}
```
