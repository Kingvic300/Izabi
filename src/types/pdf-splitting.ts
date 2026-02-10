export interface PDFAnalysisResponse {
  success: boolean;
  needsSplitting: boolean;
  pageCount: number;
  estimatedChars: number;
  fileSizeMB?: number;
  reason?: string;
  message?: string;
  suggestions?: SplitSuggestion[];
  fileUrl?: string;
  fileId?: string;
}

export interface SplitSuggestion {
  id: string;
  strategy: 'chapter' | 'page-range' | 'custom';
  label: string;
  pageStart: number;
  pageEnd: number;
  estimatedChars: number;
  detectedTitle?: string;
  recommendedFor?: string;
}

export interface PDFSectionProcessRequest {
  fileUrl: string;
  pageStart: number;
  pageEnd: number;
  sectionTitle?: string;
  type: 'summary' | 'flashcards' | 'quiz' | 'study-guide';
  options?: any;
}
