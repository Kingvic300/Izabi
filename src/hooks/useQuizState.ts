import { useState, useMemo } from 'react';
import { Question } from '@/components/dashboard-home/types';
import { shuffleArray, isShortAnswerCorrect, isMcqCorrect } from '@/lib/quizUtils';

export const useQuizState = (
    questions: Question[],
    shuffleEnabled: boolean,
    quizStyle: string,
) => {
    const [selectedAnswers, setSelectedAnswers] = useState<{
        [key: number]: string;
    }>({});
    const [showResults, setShowResults] = useState(false);

    const filteredQuestions = useMemo(() => {
        if (quizStyle === 'mcq') {
            return questions.filter(
                (q) => q.questionType?.toLowerCase() !== 'short_answer',
            );
        }
        if (quizStyle === 'short') {
            return questions.filter(
                (q) => q.questionType?.toLowerCase() === 'short_answer',
            );
        }
        return questions;
    }, [questions, quizStyle]);

    const displayQuestions = useMemo(
        () => (shuffleEnabled ? shuffleArray(filteredQuestions) : filteredQuestions),
        [filteredQuestions, shuffleEnabled],
    );

    const answeredCount = useMemo(
        () =>
            displayQuestions.reduce(
                (acc, _q, idx) => (selectedAnswers[idx] ? acc + 1 : acc),
                0,
            ),
        [displayQuestions, selectedAnswers],
    );

    const scoreQuiz = () =>
        displayQuestions.reduce((acc, q, i) => {
            const userAnswer = selectedAnswers[i];
            if (!userAnswer) return acc;
            if (q.questionType?.toLowerCase() === 'short_answer') {
                return (
                    acc +
                    (isShortAnswerCorrect(userAnswer, q.answer || '') ? 1 : 0)
                );
            }
            return acc + (isMcqCorrect(q, userAnswer) ? 1 : 0);
        }, 0);

    const handleAnswerSelect = (qIndex: number, option: string) => {
        if (!showResults)
            setSelectedAnswers((prev) => ({ ...prev, [qIndex]: option }));
    };

    const handleShortAnswerChange = (qIndex: number, value: string) => {
        if (!showResults)
            setSelectedAnswers((prev) => ({ ...prev, [qIndex]: value }));
    };

    const resetQuiz = () => {
        setSelectedAnswers({});
        setShowResults(false);
    };

    return {
        selectedAnswers,
        showResults,
        setShowResults,
        displayQuestions,
        answeredCount,
        scoreQuiz,
        handleAnswerSelect,
        handleShortAnswerChange,
        resetQuiz,
    };
};
