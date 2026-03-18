import { useState, useMemo } from 'react';
import { Question } from '@/components/dashboard-home/types';
import { shuffleArray, isShortAnswerCorrect } from '@/lib/quizUtils';

const isMcqCorrect = (question: Question, userAnswer: string) => {
    const normalizedUser = (userAnswer || '').trim().toLowerCase();
    const normalizedAnswer = (question.answer || '').trim().toLowerCase();

    // Direct text match (case/whitespace agnostic)
    if (normalizedUser && normalizedUser === normalizedAnswer) return true;

    // Letter-based answers (e.g., "A", "b")
    const isLetter = (val: string) => /^[a-d]$/.test(val);
    if (isLetter(normalizedAnswer) && Array.isArray(question.options)) {
        const letterIndex = normalizedAnswer.charCodeAt(0) - 97;
        const targetOption = question.options[letterIndex];
        if (targetOption) {
            const normalizedTarget = targetOption.trim().toLowerCase();
            if (normalizedUser === normalizedTarget) return true;
        }
        if (isLetter(normalizedUser)) {
            return normalizedUser === normalizedAnswer;
        }
    }

    // User picked a letter but answer is full text
    if (isLetter(normalizedUser) && Array.isArray(question.options)) {
        const letterIndex = normalizedUser.charCodeAt(0) - 97;
        const pickedOption = question.options[letterIndex];
        if (pickedOption) {
            const normalizedPicked = pickedOption.trim().toLowerCase();
            if (normalizedPicked === normalizedAnswer) return true;
        }
    }

    return false;
};

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
