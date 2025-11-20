import { useState, useEffect } from 'react';
import { Routes, Route, useParams } from 'react-router-dom';
import GuidedLesson from '../components/guidedLesson';
import Simulation from '../components/simulation';

export default function Lesson({ sessionId }: { sessionId: string }) {
  const { id } = useParams();

  const [aiData, setAiData] = useState<any>(null);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/scenarios/${id}`
        );

        if (!response.ok) throw new Error('Failed to fetch scenario');

        const data = await response.json();

        setAiData({
          id: data._id,
          title: data.title,
          personality: 'Client Persona',
          context: data.context,
          script: data.tasks,
        });
      } catch (error) {
        console.error('Error fetching lesson:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading)
    return <div className='p-10 text-center'>Loading scenario...</div>;
  if (!aiData)
    return (
      <div className='p-10 text-center text-red-500'>Scenario not found</div>
    );

  return (
    <Routes>
      <Route
        index
        element={<GuidedLesson aiData={aiData} step={step} setStep={setStep} />}
      />

      <Route
        path='simulate'
        element={<Simulation sessionId={sessionId} aiData={aiData} />}
      />
    </Routes>
  );
}
