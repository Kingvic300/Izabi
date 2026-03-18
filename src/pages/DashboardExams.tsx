'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { api } from '@/lib/apiClient';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useAppToast } from '@/hooks/useAppToast';
import type { Exam } from '@/types/api';
import ExamLobby from '@/components/dashboard-exams/ExamLobby';
import ExamView from '@/components/dashboard-exams/ExamView';
import ExamResult from '@/components/dashboard-exams/ExamResult';
import ExamReview from '@/components/dashboard-exams/ExamReview';

const DashboardExams = () => {
    const [view, setView] = useState<'lobby' | 'exam' | 'result' | 'review'>(
        'lobby',
    );
    const [activeTab, setActiveTab] = useState<
        'JAMB' | 'WAEC' | 'JUPEB' | 'UNIVERSITY'
    >('JAMB');
    const [exams, setExams] = useState<Exam[]>([]);
    const [loading, setLoading] = useState(false);
    const [isSimulating, setIsSimulating] = useState(false);
    const [isPracticing, setIsPracticing] = useState(false);

    // Exam State
    const [currentExam, setCurrentExam] = useState<Exam | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [visitedQuestions, setVisitedQuestions] = useState<number[]>([]);
    const [timeLeft, setTimeLeft] = useState(0);
    const [score, setScore] = useState(0);

    // Generation Form State
    const [simSubject, setSimSubject] = useState('');
    const [simUniName, setSimUniName] = useState('');
    const [simCourseTitle, setSimCourseTitle] = useState('');

    const [practiceSubject, setPracticeSubject] = useState('');
    const [practiceUniName, setPracticeUniName] = useState('');
    const [practiceCourseTitle, setPracticeCourseTitle] = useState('');

    // Note Practice State
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isNotePracticing, setIsNotePracticing] = useState(false);
    const [recentResults, setRecentResults] = useState<any[]>([]);
    const [selectedResult, setSelectedResult] = useState<any>(null);

    const containerRef = useRef<HTMLDivElement>(null);
    const appToast = useAppToast();

    useGSAP(() => {
        if (view === 'lobby') {
            gsap.from('.stagger-card', {
                y: 20,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: 'power2.out',
            });
        }
    }, [view]);

    // Resume Logic
    useEffect(() => {
        const savedExam = localStorage.getItem('active_exam');
        const savedView = localStorage.getItem('active_exam_view');
        const savedAnswers = localStorage.getItem('active_exam_answers');
        const savedIndex = localStorage.getItem('active_exam_index');
        const savedTime = localStorage.getItem('active_exam_time');
        const savedVisited = localStorage.getItem('active_exam_visited');

        if (savedExam && savedView === 'exam') {
            try {
                setCurrentExam(JSON.parse(savedExam));
                setView('exam');
                if (savedAnswers) setAnswers(JSON.parse(savedAnswers));
                if (savedIndex) {
                    const parsedIndex = parseInt(savedIndex, 10);
                    if (!Number.isNaN(parsedIndex)) {
                        setCurrentQuestionIndex(parsedIndex);
                    }
                }
                if (savedTime) setTimeLeft(parseInt(savedTime));
                if (savedVisited) {
                    const parsedVisited = JSON.parse(savedVisited);
                    if (Array.isArray(parsedVisited)) {
                        setVisitedQuestions(
                            parsedVisited.filter((v) => Number.isInteger(v)),
                        );
                    }
                }
            } catch (e) {
                console.error('Failed to restore exam', e);
            }
        }
    }, []);

    // Sync state to local storage
    useEffect(() => {
        if (view === 'exam' && currentExam) {
            localStorage.setItem('active_exam', JSON.stringify(currentExam));
            localStorage.setItem('active_exam_view', view);
            localStorage.setItem(
                'active_exam_answers',
                JSON.stringify(answers),
            );
            localStorage.setItem(
                'active_exam_index',
                currentQuestionIndex.toString(),
            );
            localStorage.setItem('active_exam_time', timeLeft.toString());
            localStorage.setItem(
                'active_exam_visited',
                JSON.stringify(visitedQuestions),
            );
        } else if (view === 'result' || view === 'lobby') {
            // Don't clear if lobby but keep if navigating away?
            // Actually user implies "switch tab" so we keep it.
            // We only clear on 'result' (completion).
            if (view === 'result') {
                localStorage.removeItem('active_exam');
                localStorage.removeItem('active_exam_view');
                localStorage.removeItem('active_exam_answers');
                localStorage.removeItem('active_exam_index');
                localStorage.removeItem('active_exam_time');
                localStorage.removeItem('active_exam_visited');
            }
        }
    }, [
        view,
        currentExam,
        answers,
        currentQuestionIndex,
        timeLeft,
        visitedQuestions,
    ]);

    useEffect(() => {
        if (view !== 'exam' || !currentExam) return;
        setVisitedQuestions((prev) =>
            prev.includes(currentQuestionIndex)
                ? prev
                : [...prev, currentQuestionIndex],
        );
    }, [view, currentExam, currentQuestionIndex]);

    const fetchHistory = async () => {
        try {
            const res = await api.getQuizResults();
            const data = Array.isArray(res)
                ? res
                : res?.data && Array.isArray(res.data)
                  ? res.data
                  : [];
            setRecentResults(data.slice(0, 5)); // Show last 5
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const startSimulation = async () => {
        if (activeTab === 'UNIVERSITY' && (!simUniName || !simCourseTitle)) {
            appToast.error({
                title: 'Details Required',
                description: 'Please enter University and Course Title.',
            });
            return;
        }
        if (activeTab !== 'UNIVERSITY' && !simSubject) {
            appToast.error({
                title: 'Subject Required',
                description: 'Please enter a subject to start.',
            });
            return;
        }

        setIsSimulating(true);
        appToast.info({
            title: 'Preparing Simulation',
            description:
                'Generating your standard CBT exam paper. This might take up to 30 seconds.',
        });
        try {
            // Use the Simulation endpoint
            const exam = await api.getSimulation({
                category: activeTab,
                subject: activeTab === 'UNIVERSITY' ? undefined : simSubject,
                universityName:
                    activeTab === 'UNIVERSITY' ? simUniName : undefined,
                courseTitle:
                    activeTab === 'UNIVERSITY' ? simCourseTitle : undefined,
                count: 25, // Mini-Simulation for better reliability
            });
            setCurrentExam(exam);
            setTimeLeft(exam.duration * 60);
            setAnswers({});
            setVisitedQuestions([0]);
            setCurrentQuestionIndex(0);
            setView('exam');
            appToast.success({
                title: 'Exam Ready',
                description: 'Your simulation has loaded. Good luck!',
            });
        } catch (err: any) {
            appToast.error({
                title: 'Simulation Failed',
                description:
                    err.message ||
                    'Could not generate exam. AI nodes timed out.',
            });
        } finally {
            setIsSimulating(false);
        }
    };

    const startCustomExam = async () => {
        if (
            activeTab === 'UNIVERSITY' &&
            (!practiceUniName || !practiceCourseTitle)
        ) {
            appToast.error({
                title: 'Details Required',
                description: 'Please enter University and Course Title.',
            });
            return;
        }
        if (activeTab !== 'UNIVERSITY' && !practiceSubject) {
            appToast.error({
                title: 'Subject Required',
                description: 'Please enter a subject.',
            });
            return;
        }

        setIsPracticing(true);
        try {
            const config = {
                category: activeTab,
                subject:
                    activeTab === 'UNIVERSITY' ? undefined : practiceSubject,
                universityName:
                    activeTab === 'UNIVERSITY' ? practiceUniName : undefined,
                courseTitle:
                    activeTab === 'UNIVERSITY'
                        ? practiceCourseTitle
                        : undefined,
                count: 15, // Short practice
            };
            const exam = await api.generatePracticeExam(config);
            setCurrentExam(exam);
            setTimeLeft(exam.duration * 60);
            setAnswers({});
            setVisitedQuestions([0]);
            setCurrentQuestionIndex(0);
            setView('exam');
        } catch (err: any) {
            appToast.error({
                title: 'Generation Failed',
                description: err.message || 'Could not generate exam.',
            });
        } finally {
            setIsPracticing(false);
        }
    };

    const handleAnswer = (option: string) => {
        setAnswers((prev) => ({ ...prev, [currentQuestionIndex]: option }));
    };

    const startNotePractice = async () => {
        if (!selectedFile) {
            appToast.error({
                title: 'No File',
                description: 'Please upload your notes (PDF) first.',
            });
            return;
        }

        setIsNotePracticing(true);
        appToast.info({
            title: 'Scanning Notes',
            description:
                'Our AI is reading your notes to create a custom exam paper.',
        });

        try {
            // First ingest the file
            const res = await api.ingestDirect(selectedFile, 'practice-exam');
            const jobId = res.jobId;

            // Poll for completion
            let status = 'PENDING';
            let examData = null;

            while (status !== 'COMPLETED' && status !== 'FAILED') {
                await new Promise((r) => setTimeout(r, 2000));
                const job = await api.getJobStatus(jobId);
                status = job.status;
                if (status === 'COMPLETED') {
                    // Extract exam from job data if applicable,
                    // or request generation now that it's "ingested"
                    // For now, let's assume the backend generates it as the "result" of this specific job type
                    examData = job.result;
                }
            }

            if (status === 'FAILED' || !examData)
                throw new Error('Could not process notes.');

            setCurrentExam(examData);
            setTimeLeft(examData.duration * 60 || 1800);
            setAnswers({});
            setVisitedQuestions([0]);
            setCurrentQuestionIndex(0);
            setView('exam');
            appToast.success({
                title: 'Ready!',
                description: 'Exam generated from your notes. Good luck!',
            });
        } catch (err: any) {
            appToast.error({
                title: 'Note Practice Failed',
                description: err.message || 'Could not read notes.',
            });
        } finally {
            setIsNotePracticing(false);
        }
    };

    const submitExam = useCallback(async () => {
        if (!currentExam) return;

        // Calculate Score
        let correct = 0;
        currentExam.questions.forEach((q, i) => {
            if (
                answers[i]?.trim().toLowerCase() ===
                    q.answer.trim().toLowerCase() ||
                answers[i]?.startsWith(q.answer.charAt(0))
            ) {
                // Handle "A) Option" vs "A"
                correct++;
            }
        });

        setScore((correct / currentExam.questions.length) * 100);
        setView('result');

        try {
            await api.submitQuizResult({
                score: Math.round(
                    (correct / currentExam.questions.length) * 100,
                ),
                totalQuestions: currentExam.questions.length,
                correctAnswers: correct,
                subject: currentExam.subject,
                date: new Date().toISOString(),
            });
        } catch (err) {
            console.error('Failed to save result', err);
        }
    }, [currentExam, answers]);

    // Timer - must come AFTER submitExam is declared
    useEffect(() => {
        if (view === 'exam' && timeLeft > 0) {
            const timer = setInterval(
                () => setTimeLeft((prev) => prev - 1),
                1000,
            );
            return () => clearInterval(timer);
        } else if (view === 'exam' && timeLeft === 0) {
            submitExam();
        }
    }, [view, timeLeft, submitExam]);

    return (
        <div
            ref={containerRef}
            className="min-h-screen w-full px-4 sm:px-6 md:px-8 lg:px-10 py-6 sm:py-10 pb-24 sm:pb-32 bg-background"
        >
            <ErrorBoundary>
                <AnimatePresence mode="wait">
                    {view === 'lobby' && (
                        <motion.div
                            key="lobby"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <div className="space-y-6">
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 glass rounded-xl border border-foreground/10">
                                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-primary">
                                        Exams
                                    </span>
                                </div>
                              

                                <div className="glass-card border-foreground/10 rounded-[32px] p-4 sm:p-6">
                                    <ExamLobby
                                        activeTab={activeTab}
                                        onTabChange={setActiveTab}
                                        showResume={
                                            typeof window !== 'undefined' &&
                                            Boolean(
                                                localStorage.getItem(
                                                    'active_exam',
                                                ),
                                            )
                                        }
                                        onResume={() => setView('exam')}
                                        simSubject={simSubject}
                                        simUniName={simUniName}
                                        simCourseTitle={simCourseTitle}
                                        onSimSubjectChange={setSimSubject}
                                        onSimUniNameChange={setSimUniName}
                                        onSimCourseTitleChange={
                                            setSimCourseTitle
                                        }
                                        onStartSimulation={startSimulation}
                                        isSimulating={isSimulating}
                                        selectedFile={selectedFile}
                                        onSelectFile={setSelectedFile}
                                        onStartNotePractice={startNotePractice}
                                        isNotePracticing={isNotePracticing}
                                        recentResults={recentResults}
                                        onSelectResult={(result) => {
                                            setSelectedResult(result);
                                            setView('review');
                                        }}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}
                    {view === 'exam' && (
                        <motion.div
                            key="exam"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <ExamView
                                activeTab={activeTab}
                                currentExam={currentExam}
                                currentQuestionIndex={currentQuestionIndex}
                                answers={answers}
                                visitedQuestions={visitedQuestions}
                                timeLeft={timeLeft}
                                onAnswer={handleAnswer}
                                onNavigate={setCurrentQuestionIndex}
                                onPrev={() =>
                                    setCurrentQuestionIndex((prev) =>
                                        Math.max(0, prev - 1),
                                    )
                                }
                                onNext={() =>
                                    setCurrentQuestionIndex((prev) => prev + 1)
                                }
                                onSubmit={submitExam}
                            />
                        </motion.div>
                    )}
                    {view === 'result' && (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <ExamResult
                                score={score}
                                totalQuestions={
                                    currentExam?.questions.length || 0
                                }
                                onReturn={() => setView('lobby')}
                            />
                        </motion.div>
                    )}
                    {view === 'review' && (
                        <motion.div
                            key="review"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <ExamReview
                                result={selectedResult}
                                onBack={() => setView('lobby')}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </ErrorBoundary>
        </div>
    );
};

export default function DashboardExamsPage() {
    return (
        <ErrorBoundary>
            <DashboardExams />
        </ErrorBoundary>
    );
}
