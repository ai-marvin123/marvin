import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Scenario from '../server/models/Scenario.js';

// Load environment variables to get MONGODB_URI
dotenv.config();

const mongoUri = process.env.MONGODB_URI;

// Validate connection string
if (!mongoUri) {
  console.error('❌ CRITICAL ERROR: Missing MONGODB_URI in .env file');
  process.exit(1);
}

// Initial Data: 5 Real Estate Training Scenarios
const sampleScenarios = [
  {
    title: 'The Overpriced Fixer-Upper',
    description:
      'Handle a buyer who thinks the listing price is too high given the renovation costs.',
    videoSourceUrl: 'https://youtube.com/sample1',
    transcript:
      "Buyer: I've crunched the numbers, and with the roof repairs, this price makes no sense. It's way above market value for a shell like this.",
    context:
      'You are meeting Robert Chen, a 45-year-old analytical engineer. He is looking for an investment property but is very skeptical. He is holding a clipboard with a spreadsheet of repair costs and staring at the peeling paint.',
    tasks: [
      'Acknowledge his math regarding the renovation costs.',
      'Shift the focus to the After Repair Value (ARV).',
      'Show comparable sales (comps) of renovated houses to prove the potential margin.',
    ],
  },
  {
    title: 'The Emotional Seller',
    description:
      'Negotiate a price reduction with a seller who is emotionally attached to their home.',
    videoSourceUrl: 'https://youtube.com/sample2',
    transcript:
      'Seller: You want me to drop the price by how much? We raised our children in this house! My husband built that porch with his own hands.',
    context:
      'You are sitting on the porch with Sarah Jenkins, 62. She is selling her family home of 30 years. She is sentimental, defensive, and feels offended by the low market feedback.',
    tasks: [
      'Validate her memories and emotional attachment to the home.',
      'Avoid starting the conversation with cold numbers.',
      'Reframe the price reduction as a strategy to find a new family who will love the home as much as she did.',
    ],
  },
  {
    title: 'The Nervous First-Time Buyer',
    description:
      'Prevent a buyer from backing out of a deal due to inspection anxiety.',
    videoSourceUrl: 'https://youtube.com/sample3',
    transcript:
      "Buyer: Did you see this report? The electrical wiring is outdated, and there's a crack in the driveway. I think I made a mistake. I can't handle this risk.",
    context:
      'Emily Dao, 28, is buying her first condo. She is anxious and overwhelmed after reading the inspection report. She is pacing back and forth and biting her lip.',
    tasks: [
      'Calm Emily down and normalize the inspection process.',
      "Categorize the issues into 'Major Safety Hazards' vs 'Minor Maintenance'.",
      'Propose asking the seller for a credit instead of canceling the deal.',
    ],
  },
  {
    title: 'The Lowball Investor',
    description:
      'Explain to a aggressive buyer why their extremely low offer will be rejected.',
    videoSourceUrl: 'https://youtube.com/sample4',
    transcript:
      "Buyer: Look, the market is crashing. I'm doing them a favor by offering cash. Take it or leave it, 20% below asking.",
    context:
      'Mike Ross, 35, is an aggressive flipper who believes the market is crashing. He is arrogant, leaning back in his chair with his arms crossed.',
    tasks: [
      'Firmly refuse to submit the lowball offer as-is.',
      "Use 'Days on Market' data to prove high demand.",
      'Explain that a disrespectful offer might cause the seller to refuse future negotiations.',
    ],
  },
  {
    title: 'The Luxury Listing Pitch',
    description:
      'Win a listing presentation for a high-end penthouse against top competitors.',
    videoSourceUrl: 'https://youtube.com/sample5',
    transcript:
      "Owner: I'm interviewing three other agents today. Everyone says they can sell it. Why should I pay you 6% when others offer 4%?",
    context:
      'Victoria Vance, 50, is the CEO selling her luxury penthouse. She is sophisticated, impatient, and expects concierge-level service. She is checking her expensive watch.',
    tasks: [
      'Differentiate yourself based on value, not commission price.',
      'Highlight your global marketing reach and staging strategy.',
      'Demonstrate your private network of high-net-worth buyers.',
    ],
  },
];

const seedDB = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected successfully.');

    // Step 1: Clear existing data to avoid duplicates
    await Scenario.deleteMany({});
    console.log('🧹 Cleared old scenarios from database.');

    // Step 2: Insert new sample data
    await Scenario.insertMany(sampleScenarios);
    console.log(`🌱 Successfully seeded ${sampleScenarios.length} scenarios.`);

    // Step 3: Close connection
    mongoose.connection.close();
    console.log('👋 Connection closed. Seeding complete.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Error:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDB();
