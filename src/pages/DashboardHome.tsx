import React, { useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BASE_URL } from "@/contants/contants.ts";
import {
  FileText,
  Brain,
  Zap,
  ChevronDown,
  ChevronUp,
  Sparkles,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import PDFUploadSection from "@/components/pdf/PDFUploadSection";
import { PDFSelection, StudyQuestionResponse } from "@/types/pdf";
import { ErrorList } from "@/components/ui/error-display";
import { useApiError } from "@/hooks/useApiError";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import stringSimilarity from "string-similarity"; // For fuzzy short answer matching

const DashboardHome = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [summary, setSummary] = useState<string>("");
  const [questions, setQuestions] = useState<StudyQuestionResponse[]>([]);
  const [showSummary, setShowSummary] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const [pdfSelection, setPdfSelection] = useState<PDFSelection | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [numberOfQuestions, setNumberOfQuestions] = useState<number>(5);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [showResults, setShowResults] = useState(false);

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
    clearError();
    setSelectedAnswers({});
    setShowResults(false);

    try {
      const formData = new FormData();
      formData.append("file", pdfFile);
      formData.append("userId", userId);

      if (pdfSelection.selectedPages?.length) {
        formData.append("selectedPages", JSON.stringify(pdfSelection.selectedPages));
      }

      if (includeQuestions) {
        formData.append("numberOfQuestions", String(numberOfQuestions));
      }

      const { data } = await axios.post(`${BASE_URL}/api/study/${endpoint}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSummary(data.summary || "");
      let questionsData: StudyQuestionResponse[] = [];
      if (Array.isArray(data)) questionsData = data;
      else if (Array.isArray(data.questions)) questionsData = data.questions;
      else if (Array.isArray(data.studyQuestions)) questionsData = data.studyQuestions;

      setQuestions(questionsData);
      setShowQuestions(questionsData.length > 0);
      setShowSummary(!!data.summary);
    } catch (err) {
      addError(err);
      setSummary("");
      setQuestions([]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAnswerSelect = (questionIndex: number, option: string) => {
    if (!showResults) {
      setSelectedAnswers((prev) => ({ ...prev, [questionIndex]: option }));
    }
  };

  const handleShortAnswerChange = (questionIndex: number, value: string) => {
    if (!showResults) {
      setSelectedAnswers((prev) => ({ ...prev, [questionIndex]: value }));
    }
  };

  const handleCheckResults = () => setShowResults(true);

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty?.toLowerCase()) {
      case "easy": return "text-green-600 dark:text-green-400";
      case "medium": return "text-yellow-600 dark:text-yellow-400";
      case "hard": return "text-red-600 dark:text-red-400";
      default: return "text-muted-foreground";
    }
  };

  const getQuestionTypeDisplay = (type?: string) => type?.replace(/_/g, " ") || "Unknown";

  const getQuestionTypeIcon = (type?: string) => {
    switch (type?.toLowerCase()) {
      case "multiple_choice":
      case "multiple choice": return "🔘";
      case "true_false":
      case "true false": return "✓/✗";
      case "short_answer":
      case "short answer": return "✍️";
      default: return "❓";
    }
  };

  const isShortAnswerCorrect = (input: string, correctAnswer: string) => {
    if (!input || !correctAnswer) return false;
    return stringSimilarity.compareTwoStrings(input.trim().toLowerCase(), correctAnswer.trim().toLowerCase()) > 0.7;
  };

  const getOptionVariant = (questionIndex: number, option: string, correctAnswer: string) => {
    const selected = selectedAnswers[questionIndex];
    if (!selected) return "outline";
    if (selected === option && option === correctAnswer) return "default";
    if (selected === option && option !== correctAnswer) return "destructive";
    if (selected !== option && option === correctAnswer) return "default";
    return "outline";
  };

  const scoreQuiz = () => {
    let correctCount = 0;
    questions.forEach((q, index) => {
      const userAnswer = selectedAnswers[index];
      if (q.questionType?.toLowerCase() === "short_answer") {
        if (isShortAnswerCorrect(userAnswer || "", q.answer || "")) correctCount++;
      } else {
        if (userAnswer === q.answer) correctCount++;
      }
    });
    return correctCount;
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
                  <Button onClick={() => handleRequest("summarize")} disabled={isProcessing} variant="hero" className="h-20 flex-col space-y-2 flex-grow">
                    <Brain className="h-6 w-6" />
                    <div className="text-center">
                      <div className="font-medium">Smart Summary</div>
                      <div className="text-xs opacity-75">Key concepts & insights</div>
                    </div>
                  </Button>
                  <Button onClick={() => handleRequest("generate-questions", true)} disabled={isProcessing} variant="secondary" className="h-20 flex-col space-y-2 flex-grow">
                    <Zap className="h-6 w-6" />
                    <div className="text-center">
                      <div className="font-medium">Practice Quiz</div>
                      <div className="text-xs opacity-75">Test your knowledge</div>
                    </div>
                  </Button>
                  <Button onClick={() => handleRequest("generate-study-material", true)} disabled={isProcessing} variant="outline" className="h-20 flex-col space-y-2 flex-grow">
                    <FileText className="h-6 w-6" />
                    <div className="text-center">
                      <div className="font-medium">Study Guide</div>
                      <div className="text-xs opacity-75">Complete materials</div>
                    </div>
                  </Button>
                </div>

                <div className="mt-4 flex items-center space-x-2">
                  <span className="text-sm font-medium">Number of Questions:</span>
                  <Select value={String(numberOfQuestions)} onValueChange={(value) => setNumberOfQuestions(Number(value))} disabled={isProcessing}>
                    <SelectTrigger className="w-[100px]">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1,2,3,4,5,6,7,8,9,10].map((num) => (
                          <SelectItem key={num} value={String(num)}>{num}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                          <div className="prose dark:prose-invert max-w-none">
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
                        <CardContent className="space-y-4">
                          {questions.map((q, index) => {
                            const userAnswer = selectedAnswers[index];
                            const isShortAnswer = q.questionType?.toLowerCase() === "short_answer";
                            const isMultipleChoiceOrTrueFalse = q.questionType?.toLowerCase() === "multiple_choice" || q.questionType?.toLowerCase() === "true_false";
                            const isCorrect = isShortAnswer
                                ? isShortAnswerCorrect(userAnswer || "", q.answer || "")
                                : userAnswer === q.answer;

                            return (
                                <Card key={index} className="border-2 border-purple-200">
                                  <CardHeader className="pb-3">
                                    <CardTitle className="text-lg flex justify-between items-center">
                                      <span className="text-foreground">{index + 1}. {q.question}</span>
                                      <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(q.difficulty)}`}>
                                {q.difficulty?.toUpperCase() || "N/A"}
                              </span>
                                    </CardTitle>
                                    <CardDescription className="flex items-center space-x-2 text-sm">
                                      <span>{getQuestionTypeIcon(q.questionType)}</span>
                                      <span>{getQuestionTypeDisplay(q.questionType)}</span>
                                    </CardDescription>
                                  </CardHeader>
                                  <CardContent className="space-y-3">
                                    {isMultipleChoiceOrTrueFalse && (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                          {q.options?.map((option, idx) => (
                                              <Button
                                                  key={idx}
                                                  variant={getOptionVariant(index, option, q.answer || "")}
                                                  className="w-full justify-start text-left h-auto py-2"
                                                  onClick={() => handleAnswerSelect(index, option)}
                                                  disabled={showResults}
                                              >
                                                <span className="font-medium mr-2">{String.fromCharCode(65 + idx)}.</span>
                                                {option}
                                              </Button>
                                          ))}
                                          {userAnswer && userAnswer !== q.answer && !showResults && (
                                              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                                                ❌ Incorrect. Correct answer: <span className="font-semibold">{q.answer}</span>
                                              </p>
                                          )}
                                        </div>
                                    )}

                                    {isShortAnswer && (
                                        <div className="space-y-2">
                                          <Label htmlFor={`short-answer-${index}`}>Your Answer:</Label>
                                          <Input
                                              id={`short-answer-${index}`}
                                              value={userAnswer || ""}
                                              onChange={(e) => handleShortAnswerChange(index, e.target.value)}
                                              placeholder="Type your answer here..."
                                              disabled={showResults}
                                          />
                                          {userAnswer && !isCorrect && !showResults && (
                                              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                                                ❌ Close, try again or check hints!
                                              </p>
                                          )}
                                        </div>
                                    )}

                                    {showResults && !isCorrect && (
                                        <Card className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-700 mt-3">
                                          <CardContent className="p-3 text-sm">
                                            <p className="font-medium text-green-700 dark:text-green-300">
                                              Correct Answer: <span className="text-green-800 dark:text-green-200 font-normal">{q.answer}</span>
                                            </p>
                                          </CardContent>
                                        </Card>
                                    )}
                                  </CardContent>
                                </Card>
                            );
                          })}

                          {questions.length > 0 && (
                              <div className="flex justify-between items-center mt-6 p-4 bg-accent/20 rounded-lg">
                                {!showResults ? (
                                    <Button onClick={handleCheckResults} disabled={isProcessing} className="w-full">Check Results</Button>
                                ) : (
                                    <div className="w-full text-center text-lg font-semibold text-primary">
                                      You scored {scoreQuiz()} out of {questions.length} questions!
                                    </div>
                                )}
                              </div>
                          )}
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
