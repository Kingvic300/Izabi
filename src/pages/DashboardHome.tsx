import React, { useState } from "react";
import axios from "axios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BASE_URL } from "@/contants/contants.ts";
import { FileText, Brain, Zap, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import PDFUploadSection from "@/components/pdf/PDFUploadSection";
import { PDFSelection, StudyQuestionResponse } from "@/types/pdf";
import { ErrorList } from "@/components/ui/error-display";
import { useApiError } from "@/hooks/useApiError";

const DashboardHome = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [summary, setSummary] = useState<string>("");
  const [questions, setQuestions] = useState<StudyQuestionResponse[]>([]);
  const [showSummary, setShowSummary] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const [pdfSelection, setPdfSelection] = useState<PDFSelection | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [numberOfQuestions, setNumberOfQuestions] = useState<number>(5);

  const { errors, addError, clearError } = useApiError();
  const userId = localStorage.getItem("userId");

  const handleSelectionComplete = ({
                                     selection,
                                     file,
                                   }: {
    selection: PDFSelection;
    file: File;
  }) => {
    setPdfSelection(selection);
    setPdfFile(file);
  };

  const handleRequest = async (endpoint: string, includeQuestions = false) => {
    if (!pdfFile || !userId || !pdfSelection) {
      addError({ message: "Please upload and select a PDF first", type: "validation" });
      return;
    }

    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append("file", pdfFile);
      formData.append("userId", userId);
      if (includeQuestions) {
        formData.append("numberOfQuestions", String(numberOfQuestions));
      }

      const { data } = await axios.post(`${BASE_URL}/api/study/${endpoint}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data.summary) {
        setSummary(data.summary);
        setShowSummary(true);
      }

      let questionsData: StudyQuestionResponse[] = [];
      if (Array.isArray(data)) {
        questionsData = data;
      } else if (Array.isArray(data.questions)) {
        questionsData = data.questions;
      } else if (Array.isArray(data.studyQuestions)) {
        questionsData = data.studyQuestions;
      }

      setQuestions(questionsData);
      setShowQuestions(questionsData.length > 0);
    } catch (err) {
      addError(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "text-green-600";
      case "medium":
        return "text-yellow-600";
      case "hard":
        return "text-red-600";
      default:
        return "text-muted-foreground";
    }
  };

  const getQuestionTypeDisplay = (questionType?: string) => {
    return questionType?.replace("_", " ") || "Unknown";
  };

  const getQuestionTypeIcon = (questionType?: string) => {
    switch (questionType?.toLowerCase()) {
      case "multiple_choice":
      case "multiple choice":
        return "🔘";
      case "true_false":
      case "true false":
        return "✓/✗";
      case "short_answer":
      case "short answer":
        return "✍️";
      default:
        return "❓";
    }
  };

  return (
      <div className="space-y-6">
        <ErrorList errors={errors} onDismiss={clearError} />

        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
          <p className="text-muted-foreground">
            Upload your PDFs and let AI transform them into personalized study materials
          </p>
        </div>

        <PDFUploadSection onSelectionComplete={handleSelectionComplete} />

        {pdfSelection && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <span>AI Study Tools</span>
                </CardTitle>
                <CardDescription>
                  Generate personalized study materials from your selected content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0">
                  <Button
                      onClick={() => handleRequest("summarize")}
                      disabled={isProcessing}
                      variant="hero"
                      className="h-20 flex-col space-y-2"
                  >
                    <Brain className="h-6 w-6" />
                    <div className="text-center">
                      <div className="font-medium">Smart Summary</div>
                      <div className="text-xs opacity-75">Key concepts & insights</div>
                    </div>
                  </Button>

                  <Button
                      onClick={() => handleRequest("generate-questions", true)}
                      disabled={isProcessing}
                      variant="secondary"
                      className="h-20 flex-col space-y-2"
                  >
                    <Zap className="h-6 w-6" />
                    <div className="text-center">
                      <div className="font-medium">Practice Quiz</div>
                      <div className="text-xs opacity-75">Test your knowledge</div>
                    </div>
                  </Button>

                  <Button
                      onClick={() => handleRequest("generate-study-material", true)}
                      disabled={isProcessing}
                      variant="outline"
                      className="h-20 flex-col space-y-2"
                  >
                    <FileText className="h-6 w-6" />
                    <div className="text-center">
                      <div className="font-medium">Study Guide</div>
                      <div className="text-xs opacity-75">Complete materials</div>
                    </div>
                  </Button>
                </div>

                {isProcessing && (
                    <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent"></div>
                        <span className="text-sm">Processing your content with AI...</span>
                      </div>
                    </div>
                )}
              </CardContent>
            </Card>
        )}

        {(summary || questions.length > 0) && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Generated Content</h2>

              {summary && (
                  <Collapsible open={showSummary} onOpenChange={setShowSummary}>
                    <Card>
                      <CollapsibleTrigger asChild>
                        <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                          <CardTitle className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Brain className="h-5 w-5 text-learning-blue" />
                              <span>AI Summary</span>
                            </div>
                            {showSummary ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </CardTitle>
                        </CardHeader>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <CardContent>
                          <div className="prose max-w-none">
                            <p className="text-foreground leading-relaxed">{summary}</p>
                          </div>
                        </CardContent>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>
              )}

              {questions.length > 0 && (
                  <Collapsible open={showQuestions} onOpenChange={setShowQuestions}>
                    <Card>
                      <CollapsibleTrigger asChild>
                        <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                          <CardTitle className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Zap className="h-5 w-5 text-learning-green" />
                              <span>Generated Questions ({questions.length})</span>
                            </div>
                            {showQuestions ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </CardTitle>
                        </CardHeader>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <CardContent className="space-y-6">
                          {questions.map((q, index) => (
                              <div
                                  key={index}
                                  className="p-6 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl shadow-md"
                              >
                                <div className="flex justify-between items-start mb-4">
                                  <p className="text-lg font-semibold text-foreground">
                                    {index + 1}. {q.question}
                                  </p>
                                  <span
                                      className={`px-2 py-1 rounded text-sm font-medium ${getDifficultyColor(
                                          q.difficulty
                                      )}`}
                                  >
                            {q.difficulty?.toUpperCase() || "N/A"}
                          </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  {q.options?.map((option, idx) => (
                                      <button
                                          key={idx}
                                          className="w-full py-4 px-3 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg shadow-lg transition-colors duration-200 text-left"
                                      >
                                        {String.fromCharCode(65 + idx)}. {option}
                                      </button>
                                  ))}
                                </div>

                                {q.answer && (
                                    <div className="mt-4 p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                                      <p className="text-sm">
                                        <span className="font-medium text-green-700">Answer: </span>
                                        <span className="text-green-800">{q.answer}</span>
                                      </p>
                                    </div>
                                )}
                              </div>
                          ))}
                        </CardContent>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>
              )}
            </div>
        )}
      </div>
  );
};

export default DashboardHome;
