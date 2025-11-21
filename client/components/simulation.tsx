import { useState, useRef, useEffect } from 'react';
import { Turns } from '../App';

interface SimulationProps {
  submitInput: (userInput: string) => Promise<void>;
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  turns: Turns[];
  mode: string;
  setMode: React.Dispatch<React.SetStateAction<string>>;
}

export default function Simulation({ submitInput, turns }: SimulationProps) {
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [turns]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    submitInput(input);
    setInput('');
  };

  return (
    <div className='flex flex-col h-screen max-w-4xl mx-auto p-4'>
      <div className='bg-white shadow-md rounded-xl p-4 mb-4 border border-teal-100 text-center'>
        <h2 className='text-2xl font-bold text-teal-800'>
          Roleplay Simulation
        </h2>
        <p className='text-gray-600'>Negotiate freely with the client.</p>
      </div>

      <div className='flex-1 overflow-y-auto mb-4 bg-white rounded-xl shadow-inner p-6 border border-gray-200'>
        {turns.map((t, index) => (
          <div
            key={index}
            className={`flex w-full mb-4 ${
              t.turn === 'agent' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[70%] p-4 rounded-2xl ${
                t.turn === 'agent'
                  ? 'bg-teal-600 text-white rounded-br-none'
                  : 'bg-gray-100 text-gray-800 rounded-bl-none'
              }`}
            >
              <p className='text-sm font-bold mb-1 opacity-80'>
                {t.turn === 'agent' ? 'You (Agent)' : 'Client'}
              </p>
              <p>{t.text}</p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className='flex gap-2'>
        <input
          type='text'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='Type your message...'
          className='flex-1 border border-gray-300 p-4 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none'
        />
        <button
          type='submit'
          className='bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-6 rounded-xl transition duration-200'
        >
          Send
        </button>
      </form>
    </div>
  );
}
