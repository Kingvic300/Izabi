import React, { useState } from "react";
import axios from "axios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {BASE_URL} from "@/contants/contants.ts";
import { Upload, FileText, Brain, Zap, ChevronDown, ChevronUp } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";


const DashboardHome = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [summary, setSummary] = useState<string>("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [showSummary, setShowSummary] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);

  const userId = localStorage.getItem("userId");

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setUploadedFile(file);
      console.log("File uploaded:", file.name);
    }
  };

  const handleSummarize = async () => {
    if (!uploadedFile || !userId) return;
    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append("file", uploadedFile);
      formData.append("userId", userId);

      const response = await axios.post(`${BASE_URL}/api/study/summarize`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setSummary(response.data.summary);
      setShowSummary(true);
    } catch (err) {
      console.error("Error generating summary:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateQuestions = async () => {
    if (!uploadedFile || !userId) return;
    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append("file", uploadedFile);
      formData.append("userId", userId);
      formData.append("numberOfQuestions", "5");

      const response = await axios.post(`${BASE_URL}/api/study/generate-questions`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setQuestions(response.data.map((q: any) => q.question));
      setShowQuestions(true);
    } catch (err) {
      console.error("Error generating questions:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateStudyMaterial = async () => {
    if (!uploadedFile || !userId) return;
    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append("file", uploadedFile);
      formData.append("userId", userId);
      formData.append("numberOfQuestions", "5");

      const response = await axios.post(`${BASE_URL}/api/study/generate-study-material`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setSummary(response.data.summary);
      setQuestions(response.data.questions.map((q: any) => q.question));
      setShowSummary(true);
      setShowQuestions(true);
    } catch (err) {
      console.error("Error generating study material:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
          <p className="text-muted-foreground">
            Upload your PDFs and let AI transform them into summaries and quizzes
          </p>
        </div>

        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="h-5 w-5 text-primary" />
              <span>Upload PDF</span>
            </CardTitle>
            <CardDescription>
              Select a PDF file to start your AI-powered learning experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
              <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="pdf-upload"
              />
              <label htmlFor="pdf-upload" className="cursor-pointer block">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">
                  {uploadedFile ? uploadedFile.name : "Choose PDF file"}
                </p>
                <p className="text-muted-foreground">
                  {uploadedFile ? "File ready for processing" : "Click to browse or drag and drop"}
                </p>
              </label>
            </div>

            {uploadedFile && (
                <div className="mt-6 flex flex-col sm:flex-row gap-4">
                  <Button
                      onClick={handleSummarize}
                      disabled={isProcessing}
                      variant="hero"
                      className="flex-1"
                  >
                    <Brain className="h-4 w-4 mr-2" />
                    {isProcessing ? "Processing..." : "Generate Summary"}
                  </Button>

                  <Button
                      onClick={handleGenerateQuestions}
                      disabled={isProcessing}
                      variant="secondary"
                      className="flex-1"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    {isProcessing ? "Processing..." : "Generate Questions"}
                  </Button>

                  <Button
                      onClick={handleGenerateStudyMaterial}
                      disabled={isProcessing}
                      variant="outline"
                      className="flex-1"
                  >
                    Generate Study Material
                  </Button>
                </div>
            )}
          </CardContent>
        </Card>

        {/* Results Section */}
        {(summary || questions.length > 0) && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Generated Content</h2>

              {/* Summary */}
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

              {/* Questions */}
              {questions.length > 0 && (
                  <Collapsible open={showQuestions} onOpenChange={setShowQuestions}>
                    <Card>
                      <CollapsibleTrigger asChild>
                        <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                          <CardTitle className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Zap className="h-5 w-5 text-learning-green" />
                              <span>Generated Questions</span>
                            </div>
                            {showQuestions ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </CardTitle>
                        </CardHeader>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <CardContent>
                          <div className="space-y-3">
                            {questions.map((question, index) => (
                                <div
                                    key={index}
                                    className="p-4 bg-muted/30 rounded-lg border-l-4 border-primary"
                                >
                                  <p className="font-medium text-foreground">
                                    {index + 1}. {question}
                                  </p>
                                </div>
                            ))}
                          </div>
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
