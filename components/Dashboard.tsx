import React, { useState } from 'react';
import { StudyMaterial as StudyMaterialType } from '../types';
import FileUpload from './FileUpload';
import StudyMaterial from './StudyMaterial';
import Spinner from './Spinner';
import { generateStudyMaterial } from '../services/api';

interface DashboardProps {
  token: string;
}

const Dashboard: React.FC<DashboardProps> = ({ token }) => {
  const [studyMaterial, setStudyMaterial] = useState<StudyMaterialType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    setError(null);
    setStudyMaterial(null);
    try {
      const data = await generateStudyMaterial(file, token);
      setStudyMaterial(data);
    } catch (err: any) {
      setError(err.message || 'Failed to generate study material.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReset = () => {
    setStudyMaterial(null);
    setError(null);
    setIsLoading(false);
  }

  return (
    <main className="container mx-auto p-4 md:p-8">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-96 bg-secondary/30 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10">
          <Spinner size="lg" text="Izabi is thinking... Please wait."/>
        </div>
      ) : error ? (
        <div className="text-center p-8 bg-danger/20 backdrop-blur-xl rounded-lg border border-danger">
          <h2 className="text-2xl text-red-300 mb-4">An Error Occurred</h2>
          <p className="text-red-200 mb-6">{error}</p>
          <button onClick={handleReset} className="bg-cyan hover:opacity-90 text-white font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105">
            Try Again
          </button>
        </div>
      ) : studyMaterial ? (
        <StudyMaterial material={studyMaterial} onReset={handleReset} />
      ) : (
        <FileUpload onFileUpload={handleFileUpload} />
      )}
    </main>
  );
};

export default Dashboard;