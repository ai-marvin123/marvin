import Guided from '../components/guidedLesson';
import Simulation from '../components/simulation';
import { Turns } from '../App';

interface LessonProps {
  submitInput: (userInput: string) => Promise<void>;
  mode: string;
  setMode: React.Dispatch<React.SetStateAction<string>>;
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  turns: Turns[];
}
export default function Lesson({
  submitInput,
  mode,
  step,
  setStep,
  turns,
  setMode,
}: LessonProps) {
  let display;
  if (mode === 'script') {
    display = <Guided />;
  } else if (mode === 'simulation') {
    display = (
      <Simulation
        submitInput={submitInput}
        step={step}
        setStep={setStep}
        turns={turns}
        mode={mode}
        setMode={setMode}
      />
    );
  } else {
    display = (
      <>
        <h1>Feedback on your performance</h1>
      </>
    );
  }

  return <>{display}</>;
}
