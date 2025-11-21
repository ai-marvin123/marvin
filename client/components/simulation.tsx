import { useState } from 'react';
import { Turns } from '../App';
interface SimulationProps {
  submitInput: (userInput: string) => Promise<void>;
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  turns: Turns[];
  mode: string;
  setMode: React.Dispatch<React.SetStateAction<string>>;
}

export default function Simulation({
  submitInput,
  turns,
  mode,
  step,
  setMode,
}: SimulationProps) {
  const [input, setInput] = useState<string>('');
  const lastTurn: string = turns.length
    ? turns[turns.length - 1].turn
    : 'buyer';
  let agentText: string = '';
  let buyerText: string = '';

  if (turns.length === 1) {
    buyerText = turns[0].text;
  }

  if (turns.length >= 2) {
    const lastTwo = turns.slice(-2);
    for (let i = 0; i < lastTwo.length; i++) {
      if (lastTwo[i].turn === 'agent') {
        agentText = lastTwo[i].text;
      } else if (lastTwo[i].turn === 'buyer') {
        buyerText = lastTwo[i].text;
      }
    }
  }

  return (
    <>
      <div className='speechContainer'>
        <div className='buyerBubble'>
          <p>Buyer: {buyerText ? buyerText : 'Loading...'}</p>
        </div>
        <div className='agentBubble'>
          <p>Agent: {agentText ? agentText : 'Loading...'}</p>
        </div>
        <div className='buyerChar'>🙎‍♀️</div>
        <div className='agentChar'>👨‍💼</div>
      </div>
      <form
        className='inputForm'
        onSubmit={(e) => {
          e.preventDefault();
          console.log('submitted!');
          submitInput(input);
          setInput('');
        }}
      >
        <input
          type='text'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={lastTurn === 'agent'}
        ></input>
        <button className='submitButton' type='submit'>
          Submit
        </button>
      </form>
    </>
  );
}
