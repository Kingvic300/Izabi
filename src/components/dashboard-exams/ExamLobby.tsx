import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronRight, FileText, Loader2, Play, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { PageHeader, SectionTitle } from '@/components/dashboard/PageHeader';
type ExamTab = 'JAMB' | 'WAEC' | 'JUPEB' | 'UNIVERSITY';

type ExamLobbyProps = {
    activeTab: ExamTab;
    onTabChange: (tab: ExamTab) => void;
    showResume: boolean;
    onResume: () => void;
    simSubject: string;
    simUniName: string;
    simCourseTitle: string;
    onSimSubjectChange: (value: string) => void;
    onSimUniNameChange: (value: string) => void;
    onSimCourseTitleChange: (value: string) => void;
    onStartSimulation: () => void;
    isSimulating: boolean;
    selectedFile: File | null;
    onSelectFile: (file: File | null) => void;
    onStartNotePractice: () => void;
    isNotePracticing: boolean;
    recentResults: any[];
    onSelectResult: (result: any) => void;
};

export default function ExamLobby({
    activeTab,
    onTabChange,
    showResume,
    onResume,
    simSubject,
    simUniName,
    simCourseTitle,
    onSimSubjectChange,
    onSimUniNameChange,
    onSimCourseTitleChange,
    onStartSimulation,
    isSimulating,
    selectedFile,
    onSelectFile,
    onStartNotePractice,
    isNotePracticing,
    recentResults,
    onSelectResult,
}: ExamLobbyProps) {
    const { t } = useLanguage();
    const tabs = ['JAMB', 'WAEC', 'JUPEB', 'UNIVERSITY'] as const;
    return (
        <div className="w-full space-y-10 pb-16">
            <PageHeader
                title="Exams"
                description={t('exams.subtitle')}
                actions={
                    <div
                        role="tablist"
                        aria-label="Exam type"
                        className="no-scrollbar flex max-w-full overflow-x-auto rounded-md bg-muted p-1"
                    >
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                role="tab"
                                aria-selected={activeTab === tab}
                                onClick={() => onTabChange(tab)}
                                className={cn(
                                    'whitespace-nowrap rounded-[5px] px-4 py-2 text-sm font-bold transition-colors',
                                    activeTab === tab
                                        ? 'bg-card text-foreground shadow-soft'
                                        : 'text-muted-foreground hover:text-foreground',
                                )}
                            >
                                {tab === 'UNIVERSITY' ? 'University' : tab}
                            </button>
                        ))}
                    </div>
                }
            />

            {showResume && (
                <div className="flex flex-col gap-4 rounded-lg border border-border border-l-4 border-l-highlight bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="font-bold">{t('exams.ongoing_session')}</p>
                        <p className="text-sm text-muted-foreground">
                            {t('exams.ready_to_resume')}
                        </p>
                    </div>
                    <Button onClick={onResume}>
                        <Play className="fill-current" />
                        {t('exams.resume_now')}
                    </Button>
                </div>
            )}

            <div className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-border bg-border lg:grid-cols-2">
                <section className="flex flex-col bg-card p-5 sm:p-7">
                    <h3 className="text-2xl">{t('exams.full_sim_top')}</h3>
                    <p className="mt-1 text-muted-foreground">
                        {t('exams.full_sim_desc')}
                    </p>
                    <div className="mt-6 flex-1 space-y-4">
                        {activeTab === 'UNIVERSITY' ? (
                            <>
                                <div className="space-y-1.5">
                                    <Label htmlFor="sim-uni" className="text-sm font-bold">
                                        {t('exams.university_label')}
                                    </Label>
                                    <Input
                                        id="sim-uni"
                                        placeholder={t('exams.university_placeholder')}
                                        value={simUniName}
                                        onChange={(e) => onSimUniNameChange(e.target.value)}
                                        className="h-11"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="sim-course" className="text-sm font-bold">
                                        {t('exams.course_title_label')}
                                    </Label>
                                    <Input
                                        id="sim-course"
                                        placeholder={t('exams.course_title_placeholder')}
                                        value={simCourseTitle}
                                        onChange={(e) => onSimCourseTitleChange(e.target.value)}
                                        className="h-11"
                                    />
                                </div>
                            </>
                        ) : (
                            <div className="space-y-1.5">
                                <Label htmlFor="sim-subject-input" className="text-sm font-bold">
                                    {t('exams.subject_label')}
                                </Label>
                                <Input
                                    id="sim-subject-input"
                                    type="text"
                                    placeholder={t('exams.subject_placeholder')}
                                    value={simSubject}
                                    onChange={(e) => onSimSubjectChange(e.target.value)}
                                    className="h-11"
                                />
                            </div>
                        )}
                    </div>
                    <Button
                        onClick={onStartSimulation}
                        disabled={isSimulating}
                        size="lg"
                        className="mt-6 self-start"
                    >
                        {isSimulating ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            t('exams.start_exam')
                        )}
                    </Button>
                </section>

                <section className="flex flex-col bg-card p-5 sm:p-7">
                    <h3 className="text-2xl">{t('exams.notes_top')}</h3>
                    <p className="mt-1 text-muted-foreground">
                        {t('exams.notes_desc')}
                    </p>
                    <label className="relative mt-6 flex flex-1 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-[1.5px] border-dashed border-sheet/45 px-4 py-8 text-center transition-colors hover:border-foreground/50 hover:bg-muted/40 focus-within:border-foreground">
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={(e) => onSelectFile(e.target.files?.[0] || null)}
                            className="sr-only"
                        />
                        {selectedFile ? (
                            <>
                                <FileText size={20} className="text-muted-foreground" />
                                <span className="max-w-full truncate font-bold">
                                    {selectedFile.name}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                    {t('exams.click_to_change')}
                                </span>
                            </>
                        ) : (
                            <>
                                <Upload size={20} className="text-muted-foreground" />
                                <span className="font-display text-lg">
                                    {t('exams.select_notes')}
                                </span>
                                <span className="text-sm text-muted-foreground">PDF only</span>
                            </>
                        )}
                    </label>
                    <Button
                        onClick={onStartNotePractice}
                        disabled={isNotePracticing || !selectedFile}
                        size="lg"
                        className="mt-6 self-start"
                    >
                        {isNotePracticing ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            t('exams.start_note_exam')
                        )}
                    </Button>
                </section>
            </div>

            <section>
                <SectionTitle
                    title={t('exams.recent_top')}
                    actions={
                        <Button asChild variant="link">
                            <Link to="/dashboard/history">{t('exams.historical_data')}</Link>
                        </Button>
                    }
                />
                {recentResults.length > 0 ? (
                    <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
                        {recentResults.map((res, i) => {
                            const resultDate = new Date(res.date || res.createdAt);
                            const correct =
                                res.correctAnswers ??
                                Math.round((res.score / 100) * res.totalQuestions);
                            return (
                                <li key={i}>
                                    <button
                                        onClick={() => onSelectResult(res)}
                                        className="group flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-muted/50"
                                    >
                                        <span className="tabular w-16 shrink-0 font-display text-2xl">
                                            {Math.round(res.score)}%
                                        </span>
                                        <span className="min-w-0 flex-1">
                                            <span className="block truncate font-bold">
                                                {res.subject || res.quizTitle}
                                            </span>
                                            <span className="tabular block text-sm text-muted-foreground">
                                                {Number.isNaN(resultDate.getTime())
                                                    ? '—'
                                                    : resultDate.toLocaleDateString()}
                                                , {correct} of {res.totalQuestions} correct
                                            </span>
                                        </span>
                                        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <div className="rounded-lg border border-dashed border-sheet/45 px-6 py-10">
                        <p className="font-display text-xl">{t('exams.archive_empty')}</p>
                        <p className="mt-1 text-muted-foreground">
                            {t('exams.archive_empty_desc')}
                        </p>
                    </div>
                )}
            </section>
        </div>
    );
}
