import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import {
    Upload,
    FileText,
    Eye,
    Settings,
    Zap,
    Trash2,
    ArrowRight,
    Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PDFPreview from './PDFPreview';
import PageSelector from './PageSelector';
import { ErrorList } from '@/components/ui/error-display';
import { SuccessDisplay } from '@/components/ui/success-display';
import { LoadingSpinner } from '@/components/ui/loading';
import { useApiError } from '@/hooks/useApiError';
import { PDFSelection } from '@/types/pdf';
import { cn } from '@/lib/utils';
import { useStudy } from '@/contexts/StudyContext';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface PDFUploadSectionProps {
    onSelectionComplete?: (data: {
        selections: PDFSelection[];
        files: File[];
    }) => void;
    className?: string;
}

const UPLOAD_LIMIT_MB =
    Number(import.meta.env.VITE_UPLOAD_LIMIT_MB) || 25;
const LARGE_FILE_NOTICE_MB = 100;

const PDFUploadSection: React.FC<PDFUploadSectionProps> = ({
    onSelectionComplete,
    className,
}) => {
    const { session, updateSession, clearSession } = useStudy();

    const [uploadedFiles, setUploadedFiles] = useState<File[]>(
        session.pdfFiles || [],
    );
    // Track pages for the first PDF if it's the only one, or handle simplified multi-pdf selection
    const [totalPages, setTotalPages] = useState<number>(0);
    const [selectedPages, setSelectedPages] = useState<number[]>([]);

    const [activeTab, setActiveTab] = useState<string>('load');

    useEffect(() => {
        // If we have files and NO selections, we might be adding more.
        // If we have files and selections, we are usually in sync/ready state.
        if (session.pdfFiles.length > 0 && session.pdfSelections.length > 0) {
            setActiveTab('sync');
        }
    }, [session.pdfFiles.length, session.pdfSelections.length]);
    const [isProcessing, setIsProcessing] = useState(false);

    const [success, setSuccess] = useState<string | null>(null);
    const [numQuestions, setNumQuestions] = useState<number>(
        session.numberOfQuestions || 5,
    );
    const [scanProgress, setScanProgress] = useState(0);
    const [topicText, setTopicText] = useState<string>('');
    const [previewFile, setPreviewFile] = useState<File | null>(null);

    const { errors, addError, clearErrors, clearError } = useApiError();

    useEffect(() => {
        if (uploadedFiles.length > 0 && scanProgress < 100) {
            const timer = setInterval(() => {
                setScanProgress((prev) =>
                    Math.min(prev + Math.random() * 20, 100),
                );
            }, 50);
            return () => clearInterval(timer);
        }
    }, [uploadedFiles, scanProgress]);

    // Sync back to context for persistence
    useEffect(() => {
        updateSession({
            pdfFiles: uploadedFiles,
            fileNames: uploadedFiles.map((f) => f.name),
            numberOfQuestions: numQuestions,
            // Selections are managed via handleProcessSelection/onSelectionComplete
        });
    }, [uploadedFiles, numQuestions]);

    const handleTopicSubmit = () => {
        if (!topicText.trim()) {
            addError({
                message: 'Please enter a topic or question.',
                type: 'validation',
            });
            return;
        }

        if (topicText.trim().length < 3) {
            addError({
                message: 'Topic must be at least 3 characters.',
                type: 'validation',
            });
            return;
        }

        clearErrors();

        // Create a virtual text file from the topic input
        const blob = new Blob([topicText], { type: 'text/plain' });
        const virtualFile = new File([blob], 'topic.txt', {
            type: 'text/plain',
        });

        setUploadedFiles([virtualFile]);
        setTotalPages(1);
        setSelectedPages([1]);
        setScanProgress(100);
        setTimeout(() => setActiveTab('sync'), 500);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        // Submit on Enter (without Shift for multi-line)
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleTopicSubmit();
        }
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        if (files.length === 0) return;

        const newFiles = [...uploadedFiles];
        const allowedTypes = [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/msword',
            'text/plain',
            'text/csv',
            'text/markdown',
            'image/png',
            'image/jpeg',
            'image/jpg',
        ];

        const maxSize = UPLOAD_LIMIT_MB * 1024 * 1024;
        
        for (const file of files) {
            if (newFiles.length >= 5) {
                addError({
                    message: 'Maximum 5 files allowed.',
                    type: 'validation',
                });
                break;
            }

            if (file.size > maxSize) {
                addError({
                    message: `File ${file.name} exceeds the ${UPLOAD_LIMIT_MB}MB limit.`,
                    type: 'validation',
                });
                continue;
            }

            if (!allowedTypes.includes(file.type)) {
                addError({
                    message: `File ${file.name} is an unsupported type.`,
                    type: 'validation',
                });
                continue;
            }

            newFiles.push(file);
        }

        clearErrors();
        setUploadedFiles(newFiles);
        setScanProgress(0);
        
        // Reset input value to allow selecting the same file again if removed
        event.target.value = '';
    };

    const removeFile = (index: number) => {
        const newFiles = [...uploadedFiles];
        newFiles.splice(index, 1);
        setUploadedFiles(newFiles);
        if (newFiles.length === 0) {
            setActiveTab('load');
        }
    };

    const handlePDFLoadSuccess = (numPages: number) => {
        setTotalPages(numPages);
        setSelectedPages(Array.from({ length: numPages }, (_, i) => i + 1));
    };

    const handlePageSelect = (pageNumber: number) => {
        setSelectedPages((prev) =>
            prev.includes(pageNumber)
                ? prev.filter((p) => p !== pageNumber)
                : [...prev, pageNumber].sort((a, b) => a - b),
        );
    };

    const handleProcessSelection = () => {
        if (uploadedFiles.length === 0) {
            addError({
                message: 'Select at least one document segment for ingestion.',
                type: 'validation',
            });
            return;
        }

        setIsProcessing(true);
        clearErrors();

        const selections: PDFSelection[] = uploadedFiles.map((f, idx) => ({
            selectedPages: idx === 0 && f.type === 'application/pdf' ? selectedPages : [1],
            selectedText: [],
            selectionType: 'pages',
            metadata: {
                totalPages: idx === 0 ? totalPages : 1,
                fileName: f.name,
                fileSize: f.size,
            },
            numberOfQuestions: numQuestions,
        }));

        setTimeout(() => {
            onSelectionComplete?.({ selections, files: uploadedFiles });
            setSuccess('Documents are ready. You can now generate study tools.');
            setIsProcessing(false);
        }, 1000);
    };

    const resetUpload = () => {
        setUploadedFiles([]);
        setTotalPages(0);
        setSelectedPages([]);
        setActiveTab('load');
        setSuccess(null);
        clearErrors();
        setNumQuestions(5);
        setScanProgress(0);
        setTopicText('');

        // Global clear as well
        clearSession();
    };

    return (
        <div className={cn('space-y-8 full-bleed sm:mx-auto px-0', className)}>
            {/* Error handling handled via toast in useApiError */}

            {success && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <SuccessDisplay
                        message={success}
                        onDismiss={() => setSuccess(null)}
                        actions={[
                            {
                                label: 'Reset Node',
                                onClick: resetUpload,
                                variant: 'outline',
                            },
                        ]}
                    />
                </motion.div>
            )}

            <div className="relative">
                <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                >
                     <TabsContent
                         key="load"
                         value="load"
                         className="m-0 outline-none"
                     >
                         <motion.div
                             initial={{ opacity: 0, y: 20 }}
                             animate={{ opacity: 1, y: 0 }}
                             transition={{ duration: 0.4 }}
                             className="space-y-10"
                         >
                             {/* Main Content - Two Column/Stacked Hybrid */}
                             <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
                                 {/* Primary: File Upload */}
                                 <motion.div
                                     initial={{ opacity: 0, x: -20 }}
                                     animate={{ opacity: 1, x: 0 }}
                                     transition={{ delay: 0.2 }}
                                     className="relative group"
                                 >
                                     <div className="relative bg-foreground/[0.02] border border-foreground/5 rounded-[24px] sm:rounded-[32px] p-5 sm:p-8 space-y-8 shadow-2xl transition-all duration-500 hover:border-primary/20">
                                         <div className="flex items-start justify-between">
                                             <div className="space-y-2">
                                                 <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-lg">
                                                     <Upload size={24} />
                                                 </div>
                                                 <h3 className="text-2xl font-black tracking-tight mt-4">
                                                     System <span className="text-primary italic">Files</span>
                                                 </h3>
                                                 <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                                                     {uploadedFiles.length}/5 Registered
                                                 </p>
                                             </div>
                                             <div className="text-right">
                                                 <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60">
                                                     Max Capacity
                                                 </span>
                                                 <div className="text-xl font-black italic">
                                                     {UPLOAD_LIMIT_MB}MB
                                                 </div>
                                             </div>
                                         </div>
 
                                         <input
                                             type="file"
                                             onChange={handleFileUpload}
                                             className="hidden"
                                             id="file-upload-redesign"
                                             multiple
                                             accept=".pdf,.docx,.doc,.txt,.csv,.md,.png,.jpg,.jpeg"
                                         />
                                         <label
                                             htmlFor="file-upload-redesign"
                                             className="block cursor-pointer group/label"
                                         >
                                             <div className="relative border-2 border-dashed border-foreground/10 group-hover/label:border-primary/40 rounded-[20px] sm:rounded-[28px] p-6 sm:p-10 text-center transition-all duration-500 bg-foreground/[0.01] group-hover/label:bg-primary/[0.03]">
                                                 <div className="space-y-6">
                                                     <div className="relative inline-block">
                                                         <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full opacity-0 group-hover/label:opacity-100 transition-opacity" />
                                                         <div className="relative w-16 h-16 mx-auto rounded-2xl border-2 border-dashed border-primary/40 flex items-center justify-center group-hover/label:scale-110 transition-all duration-500">
                                                             <Upload size={28} className="text-primary" />
                                                         </div>
                                                     </div>
                                                     <div className="space-y-2">
                                                         <p className="font-black text-xs uppercase tracking-[0.4em]">
                                                             {uploadedFiles.length > 0 ? 'Inject More Data' : 'Initialize Intake'}
                                                         </p>
                                                         <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest leading-relaxed">
                                                             Drag & Drop or Click to Browse System Metadata
                                                         </p>
                                                     </div>
                                                 </div>
                                             </div>
                                         </label>
 
                                         {uploadedFiles.length > 0 && scanProgress < 100 && (
                                             <div className="space-y-3 px-2">
                                                 <div className="flex justify-between items-center">
                                                     <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary animate-pulse flex items-center gap-2">
                                                         <Sparkles size={12} fill="currentColor" />
                                                         Analyzing Fragments...
                                                     </span>
                                                     <span className="text-xs font-black italic">{Math.round(scanProgress)}%</span>
                                                 </div>
                                                 <div className="w-full h-1.5 bg-foreground/5 rounded-full overflow-hidden">
                                                     <motion.div
                                                         className="h-full bg-primary"
                                                         initial={{ width: 0 }}
                                                         animate={{ width: `${scanProgress}%` }}
                                                     />
                                                 </div>
                                             </div>
                                         )}
 
                                         {uploadedFiles.length > 0 && (
                                             <div className="space-y-3 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
                                                 {uploadedFiles.map((file, idx) => (
                                                     <motion.div 
                                                        key={idx}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        className="flex items-center justify-between p-4 rounded-2xl bg-foreground/5 border border-transparent hover:border-primary/20 transition-all duration-300 group/file"
                                                    >
                                                         <div className="flex items-center gap-4 truncate">
                                                             <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 border border-primary/10">
                                                                <FileText size={18} />
                                                             </div>
                                                             <div className="flex flex-col truncate">
                                                                <span className="text-xs font-black truncate">{file.name}</span>
                                                                <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest">
                                                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                                                </span>
                                                             </div>
                                                         </div>
                                                         <button 
                                                             onClick={(e) => { e.preventDefault(); removeFile(idx); }}
                                                             className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 transition-all"
                                                         >
                                                             <Trash2 size={16} />
                                                         </button>
                                                     </motion.div>
                                                 ))}
                                             </div>
                                         )}
 
                                         {uploadedFiles.length > 0 && scanProgress === 100 && (
                                             <Button
                                                 onClick={() => setActiveTab('sync')}
                                                 className="w-full h-14 rounded-2xl bg-foreground text-background hover:bg-primary hover:text-white font-black text-xs uppercase tracking-[0.2em] transition-all duration-500 shadow-xl"
                                             >
                                                 Configure Parameters
                                                 <ArrowRight size={16} className="ml-2" />
                                             </Button>
                                         )}
                                     </div>
                                 </motion.div>
 
                                 {/* Secondary: Quick Topic Input */}
                                 <motion.div
                                     initial={{ opacity: 0, x: 20 }}
                                     animate={{ opacity: 1, x: 0 }}
                                     transition={{ delay: 0.3 }}
                                     className="relative group"
                                 >
                                     <div className="relative bg-foreground/[0.02] border border-foreground/5 rounded-[32px] p-8 space-y-8 shadow-2xl transition-all duration-500 hover:border-primary/20 h-full flex flex-col">
                                         <div className="flex items-start justify-between">
                                             <div className="space-y-2">
                                                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-lg">
                                                    <Zap size={24} fill="currentColor" />
                                                </div>
                                                <h3 className="text-2xl font-black tracking-tight mt-4">
                                                    Quick <span className="text-primary italic">Topic</span>
                                                </h3>
                                                 <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                                                     Immediate Synthesis
                                                 </p>
                                             </div>
                                         </div>
 
                                         <div className="flex-1 space-y-4">
                                             <textarea
                                                 value={topicText}
                                                 onChange={(e) => setTopicText(e.target.value)}
                                                 onKeyDown={handleKeyDown}
                                                 placeholder="E.g., The Industrial Revolution, Photosynthesis, Thermodynamics..."
                                                 className="w-full h-32 md:h-48 px-6 py-5 rounded-[24px] bg-foreground/5 border border-foreground/5 focus:border-primary/30 focus:outline-none focus:ring-0 transition-all duration-300 resize-none font-medium placeholder:text-muted-foreground/30 text-sm"
                                                 maxLength={500}
                                             />
                                             <div className="flex justify-between items-center px-2">
                                                 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">
                                                     {topicText.length} / 500
                                                 </span>
                                                 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">
                                                     Neural Prompt
                                                 </span>
                                             </div>
                                         </div>
 
                                         <Button
                                             onClick={handleTopicSubmit}
                                             disabled={!topicText.trim() || topicText.trim().length < 3}
                                        className="w-full h-14 rounded-2xl bg-primary text-white hover:bg-primary/90 font-black text-xs uppercase tracking-[0.2em] transition-all duration-500 shadow-xl disabled:opacity-30"
                                         >
                                             Execute Generation
                                             <Zap size={16} fill="currentColor" className="ml-2" />
                                         </Button>
                                     </div>
                                 </motion.div>
                             </div>
 
                             {/* Features Footer */}
                             <motion.div
                                 initial={{ opacity: 0 }}
                                 animate={{ opacity: 1 }}
                                 transition={{ delay: 0.5 }}
                                 className="grid grid-cols-2 md:grid-cols-4 gap-4 px-2"
                             >
                                 {[
                                     { label: 'Neural Link' },
                                     { label: 'Privacy Core' },
                                     { label: 'Deep Context' },
                                     { label: 'Fast Sync' },
                                 ].map((feature, idx) => (
                                     <div key={idx} className="flex items-center gap-3">
                                         <div className="h-1.5 w-1.5 rounded-full bg-primary/40" />
                                         <span className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40">
                                             {feature.label}
                                         </span>
                                     </div>
                                 ))}
                             </motion.div>
                         </motion.div>
                     </TabsContent>


                     <TabsContent
                         key="analyze"
                         value="analyze"
                         className="m-0 outline-none"
                     >
                         <motion.div
                             initial={{ opacity: 0, scale: 0.98 }}
                             animate={{ opacity: 1, scale: 1 }}
                             exit={{ opacity: 0, scale: 0.98 }}
                             className="space-y-8"
                         >
                             {uploadedFiles.length === 1 && uploadedFiles[0].type === 'application/pdf' && (
                                 <div className="bg-foreground/[0.02] border border-foreground/5 rounded-[32px] p-8 md:p-12 space-y-10 shadow-2xl overflow-hidden relative">
                                     <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                                        <Sparkles size={160} className="text-primary" />
                                     </div>

                                     <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative">
                                         <div className="space-y-2 text-center md:text-left">
                                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/60">
                                                Verification Layer
                                            </span>
                                             <h3 className="text-3xl font-black tracking-tight italic">
                                                 Scan <span className="text-primary not-italic">Mode</span>
                                             </h3>
                                             <p className="text-[11px] font-bold uppercase tracking-widest opacity-40">
                                                 Verifying Neural Fragments & OCR Integrity
                                             </p>
                                         </div>
                                         <Button
                                             variant="outline"
                                             onClick={() => setActiveTab('sync')}
                                             disabled={totalPages === 0}
                                             className="h-14 rounded-2xl font-black border-foreground/10 bg-card/40 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 gap-3 px-10 text-xs uppercase tracking-widest shadow-xl"
                                         >
                                             Next Phase
                                             <ArrowRight size={18} />
                                         </Button>
                                     </div>
 
                                     <div className="rounded-[28px] overflow-hidden border border-foreground/5 shadow-2xl bg-card/60 relative group min-h-[500px]">
                                         <div className="absolute inset-x-0 h-1 bg-primary/40 shadow-[0_0_20px_rgba(59,130,246,0.5)] top-0 animate-[scan_4s_ease-in-out_infinite] z-20 pointer-events-none" />
                                         <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5 opacity-50 pointer-events-none z-10" />
                                         <PDFPreview
                                             file={uploadedFiles[0]}
                                             onLoadSuccess={handlePDFLoadSuccess}
                                             onLoadError={(e) => addError(e)}
                                             selectedPages={selectedPages}
                                             onPageSelect={handlePageSelect}
                                             className="w-full opacity-90 group-hover:opacity-100 transition-opacity"
                                         />
                                     </div>
                                     
                                     <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                        {[
                                            { label: 'Pages', value: totalPages || '...' },
                                            { label: 'OCR Status', value: 'Active', color: 'text-primary' },
                                            { label: 'Density', value: 'Optimal' },
                                            { label: 'Integrity', value: '99.8%' },
                                        ].map((stat, i) => (
                                            <div key={i} className="p-6 rounded-2xl bg-foreground/5 border border-foreground/5 space-y-1">
                                                <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40">{stat.label}</p>
                                                <p className={cn("text-lg font-black italic", stat.color || "text-foreground")}>{stat.value}</p>
                                            </div>
                                        ))}
                                     </div>
                                 </div>
                             )}
                         </motion.div>
                     </TabsContent>


                     <TabsContent
                         key="sync"
                         value="sync"
                         className="m-0 outline-none"
                     >
                         <motion.div
                             initial={{ opacity: 0, y: 20 }}
                             animate={{ opacity: 1, y: 0 }}
                             exit={{ opacity: 0, y: -20 }}
                             className="flex flex-col gap-8"
                         >
                             {uploadedFiles.length === 1 &&
                                 uploadedFiles[0].type === 'application/pdf' && (
                                     <div className="bg-foreground/[0.02] border border-foreground/5 rounded-[32px] p-8">
                                         <PageSelector
                                             totalPages={totalPages}
                                             selectedPages={selectedPages}
                                             onSelectionChange={setSelectedPages}
                                             className="bg-transparent border-0 p-0 shadow-none"
                                         />
                                     </div>
                                 )}
 
                             <div className="relative bg-foreground/[0.02] border border-foreground/5 p-10 rounded-[32px] space-y-10 overflow-hidden shadow-2xl">
                                 <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                                     <Settings size={120} className="text-primary" />
                                 </div>

                                 <div className="relative">
                                     <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/60">
                                         Phase 02
                                     </span>
                                     <h3 className="text-3xl font-black tracking-tight mt-2 italic">
                                         Sync <span className="text-primary not-italic">Parameters</span>
                                     </h3>
                                     <p className="text-[11px] font-bold uppercase tracking-widest opacity-40 mt-1">
                                         Initialize Neural Extraction Weights
                                     </p>
                                 </div>
 
                                 <div className="space-y-8 relative">
                                     <div className="flex justify-between items-end">
                                         <Label className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">
                                             Extraction Density
                                         </Label>
                                         <div className="flex items-center gap-2">
                                             <span className="text-4xl font-black text-primary italic">
                                                 {numQuestions}
                                             </span>
                                             <span className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">
                                                 Units
                                             </span>
                                         </div>
                                     </div>
                                     <div className="relative pt-2">
                                         <input
                                             type="range"
                                             min={3}
                                             max={30}
                                             value={numQuestions}
                                             onChange={(e) =>
                                                 setNumQuestions(
                                                     parseInt(e.target.value),
                                                 )
                                             }
                                             className="w-full h-1.5 bg-foreground/5 rounded-full appearance-none cursor-pointer accent-primary"
                                         />
                                         <div className="flex justify-between mt-4 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/30">
                                             <span>Lean Dataset</span>
                                             <span>Dense Network</span>
                                         </div>
                                     </div>
                                 </div>
 
                                 <div className="p-8 rounded-[24px] bg-foreground/[0.03] border border-foreground/5 space-y-6">
                                     <div className="flex justify-between items-center text-sm">
                                         <span className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">
                                             Registry
                                         </span>
                                         <span className="text-sm font-black truncate max-w-[240px]">
                                             {uploadedFiles.length === 1 ? uploadedFiles[0].name : `${uploadedFiles.length} Records Detected`}
                                         </span>
                                     </div>
                                     <div className="flex justify-between items-center text-sm">
                                         <span className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">
                                             Data Blocks
                                         </span>
                                         <span className="text-sm font-black text-primary italic">
                                             {selectedPages.length || 1} Sync-Points
                                         </span>
                                     </div>
                                     <div className="h-1.5 w-full bg-foreground/5 rounded-full overflow-hidden mt-2">
                                         <motion.div
                                             className="h-full bg-primary"
                                             initial={{ width: 0 }}
                                             animate={{
                                                 width: `${(Math.max(selectedPages.length, 1) / Math.max(totalPages, 1)) * 100}%`,
                                             }}
                                         />
                                     </div>
                                 </div>
 
                                 <div className="flex flex-col gap-4 pt-4">
                                     <Button
                                         onClick={handleProcessSelection}
                                         disabled={
                                             isProcessing ||
                                             uploadedFiles.length === 0
                                         }
                                         className="w-full h-20 rounded-[28px] bg-primary hover:bg-primary/90 text-white font-black text-xl shadow-2xl transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] gap-4"
                                     >
                                         {isProcessing ? (
                                             <>
                                                 <LoadingSpinner size="sm" />
                                                 <span className="uppercase tracking-[0.2em]">Processing...</span>
                                             </>
                                         ) : (
                                             <>
                                                 <span className="uppercase tracking-[0.2em]">Activate Node</span>
                                                 <Zap size={24} fill="currentColor" />
                                             </>
                                         )}
                                     </Button>
 
                                     <Button
                                         variant="ghost"
                                         onClick={resetUpload}
                                         className="w-full h-12 font-black text-[10px] tracking-[0.4em] opacity-40 hover:opacity-100 hover:text-destructive hover:bg-destructive/5 transition-all uppercase"
                                     >
                                         <Trash2 size={14} className="mr-2" />
                                         Purge Selection
                                     </Button>
                                 </div>
                             </div>
                         </motion.div>
                     </TabsContent>

                </Tabs>
            </div>

            {/* Document Preview Modal */}
            <Dialog open={!!previewFile} onOpenChange={() => setPreviewFile(null)}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0 glass border-foreground/10 rounded-2xl">
                    <DialogHeader className="p-6 border-b border-foreground/5 shrink-0 bg-card/60 backdrop-blur-xl">
                        <DialogTitle className="flex items-center gap-3">
                            <FileText className="text-primary" />
                            <div className="flex flex-col">
                                <span className="text-lg font-bold truncate max-w-[300px] sm:max-w-md">
                                    {previewFile?.name}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    Document Preview
                                </span>
                            </div>
                        </DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 overflow-auto p-4 sm:p-6 bg-background/40">
                        {previewFile && (
                            <div className="w-full flex justify-center">
                                {previewFile.type.startsWith('image/') ? (
                                    <div className="relative group rounded-xl overflow-hidden shadow-2xl">
                                        <img 
                                            src={URL.createObjectURL(previewFile)} 
                                            alt={previewFile.name}
                                            className="max-w-full h-auto object-contain rounded-xl"
                                        />
                                        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                ) : previewFile.type === 'application/pdf' ? (
                                    <div className="w-full h-[600px] rounded-xl overflow-hidden shadow-2xl border border-foreground/5">
                                        <PDFPreview 
                                            file={previewFile}
                                            className="w-full h-full"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-full p-8 rounded-2xl border border-dashed border-foreground/10 flex flex-col items-center justify-center gap-4 text-center">
                                        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                                            <FileText size={40} className="text-primary" />
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="font-bold text-lg">Detailed Info</h4>
                                            <p className="text-sm text-muted-foreground max-w-xs">
                                                Full preview is not available for this file type, but it will be indexed for study tools.
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 w-full max-w-sm mt-4">
                                            <div className="p-4 rounded-xl bg-card/50 border border-foreground/5">
                                                <p className="text-[10px] font-bold uppercase opacity-40">Format</p>
                                                <p className="font-bold">{previewFile.name.split('.').pop()?.toUpperCase()}</p>
                                            </div>
                                            <div className="p-4 rounded-xl bg-card/50 border border-foreground/5">
                                                <p className="text-[10px] font-bold uppercase opacity-40">Size</p>
                                                <p className="font-bold">{(previewFile.size / (1024 * 1024)).toFixed(1)} MB</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            <style>{`
          @keyframes scan {
            0% { top: 0; opacity: 0; }
            5% { opacity: 1; }
            95% { opacity: 1; }
            100% { top: 100%; opacity: 0; }
          }
          .shadow-glow {
            box-shadow: 0 0 30px hsla(var(--primary)/0.4);
          }
        `}</style>
        </div>
    );
};

export default PDFUploadSection;
