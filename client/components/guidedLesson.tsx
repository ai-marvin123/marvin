import { useState } from 'react';

interface GuidedLessonProps {
  aiData: any;
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  setMode: React.Dispatch<React.SetStateAction<string>>;
}

export default function GuidedLesson({
  aiData,
  step,
  setStep,
  setMode,
}: GuidedLessonProps) {
  const tasks = aiData.script;
  const totalTasks = tasks.length;

  const [userInput, setUserInput] = useState('');

  function handleSubmit(e: any) {
    e.preventDefault();
    if (!userInput.trim()) return;

    const nextStep = step + 1;

    if (nextStep >= totalTasks) {
      setMode('simulation');
      return;
    }

    setStep(nextStep);
    setUserInput('');
  }

  if (step >= totalTasks) return null;

  return (
    <div className='flex flex-col items-center justify-center min-h-screen w-full p-4'>
      <div className='w-full max-w-3xl text-center mb-8'>
        <h1 className='text-4xl font-bold mb-4 text-teal-800'>
          Buyer Consultation – Guided Practice
        </h1>
        <p className='text-lg text-gray-600 mb-6 relative'>
          Practice client communication step-by-step.
        </p>

        <div className='bg-white shadow-md rounded-xl p-6 border border-teal-100'>
          <h2 className='text-2xl font-semibold text-teal-700 mb-2'>
            Client Personality - Context
          </h2>
          <p className='text-gray-700 italic relative'>{aiData.context}</p>
        </div>
      </div>

      <div className='w-full max-w-3xl bg-white shadow-xl rounded-2xl p-8 border border-gray-200'>
        <div className='mb-6'>
          <span className='bg-teal-100 text-teal-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded'>
            Task {step + 1} of {totalTasks}
          </span>
          <h3 className='font-bold mt-2 text-gray-800'>{tasks[step]}</h3>
        </div>

        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder='Type your response here...'
            className='w-full border border-gray-300 p-4 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none min-h-[100px] text-gray-700'
          />

          <div className='flex justify-end'>
            <button
              type='submit'
              className='bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-6 rounded-lg transition duration-200 shadow-md'
            >
              Submit Response
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
