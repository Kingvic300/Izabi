import React, { useState } from 'react';
import { QuizQuestion } from '../types';

interface QuizProps {
  questions: QuizQuestion[];
}

const Quiz: React.FC<QuizProps> = ({ questions }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (option: string) => {
    if (showFeedback) return;
    setSelectedAnswer(option);
  };

  const handleNext = () => {
    if (!selectedAnswer) return;

    if (selectedAnswer === currentQuestion.answer) {
      setScore(score + 1);
    }
    setShowFeedback(true);

    setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedAnswer(null);
            setShowFeedback(false);
        } else {
            setIsFinished(true);
        }
    }, 1500);
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setIsFinished(false);
    setShowFeedback(false);
  }

  if (isFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="text-center p-8 bg-primary/50 rounded-lg">
        <h2 className="text-3xl font-bold mb-4 text-white">Quiz Completed!</h2>
        <p className="text-xl text-light/80 mb-6">
          Your score: <span className="text-cyan font-bold">{score}</span> / {questions.length} ({percentage}%)
        </p>
        <button onClick={restartQuiz} className="bg-cyan hover:opacity-90 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105">
          Take Again
        </button>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return <div className="p-4 bg-primary/50 rounded-lg text-light/70">No quiz questions available.</div>
  }

  return (
    <div className="p-4 bg-primary/50 rounded-lg">
      <div className="mb-6">
        <p className="text-sm text-light/70">Question {currentQuestionIndex + 1} of {questions.length}</p>
        <h3 className="text-2xl font-semibold mt-2 text-white">{currentQuestion.question}</h3>
      </div>
      <div className="space-y-4">
        {currentQuestion.options.map((option, index) => {
            const isCorrect = option === currentQuestion.answer;
            const isSelected = option === selectedAnswer;
            
            let buttonClass = 'w-full text-left p-4 rounded-lg transition duration-200 border-2 border-white/20 hover:bg-white/10';
            if(showFeedback) {
                if(isCorrect) buttonClass = 'w-full text-left p-4 rounded-lg transition duration-200 border-2 bg-success/80 border-success text-white';
                else if (isSelected && !isCorrect) buttonClass = 'w-full text-left p-4 rounded-lg transition duration-200 border-2 bg-danger/80 border-danger text-white';
            } else if (isSelected) {
                buttonClass = 'w-full text-left p-4 rounded-lg transition duration-200 border-2 bg-cyan/50 border-cyan';
            }

          return (
            <button
              key={index}
              onClick={() => handleAnswerSelect(option)}
              disabled={showFeedback}
              className={buttonClass}
            >
              {option}
            </button>
          );
        })}
      </div>
      <button
        onClick={handleNext}
        disabled={!selectedAnswer || showFeedback}
        className="mt-8 bg-gradient-to-r from-highlight to-accent hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-lg transition-transform transform hover:scale-105"
      >
        {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
      </button>
    </div>
  );
};

export default Quiz;
