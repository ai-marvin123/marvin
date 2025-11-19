# Database Schema & Seed Data

**Database:** MongoDB
**Collection:** `scenarios`

## 1. Schema Definition

This collection stores the training scenarios. Each document defines a situation where the **User acts as a Realtor** interacting with a **Person** (Buyer, Seller, or Lead).

```javascript
{
  "_id": "ObjectId",
  "title": "String", // Title of the training scenario
  "description": "String", // Short summary for the selection menu
  "videoSourceUrl": "String", // Optional: Link to the original training video

  "personProfile": {
    "name": "String",
    "age": "Number",
    "personality": "String", // Adjectives describing behavior (e.g., "Skeptical", "Emotional")
    "background": "String", // Context of the client/buyer/seller
    "appearanceDescription": "String" // Visual description for the UI
  },

  // The main goal the user needs to achieve in this session
  "task": "String",

  // Strategic advice for the user on HOW to handle the situation (Client-facing tips)
  "simulationGuides": "String",

  "createdAt": "Date",
  "updatedAt": "Date"
}
```

---

## 2\. Seed Data (Initial 5 Scenarios)

Copy this JSON array to initialize your MongoDB collection.

```json
[
  {
    "title": "The Overpriced Fixer-Upper",
    "description": "Handle a buyer who thinks the listing price is too high given the renovation costs.",
    "videoSourceUrl": "[https://youtube.com/sample1](https://youtube.com/sample1)",
    "personProfile": {
      "name": "Robert Chen",
      "age": 45,
      "personality": "Analytical, stubborn, data-driven",
      "background": "An engineer looking for an investment property. He has a spreadsheet of costs.",
      "appearanceDescription": "Wearing glasses, holding a clipboard, looking skeptically at the peeling paint."
    },
    "task": "Convince Robert that the potential value after renovation justifies the asking price.",
    "simulationGuides": "Focus on the After Repair Value (ARV). Acknowledge his math first, then show him the comps of renovated houses in the neighborhood to prove the margin exists.",
    "createdAt": "2023-10-27T10:00:00Z",
    "updatedAt": "2023-10-27T10:00:00Z"
  },
  {
    "title": "The Emotional Seller",
    "description": "Negotiate a price reduction with a seller who is emotionally attached to their home.",
    "videoSourceUrl": "[https://youtube.com/sample2](https://youtube.com/sample2)",
    "personProfile": {
      "name": "Sarah Jenkins",
      "age": 62,
      "personality": "Sentimental, defensive, soft-spoken",
      "background": "Selling the family home she lived in for 30 years. She is offended by the market feedback.",
      "appearanceDescription": "Sitting on the porch, holding a framed photo, looking teary-eyed."
    },
    "task": "Gently persuade Sarah to lower the listing price by $15k to attract buyers.",
    "simulationGuides": "Do not start with numbers. First, validate her feelings and memories. Then, reframe the price reduction as a strategy to find a new family who will love the home as much as she did.",
    "createdAt": "2023-10-27T10:00:00Z",
    "updatedAt": "2023-10-27T10:00:00Z"
  },
  {
    "title": "The Nervous First-Time Buyer",
    "description": "Prevent a buyer from backing out of a deal due to inspection anxiety.",
    "videoSourceUrl": "[https://youtube.com/sample3](https://youtube.com/sample3)",
    "personProfile": {
      "name": "Emily Dao",
      "age": 28,
      "personality": "Anxious, overwhelmed, indecisive",
      "background": "Buying her first condo. The inspection report showed some electrical issues and she is panicking.",
      "appearanceDescription": "Pacing back and forth, holding a thick inspection report, biting her lip."
    },
    "task": "Calm Emily down and explain the difference between major hazards and minor repairs.",
    "simulationGuides": "Avoid technical jargon. Categorize the issues into 'Safety' vs 'Maintenance'. Propose a solution where we ask the seller for credit instead of walking away.",
    "createdAt": "2023-10-27T10:00:00Z",
    "updatedAt": "2023-10-27T10:00:00Z"
  },
  {
    "title": "The Lowball Investor",
    "description": "Explain to a aggressive buyer why their extremely low offer will be rejected.",
    "videoSourceUrl": "[https://youtube.com/sample4](https://youtube.com/sample4)",
    "personProfile": {
      "name": "Mike Ross",
      "age": 35,
      "personality": "Aggressive, confident, risk-taker",
      "background": "A flipper who thinks the market is crashing. He wants to offer 20% below asking.",
      "appearanceDescription": "Leaning back in his chair, arms crossed, checking his phone indifferently."
    },
    "task": "Refuse to submit the lowball offer as-is, and steer him toward a competitive price.",
    "simulationGuides": "Be firm but professional. Use data on 'Days on Market' to show high demand. Explain that a disrespectful offer might make the seller refuse to negotiate with us entirely.",
    "createdAt": "2023-10-27T10:00:00Z",
    "updatedAt": "2023-10-27T10:00:00Z"
  },
  {
    "title": "The Luxury Listing Pitch",
    "description": "Win a listing presentation for a high-end penthouse against top competitors.",
    "videoSourceUrl": "[https://youtube.com/sample5](https://youtube.com/sample5)",
    "personProfile": {
      "name": "Victoria Vance",
      "age": 50,
      "personality": "Sophisticated, demanding, impatient",
      "background": "CEO selling a luxury penthouse. She interviews 3 agents today and expects concierge service.",
      "appearanceDescription": "Checking her expensive watch, dressed in a designer suit, standing in a minimalist office."
    },
    "task": "Convince Victoria that your marketing plan justifies your 6% commission fee.",
    "simulationGuides": "Do not compete on price (commission). Compete on value. Highlight your global marketing reach, professional staging, and private network of high-net-worth buyers.",
    "createdAt": "2023-10-27T10:00:00Z",
    "updatedAt": "2023-10-27T10:00:00Z"
  }
]
```
