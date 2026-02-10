import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, FileText, Eye, Settings, ShieldCheck, Database, Zap, Binary, Trash2, ArrowRight } from 'lucide-react';
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

interface PDFUploadSectionProps {
  onSelectionComplete?: (data: { selection: PDFSelection; file: File }) => void;
  className?: string;
}

const PDFUploadSection: React.FC<PDFUploadSectionProps> = ({
  onSelectionComplete,
  className
}) => {
  const { session, updateSession, clearSession } = useStudy();

  const [uploadedFile, setUploadedFile] = useState<File | null>(session.pdfFile || null);
  const [totalPages, setTotalPages] = useState<number>(session.pdfSelection?.metadata?.totalPages || 0);
  const [selectedPages, setSelectedPages] = useState<number[]>(session.pdfSelection?.selectedPages || []);
  const [activeTab, setActiveTab] = useState<string>(session.pdfFile ? 'sync' : 'load');
  const [isProcessing, setIsProcessing] = useState(false);

  const [success, setSuccess] = useState<string | null>(null);
  const [numQuestions, setNumQuestions] = useState<number>(session.numberOfQuestions || 5);
  const [scanProgress, setScanProgress] = useState(0);
  const [topicText, setTopicText] = useState<string>('');

  const { errors, addError, clearErrors, clearError } = useApiError();

  useEffect(() => {
    if (uploadedFile && scanProgress < 100) {
      const timer = setInterval(() => {
        setScanProgress(prev => Math.min(prev + (Math.random() * 20), 100));
      }, 50);
      return () => clearInterval(timer);
    }
  }, [uploadedFile, scanProgress]);

  // Sync back to context for persistence
  useEffect(() => {
    updateSession({
        pdfFile: uploadedFile,
        numberOfQuestions: numQuestions,
        pdfSelection: uploadedFile ? {
            selectedPages,
            metadata: {
                totalPages,
                fileName: uploadedFile.name,
                fileSize: uploadedFile.size
            }
        } : null
    });
  }, [uploadedFile, numQuestions, selectedPages, totalPages]);


  const handleTopicSubmit = () => {
    if (!topicText.trim()) {
      addError({ message: 'Please enter a topic or question.', type: 'validation' });
      return;
    }

    if (topicText.trim().length < 3) {
      addError({ message: 'Topic must be at least 3 characters.', type: 'validation' });
      return;
    }

    clearErrors();
    
    // Create a virtual text file from the topic input
    const blob = new Blob([topicText], { type: 'text/plain' });
    const virtualFile = new File([blob], 'topic.txt', { type: 'text/plain' });
    
    setUploadedFile(virtualFile);
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
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/plain',
      'text/csv',
      'text/markdown',
      'image/png',
      'image/jpeg'
    ];

    const maxSize = 100 * 1024 * 1024; // 100MB (limit for non-chunked Cloudinary uploads)
    if (file.size > maxSize) {
      addError({ message: 'File exceeds 500MB capacity limit.', type: 'validation' });
      return;
    }

    clearErrors();
    setUploadedFile(file);
    setScanProgress(0);
    
    if (file.type === 'application/pdf') {
      setSelectedPages([]);
      // Auto-switch after a brief "scanning" delay
      setTimeout(() => setActiveTab('analyze'), 500);
    } else {
      setTotalPages(1);
      setSelectedPages([1]);
      setTimeout(() => setActiveTab('sync'), 500);
    }
  };

  const handlePDFLoadSuccess = (numPages: number) => {
    setTotalPages(numPages);
    setSelectedPages(Array.from({ length: numPages }, (_, i) => i + 1));
  };

  const handlePageSelect = (pageNumber: number) => {
    setSelectedPages(prev =>
        prev.includes(pageNumber)
            ? prev.filter(p => p !== pageNumber)
            : [...prev, pageNumber].sort((a, b) => a - b)
    );
  };

  const handleProcessSelection = () => {
    if (!uploadedFile || (uploadedFile.type === 'application/pdf' && selectedPages.length === 0)) {
      addError({ message: 'Select at least one document segment for ingestion.', type: 'validation' });
      return;
    }

    setIsProcessing(true);
    clearErrors();

    const selection: PDFSelection = {
      selectedPages: uploadedFile.type === 'application/pdf' ? selectedPages : [1],
      selectedText: [],
      selectionType: 'pages',
      metadata: {
        totalPages,
        fileName: uploadedFile.name,
        fileSize: uploadedFile.size
      },
      numberOfQuestions: numQuestions
    };

    setTimeout(() => {
      onSelectionComplete?.({ selection, file: uploadedFile });
      setSuccess('Neural Node Initialized: Document mapping complete.');
      setIsProcessing(false);
    }, 1000);
  };

  const resetUpload = () => {
    setUploadedFile(null);
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
      <div className={cn('space-y-8', className)}>
        <ErrorList errors={errors} onDismiss={clearError} />

        {success && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <SuccessDisplay
                    message={success}
                    onDismiss={() => setSuccess(null)}
                    actions={[{ label: 'Reset Node', onClick: resetUpload, variant: 'outline' }]}
                />
            </motion.div>
        )}

        <div className="relative">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="mb-8">
                <TabsList className="grid w-full grid-cols-3 glass p-1.5 rounded-[22px] h-16 border border-foreground/5 shadow-none">
                  <TabsTrigger 
                    value="load" 
                    className="rounded-[18px] h-full data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-glow font-bold tracking-tight transition-all gap-2"
                  >
                    <Binary size={18} />
                    <span className="hidden md:inline">LOAD</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="analyze" 
                    disabled={!uploadedFile || uploadedFile.type !== 'application/pdf'} 
                    className="rounded-[18px] h-full data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-glow font-bold tracking-tight transition-all gap-2"
                  >
                    <ShieldCheck size={18} />
                    <span className="hidden md:inline">SCAN</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="sync" 
                    disabled={!uploadedFile} 
                    className="rounded-[18px] h-full data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-glow font-bold tracking-tight transition-all gap-2"
                  >
                    <Database size={18} />
                    <span className="hidden md:inline">SYNC</span>
                  </TabsTrigger>
                </TabsList>
            </div>

            <TabsContent key="load" value="load" className="m-0 outline-none">
                <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.4 }}
                className="space-y-6 md:space-y-8"
                >
                    {/* Header */}
                    <div className="text-center space-y-2 sm:space-y-3 px-4">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border border-primary/20"
                        >
                            <Zap size={16} className="sm:w-5 sm:h-5 text-primary" fill="currentColor" />
                            <span className="font-bold text-xs sm:text-sm uppercase tracking-wider">AI-Powered Study Generator</span>
                        </motion.div>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-foreground via-foreground to-foreground/60 bg-clip-text text-transparent px-2">
                            Start Learning Smarter
                        </h2>
                        <p className="text-muted-foreground text-xs sm:text-sm md:text-base max-w-2xl mx-auto px-4">
                            Choose your preferred method to generate personalized study materials
                        </p>
                    </div>

                    {/* Main Content - Two Column Grid on Desktop */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                        
                        {/* Option 1: Quick Topic Input */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="relative group"
                        >
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-primary/50 rounded-xl md:rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                            <div className="relative h-full bg-card border border-foreground/10 rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 hover:border-primary/30 transition-all">
                                {/* Icon Header */}
                                <div className="flex items-start justify-between gap-3">
                                    <div className="space-y-1.5 sm:space-y-2 flex-1 min-w-0">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
                                            <FileText size={20} className="sm:w-6 sm:h-6 text-white" />
                                        </div>
                                        <h3 className="text-lg sm:text-xl font-bold">Type a Topic</h3>
                                        <p className="text-xs sm:text-sm text-muted-foreground">
                                            Quick generation from any subject
                                        </p>
                                    </div>
                                    <div className="px-2 sm:px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] sm:text-xs font-bold shrink-0">
                                        FASTEST
                                    </div>
                                </div>

                                {/* Text Input */}
                                <div className="space-y-2 sm:space-y-3">
                                    <textarea
                                        value={topicText}
                                        onChange={(e) => setTopicText(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="E.g., Photosynthesis, World War II, Quantum Physics..."
                                        className="w-full h-28 sm:h-32 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-foreground/5 border border-foreground/10 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none text-sm placeholder:text-muted-foreground/50"
                                        maxLength={500}
                                    />
                                    
                                    <div className="flex items-center justify-between text-[10px] sm:text-xs">
                                        <span className="text-muted-foreground/60">{topicText.length}/500</span>
                                        <span className="text-muted-foreground/40 hidden sm:inline">Enter to submit • Shift+Enter for new line</span>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <Button 
                                    onClick={handleTopicSubmit}
                                    disabled={!topicText.trim() || topicText.trim().length < 3}
                                    className="w-full h-11 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white font-bold shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                                >
                                    <Zap size={16} className="sm:w-[18px] sm:h-[18px]" fill="currentColor" />
                                    <span className="ml-2">Generate Now</span>
                                </Button>
                            </div>
                        </motion.div>

                        {/* Option 2: File Upload */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="relative group"
                        >
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-primary rounded-xl md:rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                            <div className="relative h-full bg-card border border-foreground/10 rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 hover:border-primary/30 transition-all">
                                {/* Icon Header */}
                                <div className="flex items-start justify-between gap-3">
                                    <div className="space-y-1.5 sm:space-y-2 flex-1 min-w-0">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-primary/70 to-primary/50 flex items-center justify-center shadow-lg shadow-primary/10 shrink-0">
                                            <Upload size={20} className="sm:w-6 sm:h-6 text-white" />
                                        </div>
                                        <h3 className="text-lg sm:text-xl font-bold">Upload Files</h3>
                                        <p className="text-xs sm:text-sm text-muted-foreground">
                                            PDF, images, documents & more
                                        </p>
                                    </div>
                                    <div className="px-2 sm:px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] sm:text-xs font-bold shrink-0 whitespace-nowrap">
                                        500MB
                                    </div>
                                </div>

                                {/* Upload Area */}
                                <input type="file" onChange={handleFileUpload} className="hidden" id="file-upload-redesign" accept=".pdf,.docx,.doc,.txt,.csv,.md,.png,.jpg,.jpeg" />
                                <label 
                                    htmlFor="file-upload-redesign" 
                                    className="block cursor-pointer"
                                >
                                    <div className="relative border-2 border-dashed border-foreground/20 hover:border-primary/50 rounded-lg sm:rounded-xl p-6 sm:p-8 text-center transition-all group/upload bg-foreground/[0.02] hover:bg-foreground/[0.05] active:scale-[0.98]">
                                        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover/upload:opacity-100 rounded-lg sm:rounded-xl transition-opacity"></div>
                                        
                                        <div className="relative space-y-3 sm:space-y-4">
                                            {uploadedFile ? (
                                                <>
                                                    <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
                                                        <FileText size={24} className="sm:w-7 sm:h-7 text-primary" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <p className="font-semibold text-xs sm:text-sm truncate px-2 sm:px-4">{uploadedFile.name}</p>
                                                        <div className="w-full h-1.5 bg-foreground/10 rounded-full overflow-hidden">
                                                            <motion.div 
                                                                className="h-full bg-gradient-to-r from-primary to-primary/70" 
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${scanProgress}%` }}
                                                                transition={{ duration: 0.3 }}
                                                            />
                                                        </div>
                                                        <p className="text-xs text-muted-foreground">{scanProgress}% Complete</p>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-full border-2 border-dashed border-foreground/30 flex items-center justify-center group-hover/upload:border-primary/50 group-hover/upload:scale-110 transition-all">
                                                        <Upload size={24} className="sm:w-7 sm:h-7 text-muted-foreground group-hover/upload:text-primary transition-colors" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="font-semibold text-sm">Click to browse</p>
                                                        <p className="text-xs text-muted-foreground hidden sm:block">or drag and drop your files here</p>
                                                        <p className="text-xs text-muted-foreground sm:hidden">Tap to select files</p>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </label>

                                {/* File Types */}
                                <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center">
                                    {['PDF', 'DOCX', 'TXT', 'PNG', 'JPEG'].map((type) => (
                                        <span key={type} className="px-2 sm:px-3 py-1 rounded-full bg-foreground/5 text-[10px] sm:text-xs font-medium text-muted-foreground border border-foreground/10">
                                            {type}
                                        </span>
                                    ))}
                                </div>

                                {/* Continue Button */}
                                {uploadedFile && scanProgress === 100 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        <Button 
                                            onClick={() => setActiveTab(uploadedFile.type === 'application/pdf' ? 'analyze' : 'sync')}
                                            className="w-full h-11 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white font-bold shadow-lg shadow-primary/20 transition-all active:scale-95 text-sm sm:text-base"
                                        >
                                            Continue
                                            <ArrowRight size={16} className="sm:w-[18px] sm:h-[18px] ml-2" />
                                        </Button>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>

                    </div>

                    {/* Features Footer */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 pt-2 sm:pt-4"
                    >
                        {[
                            { icon: '⚡', label: 'Instant Generation' },
                            { icon: '🎯', label: 'AI-Powered' },
                            { icon: '📚', label: 'Multiple Formats' },
                            { icon: '🔒', label: 'Secure & Private' }
                        ].map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-1.5 sm:gap-2 p-2 sm:p-3 rounded-lg sm:rounded-xl bg-foreground/[0.02] border border-foreground/5">
                                <span className="text-base sm:text-xl shrink-0">{feature.icon}</span>
                                <span className="text-[10px] sm:text-xs font-medium text-muted-foreground truncate">{feature.label}</span>
                            </div>
                        ))}
                    </motion.div>

                </motion.div>
            </TabsContent>

            <TabsContent key="analyze" value="analyze" className="m-0 outline-none">
                <motion.div 
                initial={{ opacity: 0, scale: 0.98 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-6"
                >
                    {uploadedFile && (
                        <div className="glass border-foreground/5 rounded-2xl overflow-hidden p-4 md:p-8 space-y-6 md:space-y-8">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <h3 className="text-xl font-bold flex items-center gap-3">
                                <div className="w-2 h-6 bg-primary rounded-2xl" />
                                SCAN MODE
                                </h3>
                                <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Verifying neural fragments</p>
                            </div>
                            <Button variant="outline" onClick={() => setActiveTab('sync')} disabled={totalPages === 0} className="rounded-2xl font-bold border-foreground/10 hover:bg-foreground/5 gap-2 px-6">
                                NEXT
                                <ArrowRight size={16} />
                            </Button>
                        </div>

                        <div className="rounded-2xl overflow-hidden border border-foreground/5 shadow-2xl bg-black/60 relative group min-h-[400px]">
                            <div className="absolute inset-x-0 h-0.5 bg-primary/40 shadow-glow top-0 animate-[scan_3s_ease-in-out_infinite] z-10 pointer-events-none" />
                            <PDFPreview
                                file={uploadedFile}
                                onLoadSuccess={handlePDFLoadSuccess}
                                onLoadError={(e) => addError(e)}
                                selectedPages={selectedPages}
                                onPageSelect={handlePageSelect}
                                className="w-full opacity-80 group-hover:opacity-100 transition-opacity"
                            />
                        </div>
                        </div>
                    )}
                </motion.div>
            </TabsContent>

            <TabsContent key="sync" value="sync" className="m-0 outline-none">
                <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col gap-8"
                >
                {uploadedFile && uploadedFile.type === 'application/pdf' && (
                    <PageSelector
                        totalPages={totalPages}
                        selectedPages={selectedPages}
                        onSelectionChange={setSelectedPages}
                        className="glass border-foreground/5 rounded-2xl p-8 shadow-none"
                    />
                )}

                <div className="glass p-10 rounded-2xl border border-foreground/5 space-y-10 relative overflow-hidden">
                    
                    <div className="relative">
                        <h3 className="text-2xl font-bold mb-2 tracking-tight">SYNC PARAMETERS</h3>
                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Optimize extraction weights</p>
                    </div>

                    <div className="space-y-6 relative">
                        <div className="flex justify-between items-end">
                        <Label className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">Output Density (KP Generator)</Label>
                        <span className="text-2xl font-bold text-primary">{numQuestions}</span>
                        </div>
                        <div className="relative pt-2">
                            <input
                                type="range"
                                min={3}
                                max={30}
                                value={numQuestions}
                                onChange={(e) => setNumQuestions(parseInt(e.target.value))}
                                className="w-full h-2 bg-foreground/5 rounded-2xl appearance-none cursor-pointer accent-primary"
                            />
                            <div className="flex justify-between mt-3 text-[10px] font-bold opacity-30">
                                <span>LOW FREQUENCY</span>
                                <span>HIGH FREQUENCY</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 rounded-2xl bg-foreground/5 border border-foreground/5 space-y-4 shadow-inner">
                        <div className="flex justify-between text-sm py-2 border-b border-foreground/5">
                            <span className="font-bold opacity-30 uppercase tracking-widest text-[10px]">Reference</span>
                            <span className="font-bold truncate max-w-[200px]">{uploadedFile?.name}</span>
                        </div>
                        <div className="flex justify-between text-sm py-2">
                            <span className="font-bold opacity-30 uppercase tracking-widest text-[10px]">Segment Count</span>
                            <span className="font-bold text-primary">{selectedPages.length || 1} Blocks</span>
                        </div>
                        <div className="h-1.5 w-full bg-foreground/5 rounded-2xl overflow-hidden mt-4">
                            <motion.div 
                                className="h-full bg-primary shadow-[0_0_15px_#10b981]" 
                                initial={{ width: 0 }}
                                animate={{ width: `${(Math.max(selectedPages.length, 1) / Math.max(totalPages, 1)) * 100}%` }}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <Button
                            onClick={handleProcessSelection}
                            disabled={isProcessing || !uploadedFile || (uploadedFile.type === 'application/pdf' && selectedPages.length === 0)}
                            className="w-full h-20 rounded-[28px] bg-primary hover:bg-primary/90 text-white font-bold text-xl shadow-glow transition-all hover:scale-[1.02] active:scale-[0.98] gap-4"
                        >
                            {isProcessing ? (
                                <>
                                <LoadingSpinner size="sm" /> 
                                <span>INITIALIZING NODE...</span>
                                </>
                            ) : (
                                <>
                                <span>ACTIVATE NODE</span>
                                <Zap size={24} fill="currentColor" />
                                </>
                            )}
                        </Button>

                        <Button 
                            variant="ghost" 
                            onClick={resetUpload} 
                            className="w-full h-12 font-bold text-[10px] tracking-[0.3em] opacity-20 hover:opacity-100 hover:bg-transparent text-destructive gap-2"
                        >
                            <Trash2 size={14} />
                            TERMINATE SEQUENCE
                        </Button>
                    </div>
                </div>
                </motion.div>
            </TabsContent>
          </Tabs>
        </div>

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
