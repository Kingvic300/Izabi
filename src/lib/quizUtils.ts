import stringSimilarity from 'string-similarity';
import { Question } from '@/components/dashboard-home/types';
import { LOCAL_PRACTICE_QUESTION_BANK } from '@/constants/practiceQuestions';

export const shuffleArray = <T,>(items: T[]): T[] => {
    const shuffled = [...items];
    for (let i = shuffled.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

export const normalizePracticeQuestion = (
    question: Partial<Question>,
): Question | null => {
    const questionText =
        typeof question?.question === 'string' ? question.question.trim() : '';
    const answer = typeof question?.answer === 'string' ? question.answer : '';
    const options = Array.isArray(question?.options)
        ? question.options
              .map((option) =>
                  typeof option === 'string' ? option.trim() : '',
              )
              .filter(Boolean)
        : [];

    if (!questionText || !answer) return null;

    const optionsWithAnswer = options.includes(answer)
        ? options
        : [...options, answer];

    if (optionsWithAnswer.length < 2) return null;

    return {
        question: questionText,
        options: optionsWithAnswer,
        answer,
        difficulty: question?.difficulty || 'easy',
        questionType: question?.questionType || 'multiple_choice',
        explanation: question?.explanation,
    };
};

export const buildPracticeQuestionSet = (
    apiQuestions: Question[],
    count: number,
) => {
    const normalized = [...apiQuestions, ...LOCAL_PRACTICE_QUESTION_BANK]
        .map(normalizePracticeQuestion)
        .filter((question): question is Question => Boolean(question));

    const unique = Array.from(
        new Map(
            normalized.map((question) => [
                question.question.toLowerCase(),
                question,
            ]),
        ).values(),
    );

    return shuffleArray(unique)
        .slice(0, count)
        .map((question) => ({
            ...question,
            options: shuffleArray(question.options),
        }));
};

export const isMcqCorrect = (question: Question, userAnswer: string) => {
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

// Resolves the question's `answer` field to the actual option text it refers to,
// since `answer` may be stored as a letter ("A") instead of the option's full text.
export const resolveCorrectOptionText = (question: Question): string => {
    const answer = question.answer || '';
    const normalizedAnswer = answer.trim().toLowerCase();
    const isLetter = /^[a-d]$/.test(normalizedAnswer);

    if (isLetter && Array.isArray(question.options)) {
        const letterIndex = normalizedAnswer.charCodeAt(0) - 97;
        const targetOption = question.options[letterIndex];
        if (targetOption) return targetOption;
    }

    return answer;
};

export const isShortAnswerCorrect = (input: string, correctAnswer: string) =>
    stringSimilarity.compareTwoStrings(
        input.trim().toLowerCase(),
        correctAnswer.trim().toLowerCase(),
    ) > 0.7;

export const countWords = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).length;
};