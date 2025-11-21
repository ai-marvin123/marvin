import { useState, useEffect } from 'react';
import Lesson from './controllers/lesson';

export interface Turns {
  turn: string;
  text: string;
}

export interface aiData {
  context: string;
  script: string[];
}

export default function App() {
  const [aiData, setAiData] = useState<aiData | null>(null);

  const [scenarioId] = useState<string>('691f4bcd93930601bbde6844');

  const [mode, setMode] = useState<string>('home');
  const [step, setStep] = useState<number>(0);
  const [simulationTurns, setSimulationTurns] = useState<Turns[]>([
    { turn: 'buyer', text: 'Hello' },
  ]);
  const [sessionId] = useState(() => crypto.randomUUID());
  const [feedback, setFeedback] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/scenarios/${scenarioId}`
        );

        if (!res.ok) throw new Error('Failed to fetch scenario');

        const data = await res.json();

        setAiData({
          context: data.context,
          script: data.tasks,
        });
      } catch (error) {
        console.error('Error loading scenario:', error);
      }
    };

    fetchData();
  }, [scenarioId]);

  const sendToBackEnd = async (userinput: string): Promise<void> => {
    setSimulationTurns((filled) => [
      ...filled,
      { turn: 'agent', text: userinput },
    ]);

    setStep(step + 1);

    if (step > 18) {
      setMode('feedback');
    }

    const postUrl = 'http://localhost:8080/api/chat/simulation';

    const response = await fetch(postUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId: sessionId,
        // scenarioId: scenarioId,
        message: userinput,
      }),
    });

    if (!response.ok) {
      throw new Error('something went wrong during POST request to the server');
    }
    const parsed = await response.json();
    setSimulationTurns((filled) => [
      ...filled,
      { turn: 'buyer', text: parsed.reply },
    ]);
  };

  const startHandler = (e: any) => {
    e.preventDefault();
    setMode('script');
  };

  if (!aiData) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <h1 className='text-2xl text-teal-800'>Loading Scenario...</h1>
      </div>
    );
  }

  let display;
  if (mode === 'home') {
    display = (
      <>
        <div className='homepage'>
          <header>
            <h1>Train like a top real estate agent!</h1>
            <h2>Client Communication & Relationship Skill Builder</h2>
          </header>
          <button className='startButton' onClick={startHandler}>
            Start
          </button>
        </div>
      </>
    );
  } else if (mode === 'script' || mode === 'simulation') {
    display = (
      <div className='lesson'>
        <Lesson
          submitInput={sendToBackEnd}
          mode={mode}
          setMode={setMode}
          step={step}
          setStep={setStep}
          turns={simulationTurns}
          aiData={aiData}
        />
      </div>
    );
  } else if (mode === 'feedback') {
    display = (
      <>
        <h1>Feedback on your performance</h1>
        <h2>{feedback}</h2>
      </>
    );
  }
  return (
    <>
      <div className='display'>{display}</div>
    </>
  );
}
