import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function GuidedLesson({ aiData, step, setStep }: any) {
  const navigate = useNavigate();

  const tasks = aiData.script;
  const totalTasks = tasks.length;

  const [userInput, setUserInput] = useState("");

  useEffect(() => {
    if (step >= totalTasks) {
      navigate(`/simulate/1`);
    }
  }, [step]);

  function handleSubmit(e: any) {
    e.preventDefault();
    if (!userInput.trim()) return;

    console.log(`Task ${step + 1} Answer:`, userInput);

    setUserInput("");
    setStep((prev: number) => prev + 1);
  }

  if (step >= totalTasks) return null;

  return (
    <div className="w-full max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-8 border text-center">

      <div className="text-center max-w-3xl mb-10">
        <h1 className="text-3xl font-bold mb-2">
          Buyer Consultation – Guided Practice
        </h1>

        <p className="text-lg opacity-80 mb-6">
          Practice client communication step-by-step.
        </p>

        <div className="bg-white shadow-md rounded-lg p-6 border">
          <h2 className="text-xl font-semibold">Client Personality</h2>
          <p className="opacity-80 mb-4">{aiData.personality}</p>

          <h2 className="text-xl font-semibold">Context</h2>
          <p className="opacity-80">{aiData.context}</p>
        </div>
      </div>

      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-8 border text-center">
        <h2 className="text-xl font-bold mb-3">
          Task {step + 1} of {totalTasks}
        </h2>

        <p className="mb-6 text-gray-800">{tasks[step]}</p>

        <form onSubmit={handleSubmit} className="flex gap-3 w-full">
          <input
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your response..."
            className="flex-1 border p-3 rounded-lg"
          />

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 transition text-white px-4 rounded-lg"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
