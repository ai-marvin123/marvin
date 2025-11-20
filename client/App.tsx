import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Lesson from './controllers/lesson';

export default function App() {
  const [sessionId] = useState(() => crypto.randomUUID());

  return (
    <BrowserRouter>
      <div className='p-6 min-h-screen bg-gray-50 text-gray-900 font-sans'>
        <header className='mb-8 pb-4 text-center'>
          <h1 className='text-2xl font-bold text-blue-700'>
            Train like a top Agent! 🏠
          </h1>
          <h2 className='text-gray-500'>
            Client Communication & Relationship Skill Builder
          </h2>
        </header>

        <Routes>
          <Route
            path='/'
            element={<Navigate to='/lesson/691f4bcd93930601bbde6844' />}
          />

          <Route
            path='/lesson/:id/*'
            element={<Lesson sessionId={sessionId} />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
