import mongoose, { Schema, Document } from 'mongoose';

// 1. TypeScript Interface
// Defines the shape of a Scenario document for type safety in our code.
export interface IScenario extends Document {
  title: string;
  description: string;
  videoSourceUrl?: string;
  transcript: string;
  context: string; // Combined person profile & situation context
  tasks: string[]; // Array of tasks for the Practice Mode
  createdAt: Date;
  updatedAt: Date;
}

// 2. Mongoose Schema
// Defines the structure for MongoDB validation.
const ScenarioSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    videoSourceUrl: { type: String }, // Optional
    transcript: { type: String, default: '' },
    context: { type: String, required: true },
    tasks: [{ type: String, required: true }],

    // Timestamps automatically manage createdAt and updatedAt
  },
  { timestamps: true }
);

// Export the model
// Note: In NodeNext module resolution, we use default export for Mongoose models.
export default mongoose.model<IScenario>('Scenario', ScenarioSchema);
