# API Specification

**Base URL:** `http://localhost:3000/api/v1`
**Format:** JSON
**Stateless Policy:** The server does not store chat history. The client must provide the `history` array in every request.

---

## 1\. Scenarios (Data Fetching)

### 1.1. Get All Scenarios

Retrieves the list of training scenarios to display on the dashboard/selection menu.

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

Retrieves the full context for a specific scenario.

- **Practice Page:** Use `personProfile`, `task`, and `simulationGuides` to display the context card.

- **Simulation Page:** Use `personProfile` to display who the user is talking to.

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
  "simulationGuides": "Focus on After Repair Value (ARV). Don't dismiss his math.",
  "createdAt": "2023-10-27T10:00:00Z"
}
```

---

## 2\. Practice Flow (AI as Coach)

In this mode, the user is **learning**. The user submits an attempt or a question, and the AI provides feedback based on the `task` and `simulationGuides`.

### 2.1. Submit Practice Input

- **Endpoint:** `POST /chat/practice`
- **Description:** The AI acts as a **Mentor/Coach**. It analyzes the user's input against the scenario's `task` and provides feedback or suggestions.
- **Content-Type:** `application/json`

#### Request Body

```json
{
  "scenarioId": "653a1b2c...",
  "message": "I would tell him that the house has great bones and the area is appreciating.",
  "history": [] // Optional in practice mode, but good if conversation continues
}
```

#### Response (`200 OK`)

```json
{
  "reply": "That's a good start, but it's a bit vague for an analytical client like Robert. Try to mention specific numbers or comparable sales (comps) to back up your claim about appreciation."
}
```

#### Backend Logic (LangChain)

1.  Fetch Scenario by ID.
2.  **System Prompt Role:** "You are an expert Real Estate Coach."
3.  **Context:** Inject `scenario.task` and `scenario.simulationGuides`.
4.  **Instruction:** Evaluate the user's `message`. Does it align with the guide? Is it effective?
5.  **Output:** Provide constructive feedback/coaching.

---

## 3\. Simulation Flow (AI as Client)

In this mode, the user is **performing**. The user acts as the Realtor, and the AI acts strictly as the specific persona defined in the DB.

### 3.1. Send Simulation Message

- **Endpoint:** `POST /chat/simulation`
- **Description:** The AI acts as the **Target Person** (Buyer/Seller). It responds to the user's input in character.
- **Content-Type:** `application/json`

#### Request Body

```json
{
  "scenarioId": "653a1b2c...",
  "message": "Hi Robert, I understand your concern about the price. Have you seen the renovated unit down the street?",
  "history": [
    { "role": "user", "content": "Hi Robert, nice to meet you." },
    {
      "role": "assistant",
      "content": "Hi. Look, I'll be honest, this price is crazy."
    }
  ]
}
```

#### Response (`200 OK`)

```json
{
  "reply": "I saw it, but that one had a brand new roof. This one is falling apart. Why should I pay a premium for this?"
}
```

#### Backend Logic (LangChain)

1.  Fetch Scenario by ID.
2.  **System Prompt Role:** "You are {personProfile.name}, a {personProfile.age} year old who is {personProfile.personality}."
3.  **Context:** Inject `personProfile.background`.
4.  **Instruction:** React to the user's input naturally. Keep responses concise (conversation style). Do not break character.
5.  **Output:** The character's dialogue.

---

## 4\. Error Handling

All endpoints return standard HTTP errors:

- **400 Bad Request:** Missing `scenarioId` or `message`.
- **404 Not Found:** `scenarioId` does not exist in MongoDB.
- **500 Internal Server Error:** Issues with OpenAI API, Database connection, or LangChain processing.

<!-- end list -->

```json
{
  "error": "Scenario not found"
}
```
