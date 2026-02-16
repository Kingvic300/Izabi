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