import { useState, useEffect } from 'react';
import Lesson from './controllers/lesson';

export interface Turns {
  turn: string;
  text: string;
}

export interface aiData {
  personality: string;
  context: string;
  script: string[];
}

export default function App() {
  const [aiData, setAiData] = useState<aiData>({
    personality:
      'A white couple in their late 30s walks in. They look relaxed, sharing a quiet smile.',
    context: 'You met them at an open house in Beverly Hills last week.',
    script: [
      'Greet the clients and set a warm tone.',
      'Build light rapport.',
      'Introduce yourself confidently.',
      'Introduce your team.',
      'Set a friendly, open tone.',
      'Use body language awareness.',
      'Ask for preferred communication method.',
      'Set expectations.',
      'Ask about reason for buying.',
      'Ask about desired location.',
    ],
  }); // data for guided lesson
  const [mode, setMode] = useState<string>('script'); //home, script, simulation, feedback
  const [step, setStep] = useState<number>(0); //keep track of lesson prompts. go up to 10 and reset when it reaches 10
  const [simulationTurns, setSimulationTurns] = useState<Turns[]>([
    { turn: 'buyer', text: 'Hello' },
  ]); //store user response from simulation for feedback
  const [sessionId] = useState(() => crypto.randomUUID());
  const [feedback, setFeedback] = useState<string>('');
  console.log('step insde app', step);
  // ****************************** //
  // ** fetch aiData from server ** //
  // ****************************** //

  // useEffect(() => {
  //   const fetchAiData = async () => {
  //     const getDataUrl = 'http://localhost:8080/api/scenarios/_id';
  //     const response = await fetch(getDataUrl);
  //     if (!response.ok) {
  //       throw new Error('could not fetch AI Data');
  //     }
  //     const parsed = await response.json();
  //     setAiData(parsed);
  //     fetchAiData();
  //   };
  // }, []);

  // ******************************************* //
  // ** onSubmit function for simulation mode ** //
  // ******************************************* //

  const sendToBackEnd = async (userinput: string): Promise<void> => {
    setSimulationTurns((filled) => [
      ...filled,
      { turn: 'agent', text: userinput },
    ]);

    //increment step
    setStep(step + 1);
    if (step > 18) {
      setMode('feedback');
    }

    const postUrl = 'http://localhost:8080/api/chat/simulation';

    //send sessionID and userinput to server
    const response = await fetch(postUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId: sessionId,
        message: userinput,
      }),
    });
    if (!response.ok) {
      throw new Error('something went wrong during POST request to the server');
    }
    const parsed = await response.json();
    //add reponse to the log
    setSimulationTurns((filled) => [
      ...filled,
      { turn: 'buyer', text: parsed.reply },
    ]);
  };

  // ******************************************* //
  // ** fetch first line for simulation mode ** //
  // ******************************************* //

  // useEffect(() => {
  //   if (mode === 'simulation' && simulationTurns.length === 0) {
  //     const startSimulationChat = async () => {
  //       const getLineUrl = 'http://localhost:8080/api/chat/_id';
  //       const response = await fetch(getLineUrl);
  //       if (!response.ok) {
  //         throw new Error('could not fetch first line for simulation chat');
  //       }
  //       const parsed = await response.json();
  //       setSimulationTurns((filled) => [
  //         ...filled,
  //         { turn: 'buyer', text: parsed.reply },
  //       ]);
  //     };
  //     startSimulationChat();
  //   }
  // }, [mode]);

  //   //logic for switching to simulation
  //   if (step > 9) {
  //     setMode('simulation');
  //     setStep(0);
  //   }

  let display;
  if (mode === 'script') {
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
      <header>
        <h1>Train like a top real estate agent!</h1>
        <h2>Client Communication & Relationship Skill Builder</h2>
      </header>
      <div className='display'>{display}</div>
    </>
  );
}
