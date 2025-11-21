import { useState, useEffect } from 'react';
import { Routes, Route, useParams } from 'react-router-dom';
import GuidedLesson from '../components/guidedLesson';
import Simulation from '../components/simulation';
import { Turns, aiData } from '../App';

interface LessonProps {
  submitInput: (userInput: string) => Promise<void>;
  mode: string;
  setMode: React.Dispatch<React.SetStateAction<string>>;
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  turns: Turns[];
  aiData: aiData;
}
export default function Lesson({
  submitInput,
  mode,
  step,
  setStep,
  turns,
  setMode,
  aiData,
}: LessonProps) {
  console.log('step inside lesson', step);
  let display;
  if (mode === 'script') {
    display = (
      <GuidedLesson
        aiData={aiData}
        step={step}
        setStep={setStep}
        setMode={setMode}
      />
    );
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
  }

  return <>{display}</>;
}
