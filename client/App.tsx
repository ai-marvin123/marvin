import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GuidedLesson from "./components/guidedLesson";
import Simulation from "./components/simulation";

export default function App() {
  const [aiData, setAiData] = useState({
    personality: "", script: [""]
  });

  const [step, setStep] = useState(0);
  const [sessionId] = useState(() => crypto.randomUUID());

  return (
    <BrowserRouter>
      <div className="p-6">
        <h1 className="text-2xl font-bold">Train like a top real estate agent!</h1>
        <h2 className="opacity-80 mb-6">
          Client Communication & Relationship Skill Builder
        </h2>

        <Routes>
          <Route
            path="/lesson/:id"
            element={
              <GuidedLesson
                aiData={aiData}
                setAiData={setAiData}
                step={step}
                setStep={setStep}
                sessionId={sessionId}
              />
            }
          />

          <Route
            path="/simulate/:id"
            element={
              <Simulation
                aiData={aiData}
                step={step}
                setStep={setStep}
              />
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}