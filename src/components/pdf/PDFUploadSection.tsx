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

interface PDFUploadSectionProps {
  onSelectionComplete?: (data: { selection: PDFSelection; file: File }) => void;
  className?: string;
}

const PDFUploadSection: React.FC<PDFUploadSectionProps> = ({
  onSelectionComplete,
  className
}) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<string>('load');
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [numQuestions, setNumQuestions] = useState<number>(5);
  const [scanProgress, setScanProgress] = useState(0);

  const { errors, addError, clearErrors, clearError } = useApiError();

  useEffect(() => {
    if (uploadedFile && scanProgress < 100) {
      const timer = setInterval(() => {
        setScanProgress(prev => Math.min(prev + (Math.random() * 10), 100));
      }, 100);
      return () => clearInterval(timer);
    }
  }, [uploadedFile, scanProgress]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/plain',
      'text/csv',
      'text/markdown'
    ];

    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      addError({ message: 'File exceeds 100MB capacity limit.', type: 'validation' });
      return;
    }

    clearErrors();
    setUploadedFile(file);
    setScanProgress(0);
    
    if (file.type === 'application/pdf') {
      setSelectedPages([]);
      // Auto-switch after a brief "scanning" delay
      setTimeout(() => setActiveTab('analyze'), 1500);
    } else {
      setTotalPages(1);
      setSelectedPages([1]);
      setTimeout(() => setActiveTab('sync'), 1500);
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
                <TabsList className="grid w-full grid-cols-3 bg-black/40 p-1.5 rounded-[22px] h-16 border border-white/5">
                  <TabsTrigger 
                    value="load" 
                    className="rounded-[18px] h-full data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-glow font-black tracking-tight transition-all gap-2"
                  >
                    <Binary size={18} />
                    <span className="hidden md:inline">LOAD</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="analyze" 
                    disabled={!uploadedFile || uploadedFile.type !== 'application/pdf'} 
                    className="rounded-[18px] h-full data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-glow font-black tracking-tight transition-all gap-2"
                  >
                    <ShieldCheck size={18} />
                    <span className="hidden md:inline">SCAN</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="sync" 
                    disabled={!uploadedFile} 
                    className="rounded-[18px] h-full data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-glow font-black tracking-tight transition-all gap-2"
                  >
                    <Database size={18} />
                    <span className="hidden md:inline">SYNC</span>
                  </TabsTrigger>
                </TabsList>
            </div>

            <AnimatePresence mode="wait">
                <TabsContent value="load" className="m-0 outline-none">
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                      <div className="group relative border-2 border-dashed border-white/10 hover:border-primary/40 rounded-[40px] p-12 text-center transition-all duration-500 bg-white/[0.01] hover:bg-white/[0.03] overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        <input type="file" onChange={handleFileUpload} className="hidden" id="pdf-upload" />
                        <label htmlFor="pdf-upload" className="cursor-pointer block relative z-10">
                          <div className="w-24 h-24 rounded-3xl bg-black/40 flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all shadow-2xl border border-white/5">
                              <Upload className="h-10 w-10 text-primary" />
                          </div>
                          <h3 className="text-2xl font-black mb-3 tracking-tight">{uploadedFile ? 'Node Loaded' : 'Ingest Intelligence'}</h3>
                          <p className="text-muted-foreground font-medium max-w-xs mx-auto mb-6">
                            {uploadedFile
                                ? uploadedFile.name
                                : 'Deploy documents into the neural environment'}
                          </p>
                          
                          {uploadedFile && (
                              <div className="w-full max-w-xs mx-auto h-2 bg-white/5 rounded-full overflow-hidden mb-6">
                                  <motion.div 
                                    className="h-full bg-primary shadow-glow" 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${scanProgress}%` }}
                                  />
                              </div>
                          )}

                          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-[0.2em] opacity-40">
                             Protocols: PDF / DOCX / TXT
                          </div>
                        </label>
                      </div>

                      {uploadedFile && scanProgress === 100 && (
                          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center">
                            <Button 
                                onClick={() => setActiveTab(uploadedFile.type === 'application/pdf' ? 'analyze' : 'sync')}
                                size="lg"
                                className="rounded-2xl px-10 h-16 bg-primary hover:bg-primary/90 text-white font-black text-lg shadow-glow transition-all hover:scale-105 gap-3"
                            >
                                START MAPPING
                                <ArrowRight size={20} />
                            </Button>
                          </motion.div>
                      )}
                  </motion.div>
                </TabsContent>

                <TabsContent value="analyze" className="m-0 outline-none">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="space-y-6"
                  >
                      {uploadedFile && (
                          <div className="glass border-white/5 rounded-[40px] overflow-hidden p-8 space-y-8">
                            <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                  <h3 className="text-xl font-black flex items-center gap-3">
                                    <div className="w-2 h-6 bg-primary rounded-full" />
                                    SCAN MODE
                                  </h3>
                                  <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Verifying neural fragments</p>
                              </div>
                              <Button variant="outline" onClick={() => setActiveTab('sync')} disabled={totalPages === 0} className="rounded-xl font-bold border-white/10 hover:bg-white/5 gap-2 px-6">
                                NEXT
                                <ArrowRight size={16} />
                              </Button>
                            </div>

                            <div className="rounded-[32px] overflow-hidden border border-white/5 shadow-2xl bg-black/60 relative group min-h-[400px]">
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

                <TabsContent value="sync" className="m-0 outline-none">
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
                            className="glass border-white/5 rounded-[40px] p-8 shadow-none"
                        />
                    )}

                    <div className="glass p-10 rounded-[40px] border border-white/5 space-y-10 relative overflow-hidden">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 blur-[80px] rounded-full" />
                        
                        <div className="relative">
                            <h3 className="text-2xl font-black mb-2 tracking-tight">SYNC PARAMETERS</h3>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Optimize extraction weights</p>
                        </div>

                        <div className="space-y-6 relative">
                          <div className="flex justify-between items-end">
                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Output Density (KP Generator)</Label>
                            <span className="text-2xl font-black text-primary">{numQuestions}</span>
                          </div>
                          <div className="relative pt-2">
                              <input
                                  type="range"
                                  min={3}
                                  max={30}
                                  value={numQuestions}
                                  onChange={(e) => setNumQuestions(parseInt(e.target.value))}
                                  className="w-full h-2 bg-white/5 rounded-full appearance-none cursor-pointer accent-primary"
                              />
                              <div className="flex justify-between mt-3 text-[10px] font-black opacity-30">
                                  <span>LOW FREQUENCY</span>
                                  <span>HIGH FREQUENCY</span>
                              </div>
                          </div>
                        </div>

                        <div className="p-8 rounded-[32px] bg-black/40 border border-white/5 space-y-4 shadow-inner">
                            <div className="flex justify-between text-sm py-2 border-b border-white/5">
                                <span className="font-bold opacity-30 uppercase tracking-widest text-[10px]">Reference</span>
                                <span className="font-black truncate max-w-[200px]">{uploadedFile?.name}</span>
                            </div>
                            <div className="flex justify-between text-sm py-2">
                                <span className="font-bold opacity-30 uppercase tracking-widest text-[10px]">Segment Count</span>
                                <span className="font-black text-emerald-400">{selectedPages.length || 1} Blocks</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mt-4">
                                <motion.div 
                                    className="h-full bg-emerald-500 shadow-[0_0_15px_#10b981]" 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(Math.max(selectedPages.length, 1) / Math.max(totalPages, 1)) * 100}%` }}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            <Button
                                onClick={handleProcessSelection}
                                disabled={isProcessing || !uploadedFile || (uploadedFile.type === 'application/pdf' && selectedPages.length === 0)}
                                className="w-full h-20 rounded-[28px] bg-primary hover:bg-primary/90 text-white font-black text-xl shadow-glow transition-all hover:scale-[1.02] active:scale-[0.98] gap-4"
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
                                className="w-full h-12 font-black text-[10px] tracking-[0.3em] opacity-20 hover:opacity-100 hover:bg-transparent text-destructive gap-2"
                            >
                              <Trash2 size={14} />
                              TERMINATE SEQUENCE
                            </Button>
                        </div>
                    </div>
                  </motion.div>
                </TabsContent>
            </AnimatePresence>
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
