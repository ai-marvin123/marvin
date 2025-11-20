import { Routes, Route } from "react-router-dom";
import GuidedLesson from "../components/guidedLesson";
import Simulation from "../components/simulation";

export default function Lesson({
  aiData,
  setAiData,
  step,
  setStep,
  sessionId,
}) {
  return (
    <Routes>

      {/* PRACTICE (Guided Lesson) */}
      <Route
        index
        element={
          <GuidedLesson
            aiData={aiData}
            setAiData={setAiData}
            step={step}
            setStep={setStep}
          />
        }
      />

      {/* SIMULATION */}
      <Route
        path="simulate"
        element={
          <Simulation
            aiData={aiData}
            step={step}
            sessionId={sessionId}
          />
        }
      />
      
    </Routes>
  );
}