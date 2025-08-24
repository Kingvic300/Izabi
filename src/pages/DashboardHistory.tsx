import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BASE_URL } from "@/contants/contants.ts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import {
  Search,
  FileText,
  Calendar,
  Eye,
  Download,
  Trash2,
  Brain,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  BookOpen,
  List
} from "lucide-react";

interface StudyQuestion {
  id: string;
  question: string;
  options: string[];
  answer: string;
  difficulty: string;
  questionType: string;
}

interface StudyMaterialResponse {
  summary: string;
  keyPoints: string[];
  studyQuestions: StudyQuestion[];
  fileName: string;
  createdAt?: string;
  id?: string;
}

const DashboardHistory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("all");
  const [studyMaterials, setStudyMaterials] = useState<StudyMaterialResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) return;

        const response = await axios.get(`${BASE_URL}/api/study/history?userId=${userId}`);
        console.log("Backend study history:", response.data);

        const materials = Array.isArray(response.data) ? response.data : [];
        setStudyMaterials(materials);
      } catch (err) {
        console.error("Error fetching study history:", err);
        setStudyMaterials([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const toggleExpanded = (index: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  const filteredMaterials = studyMaterials.filter(material => {
    const matchesSearch =
        material.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        material.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        material.keyPoints.some(point => point.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDifficulty =
        filterDifficulty === "all" ||
        material.studyQuestions.some(q => q.difficulty.toLowerCase() === filterDifficulty.toLowerCase());

    return matchesSearch && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'hard':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getQuestionTypeIcon = (questionType: string) => {
    switch (questionType?.toLowerCase()) {
      case 'multiple_choice':
      case 'multiple choice':
        return '🔘';
      case 'true_false':
      case 'true false':
        return '✓/✗';
      case 'short_answer':
      case 'short answer':
        return '✍️';
      default:
        return '❓';
    }
  };

  if (loading) {
    return (
        <div className="py-12 text-center">
          <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading your study history...</p>
        </div>
    );
  }

  return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Study History</h1>
          <p className="text-muted-foreground">
            View and manage all your generated study materials, summaries, and questions
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="h-5 w-5 text-primary" />
              <span>Search & Filter</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                    placeholder="Search by filename, summary, or key points..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                />
              </div>
              <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Difficulties</SelectItem>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {filteredMaterials.length} study material{filteredMaterials.length !== 1 ? 's' : ''} found
            </h2>
          </div>

          {filteredMaterials.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No study materials found</h3>
                  <p className="text-muted-foreground">
                    {studyMaterials.length === 0
                        ? "Start by uploading a PDF to generate your first study material"
                        : "Try adjusting your search terms or filters"}
                  </p>
                </CardContent>
              </Card>
          ) : (
              <div className="space-y-4">
                {filteredMaterials.map((material, index) => (
                    <Card key={material.id || index} className="hover:shadow-card transition-all duration-200">
                      <CardContent className="p-0">
                        <div className="p-6 border-b">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                <FileText className="h-6 w-6 text-primary" />
                              </div>
                              <div>
                                <h3 className="font-medium text-lg">{material.fileName || "Study Material"}</h3>
                                <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                                  {material.createdAt && (
                                      <span className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>{new Date(material.createdAt).toLocaleDateString()}</span>
                              </span>
                                  )}
                                  <Badge variant="secondary" className="flex items-center space-x-1">
                                    <HelpCircle className="h-3 w-3" />
                                    <span>{material.studyQuestions.length} questions</span>
                                  </Badge>
                                  <Badge variant="secondary" className="flex items-center space-x-1">
                                    <List className="h-3 w-3" />
                                    <span>{material.keyPoints.length} key points</span>
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <Button size="sm" variant="ghost" onClick={() => toggleExpanded(index)}>
                                {expandedItems.has(index) ? (
                                    <ChevronUp className="h-4 w-4" />
                                ) : (
                                    <ChevronDown className="h-4 w-4" />
                                )}
                              </Button>
                              <Button size="sm" variant="ghost">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        <Collapsible open={expandedItems.has(index)}>
                          <CollapsibleContent>
                            <div className="p-6 space-y-6">
                              {/* Summary Section */}
                              {material.summary && (
                                  <div>
                                    <h4 className="flex items-center space-x-2 font-semibold text-sm text-muted-foreground mb-3">
                                      <Brain className="h-4 w-4" />
                                      <span>AI SUMMARY</span>
                                    </h4>
                                    <div className="bg-muted/30 rounded-lg p-4">
                                      <p className="text-sm leading-relaxed">{material.summary}</p>
                                    </div>
                                  </div>
                              )}

                              {/* Key Points Section */}
                              {material.keyPoints && material.keyPoints.length > 0 && (
                                  <div>
                                    <h4 className="flex items-center space-x-2 font-semibold text-sm text-muted-foreground mb-3">
                                      <BookOpen className="h-4 w-4" />
                                      <span>KEY POINTS</span>
                                    </h4>
                                    <div className="bg-muted/30 rounded-lg p-4">
                                      <ul className="space-y-2">
                                        {material.keyPoints.map((point, pointIndex) => (
                                            <li key={pointIndex} className="text-sm flex items-start space-x-2">
                                              <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                                              <span>{point}</span>
                                            </li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>
                              )}

                              {/* Questions Section */}
                              {material.studyQuestions && material.studyQuestions.length > 0 && (
                                  <div>
                                    <h4 className="flex items-center space-x-2 font-semibold text-sm text-muted-foreground mb-3">
                                      <HelpCircle className="h-4 w-4" />
                                      <span>STUDY QUESTIONS</span>
                                    </h4>
                                    <div className="space-y-3">
                                      {material.studyQuestions.map((question, qIndex) => (
                                          <div
                                              key={question.id || qIndex}
                                              className="bg-muted/30 rounded-lg p-4 border-l-4 border-primary"
                                          >
                                            <div className="flex items-start justify-between mb-2">
                                              <p className="font-medium text-sm flex-1">
                                                {qIndex + 1}. {question.question}
                                              </p>
                                              <div className="flex items-center space-x-2 ml-4">
                                                <span className="text-xs">{getQuestionTypeIcon(question.questionType)}</span>
                                                <Badge size="sm" className={getDifficultyColor(question.difficulty)}>
                                                  {question.difficulty}
                                                </Badge>
                                              </div>
                                            </div>

                                            {question.options && question.options.length > 0 && (
                                                <div className="mb-2">
                                                  <ul className="space-y-1 ml-4">
                                                    {question.options.map((option, optionIndex) => (
                                                        <li key={optionIndex} className="text-xs flex items-center">
                                            <span className="w-4 h-4 rounded-full bg-muted flex items-center justify-center text-[10px] font-medium mr-2">
                                              {String.fromCharCode(65 + optionIndex)}
                                            </span>
                                                          {option}
                                                        </li>
                                                    ))}
                                                  </ul>
                                                </div>
                                            )}

                                            {question.answer && (
                                                <div className="bg-green-50 dark:bg-green-900/20 rounded p-2 border-l-2 border-green-500">
                                                  <p className="text-xs">
                                                    <span className="font-medium text-green-700 dark:text-green-400">Answer: </span>
                                                    <span className="text-green-800 dark:text-green-300">{question.answer}</span>
                                                  </p>
                                                </div>
                                            )}
                                          </div>
                                      ))}
                                    </div>
                                  </div>
                              )}
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      </CardContent>
                    </Card>
                ))}
              </div>
          )}
        </div>
      </div>
  );
};

export default DashboardHistory;
