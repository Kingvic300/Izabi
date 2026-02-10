"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  FileText,
  Scissors,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Layers,
  ChevronRight,
  Loader2,
  FileCheck,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PDFAnalysisResponse, SplitSuggestion } from '@/types/pdf-splitting';
import { cn } from '@/lib/utils';

interface PDFSplitterModalProps {
  analysis: PDFAnalysisResponse;
  onProcessSection: (section: {
    pageStart: number;
    pageEnd: number;
    sectionTitle?: string;
  }) => Promise<void>;
  onProcessAll: (sections: Array<{
    pageStart: number;
    pageEnd: number;
    sectionTitle?: string;
  }>) => Promise<void>;
  onCancel: () => void;
}

export const PDFSplitterModal: React.FC<PDFSplitterModalProps> = ({
  analysis,
  onProcessSection,
  onProcessAll,
  onCancel,
}) => {
  const [selectedStrategy, setSelectedStrategy] = useState<'chapter' | 'page-range' | 'custom'>('chapter');
  const [selectedSuggestions, setSelectedSuggestions] = useState<Set<string>>(new Set());
  const [customStart, setCustomStart] = useState<number>(1);
  const [customEnd, setCustomEnd] = useState<number>(analysis.pageCount);
  const [processing, setProcessing] = useState(false);

  const suggestions = analysis.suggestions || [];
  const chapterSuggestions = suggestions.filter(s => s.strategy === 'chapter');
  const rangeSuggestions = suggestions.filter(s => s.strategy === 'page-range');

  const handleToggleSuggestion = (id: string) => {
    const newSelected = new Set(selectedSuggestions);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedSuggestions(newSelected);
  };

  const handleSelectAll = (strategyType: 'chapter' | 'page-range') => {
    const stratSuggestions = strategyType === 'chapter' ? chapterSuggestions : rangeSuggestions;
    const newSelected = new Set(selectedSuggestions);
   
    const allSelected = stratSuggestions.every(s => newSelected.has(s.id));
   
    if (allSelected) {
      stratSuggestions.forEach(s => newSelected.delete(s.id));
    } else {
      stratSuggestions.forEach(s => newSelected.add(s.id));
    }
   
    setSelectedSuggestions(newSelected);
  };

  const handleProcessSelected = async () => {
    setProcessing(true);
    try {
      const selected = suggestions.filter(s => selectedSuggestions.has(s.id));
     
      if (selected.length === 1) {
        await onProcessSection({
          pageStart: selected[0].pageStart,
          pageEnd: selected[0].pageEnd,
          sectionTitle: selected[0].detectedTitle || selected[0].label,
        });
      } else {
        await onProcessAll(
          selected.map(s => ({
            pageStart: s.pageStart,
            pageEnd: s.pageEnd,
            sectionTitle: s.detectedTitle || s.label,
          }))
        );
      }
    } finally {
      setProcessing(false);
    }
  };

  const handleProcessCustom = async () => {
    if (customStart < 1 || customEnd > analysis.pageCount || customStart > customEnd) {
      return;
    }

    setProcessing(true);
    try {
      await onProcessSection({
        pageStart: customStart,
        pageEnd: customEnd,
        sectionTitle: `Pages ${customStart}-${customEnd}`,
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <Card className="glass border-primary/20 shadow-2xl">
          <CardHeader className="border-b border-white/5 pb-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Scissors className="text-primary" size={28} />
                </div>
                <div>
                  <CardTitle className="text-3xl font-bold tracking-tight">
                    Smart PDF Splitting
                  </CardTitle>
                  <CardDescription className="text-base mt-2 max-w-2xl">
                    {analysis.reason}
                  </CardDescription>
                </div>
              </div>
              <Button
                variant="ghost"
                onClick={onCancel}
                className="rounded-xl"
              >
                ✕
              </Button>
            </div>

            {/* Document Stats */}
            <div className="flex flex-wrap gap-3 mt-6">
              <Badge className="bg-white/5 text-white border-white/10 px-4 py-2 text-sm">
                <FileText size={14} className="mr-2" />
                {analysis.pageCount} Pages
              </Badge>
              <Badge className="bg-white/5 text-white border-white/10 px-4 py-2 text-sm">
                <Layers size={14} className="mr-2" />
                ~{Math.round(analysis.estimatedChars / 1000)}K chars
              </Badge>
              {analysis.fileSizeMB && (
                <Badge className="bg-white/5 text-white border-white/10 px-4 py-2 text-sm">
                  {analysis.fileSizeMB.toFixed(1)} MB
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {/* Strategy Selector */}
            <div className="flex gap-3">
              {chapterSuggestions.length > 0 && (
                <Button
                  variant={selectedStrategy === 'chapter' ? 'default' : 'outline'}
                  onClick={() => setSelectedStrategy('chapter')}
                  className="flex-1 h-14 rounded-xl font-bold"
                >
                  <BookOpen size={18} className="mr-2" />
                  By Chapters ({chapterSuggestions.length})
                </Button>
              )}
              <Button
                variant={selectedStrategy === 'page-range' ? 'default' : 'outline'}
                onClick={() => setSelectedStrategy('page-range')}
                className="flex-1 h-14 rounded-xl font-bold"
              >
                <Layers size={18} className="mr-2" />
                Fixed Ranges ({rangeSuggestions.length})
              </Button>
              <Button
                variant={selectedStrategy === 'custom' ? 'default' : 'outline'}
                onClick={() => setSelectedStrategy('custom')}
                className="flex-1 h-14 rounded-xl font-bold"
              >
                <Scissors size={18} className="mr-2" />
                Custom
              </Button>
            </div>

            {/* Suggestions List */}
            <AnimatePresence mode="wait">
              {selectedStrategy !== 'custom' && (
                <motion.div
                  key={selectedStrategy}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  {/* Select All */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold">Select Sections to Process</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSelectAll(selectedStrategy)}
                      className="text-primary"
                    >
                      {(selectedStrategy === 'chapter' ? chapterSuggestions : rangeSuggestions).every(s =>
                        selectedSuggestions.has(s.id)
                      ) ? 'Deselect All' : 'Select All'}
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto pr-2">
                    {(selectedStrategy === 'chapter' ? chapterSuggestions : rangeSuggestions).map((suggestion) => (
                      <SuggestionCard
                        key={suggestion.id}
                        suggestion={suggestion}
                        selected={selectedSuggestions.has(suggestion.id)}
                        onToggle={() => handleToggleSuggestion(suggestion.id)}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Custom Range Input */}
              {selectedStrategy === 'custom' && (
                <motion.div
                  key="custom"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                    <h3 className="text-lg font-bold mb-4">Custom Page Range</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Start Page</Label>
                        <Input
                          type="number"
                          min={1}
                          max={analysis.pageCount}
                          value={customStart}
                          onChange={(e) => setCustomStart(parseInt(e.target.value) || 1)}
                          className="bg-white/5 border-white/10 h-12"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>End Page</Label>
                        <Input
                          type="number"
                          min={customStart}
                          max={analysis.pageCount}
                          value={customEnd}
                          onChange={(e) => setCustomEnd(parseInt(e.target.value) || analysis.pageCount)}
                          className="bg-white/5 border-white/10 h-12"
                        />
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-4">
                      Processing pages {customStart} to {customEnd} ({customEnd - customStart + 1} pages)
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Info Banner */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <Info size={18} className="text-blue-500 mt-0.5 shrink-0" />
              <p className="text-sm font-medium text-blue-200">
                Each section will be processed separately and appear in your study history. You'll receive notifications when processing completes.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4 border-t border-white/5">
              <Button
                variant="outline"
                onClick={onCancel}
                className="flex-1 h-14 rounded-xl font-bold"
                disabled={processing}
              >
                Cancel
              </Button>
              <Button
                onClick={selectedStrategy === 'custom' ? handleProcessCustom : handleProcessSelected}
                disabled={selectedStrategy !== 'custom' && selectedSuggestions.size === 0}
                className="flex-1 h-14 rounded-xl font-bold bg-primary hover:bg-primary/90"
              >
                {processing ? (
                  <Loader2 className="animate-spin mr-2" size={18} />
                ) : (
                  <ChevronRight size={18} className="mr-2" />
                )}
                {selectedStrategy === 'custom'
                  ? 'Process Custom Range'
                  : `Process ${selectedSuggestions.size} Section${selectedSuggestions.size !== 1 ? 's' : ''}`}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

const SuggestionCard: React.FC<{
  suggestion: SplitSuggestion;
  selected: boolean;
  onToggle: () => void;
}> = ({ suggestion, selected, onToggle }) => {
  return (
    <div
      onClick={onToggle}
      className={cn(
        'p-4 rounded-2xl border-2 cursor-pointer transition-all group',
        selected
          ? 'border-primary bg-primary/10 shadow-glow'
          : 'border-white/5 bg-white/[0.02] hover:bg-white/5 hover:border-white/10'
      )}
    >
      <div className="flex items-start gap-4">
        <div className={cn(
          'w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 mt-0.5',
          selected ? 'border-primary bg-primary' : 'border-white/20'
        )}>
          {selected && <CheckCircle2 size={14} className="text-white" />}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h4 className="font-bold text-lg truncate">{suggestion.label}</h4>
            {suggestion.detectedTitle && (
              <Badge className="bg-green-500/20 text-green-400 border-none text-[10px]">
                Auto-detected
              </Badge>
            )}
          </div>

          <div className="flex flex-wrap gap-3 mb-2">
            <span className="text-xs font-mono bg-white/5 px-2 py-1 rounded">
              Pages {suggestion.pageStart}–{suggestion.pageEnd}
            </span>
            <span className="text-xs font-mono bg-white/5 px-2 py-1 rounded">
              ~{Math.round(suggestion.estimatedChars / 1000)}K chars
            </span>
            <span className="text-xs font-mono bg-white/5 px-2 py-1 rounded">
              {suggestion.pageEnd - suggestion.pageStart + 1} pages
            </span>
          </div>

          {suggestion.recommendedFor && (
            <p className="text-xs text-muted-foreground italic">
              {suggestion.recommendedFor}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
