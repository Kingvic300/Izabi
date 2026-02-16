import type { ChartPoint, QuizResult, SubjectPoint } from './progressTypes';

export const demoChartData: ChartPoint[] = [
    { date: 'Day 1', score: 0 },
    { date: 'Day 2', score: 45 },
    { date: 'Day 3', score: 30 },
    { date: 'Day 4', score: 75 },
    { date: 'Day 5', score: 60 },
    { date: 'Day 6', score: 90 },
    { date: 'Day 7', score: 85 },
];

export const demoSubjectData: SubjectPoint[] = [
    { subject: 'Math', score: 70 },
    { subject: 'Physics', score: 85 },
    { subject: 'English', score: 60 },
    { subject: 'History', score: 95 },
];

export const hasMeaningfulQuizData = (quizData: QuizResult[]) =>
    quizData.length > 0 && quizData.some((q) => q.score > 0);

export const computeAverageScore = (quizData: QuizResult[]) =>
    quizData.length > 0
        ? Math.round(
              quizData.reduce((acc, q) => acc + q.score, 0) / quizData.length,
          )
        : 0;

export const buildChartData = (quizData: QuizResult[]): ChartPoint[] =>
    quizData
        .slice(0, 7)
        .reverse()
        .map((q) => ({
            date: new Date(q.createdAt || q.date || Date.now()).toLocaleDateString(
                undefined,
                {
                    month: 'short',
                    day: 'numeric',
                },
            ),
            score: q.score,
        }));

export const buildSubjectData = (quizData: QuizResult[]): SubjectPoint[] => {
    const subjects: Record<string, { total: number; count: number }> = {};

    quizData.forEach((q) => {
        const subject = q.subject || q.quizTitle || 'General';
        if (!subjects[subject]) {
            subjects[subject] = { total: 0, count: 0 };
        }
        subjects[subject].total += q.score;
        subjects[subject].count += 1;
    });

    return Object.keys(subjects).map((subject) => ({
        subject,
        score: Math.round(subjects[subject].total / subjects[subject].count),
    }));
};
