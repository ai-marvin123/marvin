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

Retrieves full details.

- **Practice UI:** Use `task`, `simulationGuide`, `personProfile`.

- **Simulation UI:** Use `personProfile`.

- **Endpoint:** `GET /scenarios/:id`

- **Auth:** None

- **Response:** `200 OK`

<!-- end list -->

```json
{
  "_id": "653a1b2c...",
  "title": "The Overpriced Fixer-Upper",
  "personProfile": {
    "name": "Robert Chen",
    "age": 45,
    "personality": "Analytical, stubborn",
    "background": "Engineer looking for investment...",
    "appearanceDescription": "Wearing glasses, holding a clipboard..."
  },
  "task": "Convince Robert that the potential value justifies the asking price.",
  "simulationGuide": "Focus on After Repair Value (ARV). Don't dismiss his math.",
  "createdAt": "2023-10-27T10:00:00Z"
}
```

---

## 2\. Practice Flow (AI as Coach)

In this mode, the AI acts as a **Mentor/Coach**. It evaluates the user's input against the learning objectives.

### 2.1. Send Practice Message

- **Endpoint:** `POST /chat/practice`
- **Content-Type:** `application/json`

#### Request Body

```json
{
  "sessionId": "client-gen-171982000",
  "scenarioId": "653a1b2c...",
  "message": "I would tell him that the house has good potential."
}
```

#### Response (`200 OK`)

```json
{
  "reply": "That is a bit generic. Since Robert is analytical, try to mention the specific ARV numbers to make your case stronger."
}
```

#### Backend Logic (In-Memory)

1.  **Check Memory:** Check `globalSessionStore[sessionId]`.
2.  **Init (if new):** \* Fetch `task` and `simulationGuide` from MongoDB.
    - Create System Prompt: "You are a Real Estate Coach. Guide the user to achieve: {task}. Use this strategy: {simulationGuide}."
    - Store in `globalSessionStore`.
3.  **Process:** Appends user message, runs LangChain, appends AI response, returns reply.

---

## 3\. Simulation Flow (AI as Client)

In this mode, the AI acts strictly as the **Target Person** (Buyer/Seller) defined in the scenario.

### 3.1. Send Simulation Message

- **Endpoint:** `POST /chat/simulation`
- **Content-Type:** `application/json`

#### Request Body

```json
{
  "sessionId": "client-gen-171982000",
  "scenarioId": "653a1b2c...",
  "message": "Hi Robert, have you seen the renovated unit down the street?"
}
```

#### Response (`200 OK`)

```json
{
  "reply": "I saw it, but that one didn't need $50k in repairs like this one does!"
}
```

#### Backend Logic (In-Memory)

1.  **Check Memory:** Check `globalSessionStore[sessionId]`.
2.  **Init (if new):** \* Fetch `personProfile` from MongoDB.
    - Create System Prompt: "You are {name}, {age} years old. Personality: {personality}. Background: {background}."
    - Store in `globalSessionStore`.
3.  **Process:** Appends user message, runs LangChain, appends AI response, returns reply.

---

## 4\. Session Management

### 4.1. Reset Session

Call this when the user clicks "Restart" or leaves the page to clear the server memory for that session ID.

- **Endpoint:** `DELETE /chat/:sessionId`
- **Response:** `200 OK`
- **Logic:** `delete globalSessionStore[req.params.sessionId]`

---

## 5\. Error Handling

- **400 Bad Request:** Missing `sessionId`, `scenarioId`, or `message`.
- **404 Not Found:** Scenario ID invalid.
- **500 Internal Server Error:** OpenAI API error.

<!-- end list -->

```json
{
  "error": "Scenario not found"
}
```
