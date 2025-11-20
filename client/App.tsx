import { useState } from 'react';

export default function App() {
  const [aiData, setAiData] = useState({ personality: '', script: [''] }); // data for guided lesson
  const [mode, setMode] = useState('home'); //home, script, simulation, feedback
  const [step, setStep] = useState(0); //keep track of lesson prompts. go up to 10 and reset when it reaches 10
  const [simulationTurns, setSimulationTurns] = useState([
    { turn: 'agent', text: '' },
  ]); //store user response from simulation for feedback
  const [sessionId] = useState(() => crypto.randomUUID());
  const sendToBackEnd = async (userinput) => {
    setSimulationTurns((filled) => [
      ...filled,
      { turn: 'user', text: userinput },
    ]);
    //send sessionID and userinput

    // fetch();
  };
  return (
    <>
      <h1>Train like a top real estate agent!</h1>
      <h2>Client Communication & Relationship Skill Builder</h2>
    </>
  );
}
