import React, { useState } from 'react';
import { StudyMaterial as StudyMaterialType } from '../types';
import Quiz from './Quiz';

interface StudyMaterialProps {
  material: StudyMaterialType;
  onReset: () => void;
}

type View = 'summary' | 'quiz';

const StudyMaterial: React.FC<StudyMaterialProps> = ({ material, onReset }) => {
  const [view, setView] = useState<View>('summary');

  return (
    <div className="bg-secondary/30 backdrop-blur-xl p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-4xl mx-auto border border-white/10">
        <div className="flex justify-between items-start mb-6">
            <div>
                <h2 className="text-3xl font-bold text-white">Your Study Guide is Ready</h2>
                <p className="text-light/70">Here's what Izabi generated for you.</p>
            </div>
             <button
                onClick={onReset}
                className="bg-highlight hover:opacity-90 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
             >
                Upload New File
             </button>
        </div>

      <div className="flex border-b border-white/20 mb-6">
        <button
          onClick={() => setView('summary')}
          className={`px-6 py-3 font-semibold transition-colors duration-300 relative ${
            view === 'summary' ? 'text-cyan' : 'text-light/70 hover:text-white'
          }`}
        >
          Summary
          {view === 'summary' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan rounded-full"></span>}
        </button>
        <button
          onClick={() => setView('quiz')}
          className={`px-6 py-3 font-semibold transition-colors duration-300 relative ${
            view === 'quiz' ? 'text-cyan' : 'text-light/70 hover:text-white'
          }`}
        >
          Quiz
          {view === 'quiz' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan rounded-full"></span>}
        </button>
      </div>

      <div className="prose prose-invert max-w-none prose-p:text-light/90 prose-headings:text-white">
        {view === 'summary' && (
          <div className="p-4 bg-primary/50 rounded-lg">
            <h3 className="text-2xl font-bold mb-4">Contextual Summary</h3>
            <p className="whitespace-pre-wrap">{material.summary}</p>
          </div>
        )}
        {view === 'quiz' && (
          <div>
            <Quiz questions={material.quiz} />
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyMaterial;
