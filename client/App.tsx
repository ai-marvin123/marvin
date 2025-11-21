import { useState, useEffect } from 'react';
import Lesson from './controllers/lesson';

export interface Turns {
  turn: string;
  text: string;
}

export interface aiData {
  personality: string;
  script: string[];
}

export default function App() {
  const [aiData, setAiData] = useState<aiData>({
    personality: '',
    script: [''],
  }); // data for guided lesson
  const [mode, setMode] = useState<string>('simulation'); //home, script, simulation, feedback
  const [step, setStep] = useState<number>(0); //keep track of lesson prompts. go up to 10 and reset when it reaches 10
  const [simulationTurns, setSimulationTurns] = useState<Turns[]>([
    { turn: 'buyer', text: 'buyer' },
    { turn: 'agent', text: 'agent.' },
    { turn: 'buyer', text: 'buyer2' },
  ]); //store user response from simulation for feedback
  const [sessionId] = useState(() => crypto.randomUUID());

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

    if (step > 9) {
      setMode('feedback');
      setStep(0);
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

  useEffect(() => {
    if (mode === 'simulation' && simulationTurns.length === 0) {
      const startSimulationChat = async () => {
        const getLineUrl = 'http://localhost:8080/api/chat/_id';
        const response = await fetch(getLineUrl);
        if (!response.ok) {
          throw new Error('could not fetch first line for simulation chat');
        }
        const parsed = await response.json();
        setSimulationTurns((filled) => [
          ...filled,
          { turn: 'buyer', text: parsed.reply },
        ]);
      };
      startSimulationChat();
    }
  }, [mode]);

  //   //logic for switching to simulation
  //   if (step > 9) {
  //     setMode('simulation');
  //     setStep(0);
  //   }

  return (
    <>
      <header>
        <h1>Train like a top real estate agent!</h1>
        <h2>Client Communication & Relationship Skill Builder</h2>
      </header>
      <div className='lesson'>
        <Lesson
          submitInput={sendToBackEnd}
          mode={mode}
          setMode={setMode}
          step={step}
          setStep={setStep}
          turns={simulationTurns}
        />
      </div>
    </>
  );
}
