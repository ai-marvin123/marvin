import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { YoutubeLoader } from '@langchain/community/document_loaders/web/youtube';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import Scenario from '../server/models/Scenario.js';
import { clearScreenDown } from 'readline';

dotenv.config();

const mongoUri = process.env.MONGODB_URI;

const VIDEO_URLS = [
  'https://www.youtube.com/watch?v=OfKrywcsmxk',
  'https://www.youtube.com/watch?v=ymjQ0rgJIvc',
];

const processVideo = async (url: string, model: ChatOpenAI) => {
  console.log(`\n🎥 Processing: ${url}`);

  try {
    const loader = YoutubeLoader.createFromUrl(url, {
      language: 'en',
      addVideoInfo: false,
    });

    const docs = await loader.load();
    if (!docs.length) throw new Error('No transcript found');

    const transcript = docs[0].pageContent;
    // const videoTitle = docs[0].metadata.title || 'Unknown Video';

    console.log(
      `   ✅ Loaded transcript (${transcript.length} chars). Analyzing with AI...`
    );

    const systemPrompt = `
      You are a real estate coach training brand new agents on how to begin buyer’s consultation. You are going to help them practice the earliest steps in the buyer’s consultation, which is mostly about getting to know the clients and winning their trust to work with you over other agents.

      Your task is to analyze a training video transcript and create a roleplay scenario for a Realtor.
      
      Output must be valid JSON with this structure:
      {
        "title": "A short, catchy title for the scenario",
        "description": "A 1-sentence summary for the dashboard",
        "context": "Detailed persona of the Client (Name, Age, Personality, Background) and the setting.",
        "tasks": ["Task 1", "Task 2", "Task 3", ...]
      }

      Rules:
      - The 'context' must describe only their appearance and their state of mind that you can assume from their mannerism, upon their entrance into the office. Do not provide any other information, such as their background, motivation, or situation. Here are some examples. Example 1: ‘A white couple in their 40s just walked into your office. They are visibly excited and ready to find their home.’  Example 2: ‘A woman in her mid-30s walks in. Her posture is confident but her eyes show uncertainty like she is hoping she is in the right place.’  Example 3: ‘An older man walks in calmly with his cane. He seems to be experienced with this process and seems very much at peace.’ Don’t go overboard with the language. Keep it succinct and under 25 words.
      - The 'tasks': Provide 10 tasks based on the transcript of the video. The order of tasks should align with the talking points from the video transcript. Tasks must focus on early-stage skills such as greeting, rapport-building, tone, body language awareness and setting expectations. The tasks should cover the very beginning of the consultation up to and including the topic about the buyer’s desired location in the transcript. Each task needs to be followed by a suggested script. Here are some examples. Strictly follow the following format. Do not include separate titles. Example 1: Greet the clients. Show appreciation for them coming in. Tell them a little about the brokerage and the team. You can say something like, “Thank you for coming in. Let me share with you the team’s mission. The mission of the team is to help you achieve your goals and exceed your expectations…”. Example 2: Pitch yourself. Share something about yourself that would make the clients feel they want to work with you and nobody else. You could start with, “My team and I have helped over 300 families find their dream home…”. Example 3: Ask the client their preferred method of communication. This establishes how you communicate with the clients in the future. You could say, “So first, let’s start with your contact information, email and phone number. Alright, now that I have your information, who would you like to be the main contact…”. Don’t go beyond the scope of the transcript. Keep the language simple and concise, no more than 50 words.
    `;

    console.log('transcript', transcript.substring(0, 5000));

    const response = await model.invoke([
      new SystemMessage(systemPrompt),
      new HumanMessage(
        `Here is the video transcript: \n\n ${transcript.substring(0, 5000)}`
      ),
    ]);

    let jsonString = response.content.toString();
    jsonString = jsonString
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    const aiData = JSON.parse(jsonString);

    console.log(aiData);

    const newScenario = new Scenario({
      title: aiData.title,
      description: aiData.description,
      videoSourceUrl: url,
      transcript: transcript,
      context: aiData.context,
      tasks: aiData.tasks,
    });

    await newScenario.save();
    console.log(`   🎉 Saved successfully: "${newScenario.title}"`);
  } catch (error) {
    console.error(`   ❌ Failed to process ${url}:`, error);
  }
};

// --- MAIN RUNNER ---
const runImport = async () => {
  if (!mongoUri) {
    console.error('❌ Missing MONGODB_URI');
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('🔌 Connected to DB.');

    const chatModel = new ChatOpenAI({
      modelName: 'gpt-5-nano',
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    for (const url of VIDEO_URLS) {
      await processVideo(url, chatModel);
    }

    console.log('\n🏁 All done!');
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Script Error:', error);
    process.exit(1);
  }
};

runImport();
