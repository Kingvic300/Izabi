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
import stringSimilarity from "string-similarity";

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

  const handleSelectionComplete = ({ selection, file }: { selection: PDFSelection; file: File }) => {
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

  const handleAnswerSelect = (qIndex: number, option: string) => {
    if (!showResults) {
      setSelectedAnswers((prev) => ({ ...prev, [qIndex]: option }));
    }
  };

  const handleShortAnswerChange = (qIndex: number, value: string) => {
    if (!showResults) {
      setSelectedAnswers((prev) => ({ ...prev, [qIndex]: value }));
    }
  };

  const isShortAnswerCorrect = (input: string, correctAnswer: string) =>
      stringSimilarity.compareTwoStrings(input.trim().toLowerCase(), correctAnswer.trim().toLowerCase()) > 0.7;

  const scoreQuiz = () =>
      questions.reduce((acc, q, i) => {
        const userAnswer = selectedAnswers[i];
        if (!userAnswer) return acc;
        if (q.questionType?.toLowerCase() === "short_answer") {
          return acc + (isShortAnswerCorrect(userAnswer, q.answer || "") ? 1 : 0);
        }
        return acc + (userAnswer === q.answer ? 1 : 0);
      }, 0);

  return (
      <div className="space-y-6">
        <ErrorList errors={errors} onDismiss={clearError} />

        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
          <p className="text-muted-foreground">
            Upload your PDFs and let AI transform them into personalized study materials.
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
                <CardDescription>Generate study materials from your selected content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Button
                      onClick={() => handleRequest("summarize")}
                      disabled={isProcessing}
                      variant="hero"
                      className="h-24 flex flex-col items-center justify-center space-y-1"
                  >
                    <Brain className="h-6 w-6" />
                    <span className="font-medium">Smart Summary</span>
                  </Button>
                  <Button
                      onClick={() => handleRequest("generate-questions", true)}
                      disabled={isProcessing}
                      variant="secondary"
                      className="h-24 flex flex-col items-center justify-center space-y-1"
                  >
                    <Zap className="h-6 w-6" />
                    <span className="font-medium">Practice Quiz</span>
                  </Button>
                  <Button
                      onClick={() => handleRequest("generate-study-material", true)}
                      disabled={isProcessing}
                      variant="outline"
                      className="h-24 flex flex-col items-center justify-center space-y-1"
                  >
                    <FileText className="h-6 w-6" />
                    <span className="font-medium">Study Guide</span>
                  </Button>
                </div>

                <div className="mt-4 flex items-center space-x-2">
                  <span className="text-sm font-medium">Number of Questions:</span>
                  <Select
                      value={String(numberOfQuestions)}
                      onValueChange={(val) => setNumberOfQuestions(Number(val))}
                      disabled={isProcessing}
                  >
                    <SelectTrigger className="w-[100px]">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                          <SelectItem key={num} value={String(num)}>
                            {num}
                          </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {isProcessing && (
                    <div className="mt-4 flex items-center space-x-3 p-3 bg-muted rounded-md">
                      <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></div>
                      <span className="text-sm">Processing your content with AI...</span>
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
                      <span className="flex items-center space-x-2">
                        <Brain className="h-5 w-5 text-blue-500" /> <span>AI Summary</span>
                      </span>
                            {showSummary ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </CardTitle>
                        </CardHeader>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <CardContent>
                          <p className="leading-relaxed">{summary}</p>
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
                      <span className="flex items-center space-x-2">
                        <Zap className="h-5 w-5 text-green-500" />{" "}
                        <span>Quiz ({questions.length} questions)</span>
                      </span>
                            {showQuestions ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </CardTitle>
                        </CardHeader>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <CardContent className="space-y-8">
                          {questions.map((q, i) => {
                            const userAnswer = selectedAnswers[i];
                            const isShort = q.questionType?.toLowerCase() === "short_answer";
                            const correct =
                                isShort && userAnswer
                                    ? isShortAnswerCorrect(userAnswer, q.answer || "")
                                    : userAnswer === q.answer;

                            return (
                                <Card key={i} className="p-4 shadow-sm">
                                  <div className="flex justify-between items-center mb-2">
                                    <p className="font-medium text-lg">
                                      {i + 1}. {q.question}
                                    </p>
                                    {showResults && (
                                        correct ? (
                                            <span className="flex items-center text-green-600 text-sm font-semibold">
                <CheckCircle2 className="h-4 w-4 mr-1" /> Correct
              </span>
                                        ) : (
                                            <span className="flex items-center text-red-600 text-sm font-semibold">
                <XCircle className="h-4 w-4 mr-1" /> Incorrect
              </span>
                                        )
                                    )}
                                  </div>

                                  {!isShort && (
                                      <div className="space-y-2">
                                        {q.options?.map((opt, idx) => {
                                          const isSelected = userAnswer === opt;
                                          const isCorrect = showResults && opt === q.answer;
                                          const isWrong =
                                              showResults && isSelected && opt !== q.answer;

                                          return (
                                              <Button
                                                  key={idx}
                                                  variant="outline"
                                                  onClick={() => handleAnswerSelect(i, opt)}
                                                  disabled={showResults}
                                                  className={`w-full justify-start text-left
                    ${isSelected ? "border-primary bg-primary/10" : ""}
                    ${isCorrect ? "border-green-500 bg-green-50" : ""}
                    ${isWrong ? "border-red-500 bg-red-50" : ""}
                  `}
                                              >
                                                {String.fromCharCode(65 + idx)}. {opt}
                                              </Button>
                                          );
                                        })}
                                      </div>
                                  )}

                                  {isShort && (
                                      <div className="space-y-2">
                                        <Label>Your Answer</Label>
                                        <Input
                                            value={userAnswer || ""}
                                            placeholder="Type your answer..."
                                            onChange={(e) => handleShortAnswerChange(i, e.target.value)}
                                            disabled={showResults}
                                        />
                                        {showResults && !correct && (
                                            <p className="text-sm text-red-600">
                                              Correct: <span className="font-semibold">{q.answer}</span>
                                            </p>
                                        )}
                                      </div>
                                  )}
                                </Card>
                            );
                          })}

                          {questions.length > 0 && (
                              <div className="mt-6 text-center">
                                {!showResults ? (
                                    <Button onClick={() => setShowResults(true)} className="w-full h-12 text-lg">
                                      Submit Answers
                                    </Button>
                                ) : (
                                    <p className="text-lg font-semibold text-primary">
                                      You scored {scoreQuiz()} / {questions.length}
                                    </p>
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
