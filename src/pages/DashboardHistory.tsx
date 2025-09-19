import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BASE_URL } from "@/contants/contants.ts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Search,
  FileText,
  Calendar,
  Eye,
  Brain,
  HelpCircle,
  BookOpen,
  X
} from "lucide-react";

interface StudyQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  difficulty?: string;
  questionType?: string;
}

interface StudyMaterialResponse {
  summary: string;
  keyPoints?: string[];
  questions?: StudyQuestion[];
  fileName?: string;
  createdAt?: string;
  id?: string;
}

const DashboardHistory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("all");
  const [studyMaterials, setStudyMaterials] = useState<StudyMaterialResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMaterial, setSelectedMaterial] = useState<StudyMaterialResponse | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) return;

        const response = await axios.get(`${BASE_URL}/api/study/history?userId=${userId}`);
        console.log("Backend study history:", response.data);

        const materials = Array.isArray(response.data) ? response.data : [];
        const normalized = materials.map((m) => ({
          ...m,
          keyPoints: m.keyPoints || [],
          questions: m.questions || []
        }));

        setStudyMaterials(normalized);
      } catch (err) {
        console.error("Error fetching study history:", err);
        setStudyMaterials([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const filteredMaterials = studyMaterials.filter((material) => {
    const keyPoints = material.keyPoints || [];
    const questions = material.questions || [];

    const matchesSearch =
        (material.fileName || "Study Material").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (material.summary || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        keyPoints.some((point) => point.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDifficulty =
        filterDifficulty === "all" ||
        questions.some((q) => q.difficulty?.toLowerCase() === filterDifficulty.toLowerCase());

    return matchesSearch && matchesDifficulty;
  });

  if (loading) {
    return (
        <div className="py-12 text-center">
          <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading your study history...</p>
        </div>
    );
  }

  return (
      <div className="space-y-6 relative">
        <div>
          <h1 className="text-3xl font-bold mb-2">Study History</h1>
          <p className="text-muted-foreground">
            View and manage all your generated study materials, summaries, and questions
          </p>
        </div>

        {/* Search + Filter */}
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

        {/* Results */}
        <div className={`space-y-4 ${selectedMaterial ? "blur-sm" : ""}`}>
          {filteredMaterials.map((material, index) => {
            const keyPoints = material.keyPoints || [];
            const questions = material.questions || [];

            return (
                <Card
                    key={material.id || index}
                    className="hover:shadow-card transition-all duration-200 cursor-pointer"
                    onClick={() => setSelectedMaterial(material)}
                >
                  <CardContent className="p-6 flex items-center justify-between">
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
                          <Badge variant="secondary">{questions.length} questions</Badge>
                          <Badge variant="secondary">{keyPoints.length} key points</Badge>
                        </div>
                      </div>
                    </div>
                    <Eye className="h-5 w-5 text-muted-foreground" />
                  </CardContent>
                </Card>
            );
          })}
        </div>

        {/* Modal Overlay */}
        {selectedMaterial && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
              <div className="bg-background rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 relative">
                <button
                    className="absolute top-4 right-4 p-2 rounded-full bg-muted hover:bg-muted-foreground/20"
                    onClick={() => setSelectedMaterial(null)}
                >
                  <X className="h-5 w-5" />
                </button>

                <h2 className="text-xl font-semibold mb-6">
                  {selectedMaterial.fileName || "Study Material"}
                </h2>

                {selectedMaterial.summary && (
                    <div className="mb-6 bg-muted/30 rounded-lg p-4">
                      <h4 className="flex items-center space-x-2 font-semibold text-sm text-muted-foreground mb-2">
                        <Brain className="h-4 w-4" />
                        <span>AI SUMMARY</span>
                      </h4>
                      <p className="text-sm leading-relaxed">{selectedMaterial.summary}</p>
                    </div>
                )}

                {selectedMaterial.keyPoints && selectedMaterial.keyPoints.length > 0 && (
                    <div className="mb-6 bg-muted/30 rounded-lg p-4">
                      <h4 className="flex items-center space-x-2 font-semibold text-sm text-muted-foreground mb-2">
                        <BookOpen className="h-4 w-4" />
                        <span>KEY POINTS</span>
                      </h4>
                      <ul className="space-y-2">
                        {selectedMaterial.keyPoints.map((point, idx) => (
                            <li key={idx} className="text-sm flex items-start space-x-2">
                              <span className="w-2 h-2 bg-primary rounded-full mt-2"></span>
                              <span>{point}</span>
                            </li>
                        ))}
                      </ul>
                    </div>
                )}

                {selectedMaterial.questions && selectedMaterial.questions.length > 0 && (
                    <div className="bg-muted/30 rounded-lg p-4">
                      <h4 className="flex items-center space-x-2 font-semibold text-sm text-muted-foreground mb-3">
                        <HelpCircle className="h-4 w-4" />
                        <span>STUDY QUESTIONS</span>
                      </h4>
                      <div className="space-y-3">
                        {selectedMaterial.questions.map((q, idx) => (
                            <div
                                key={q.id || idx}
                                className="bg-background rounded-lg p-4 border-l-4 border-primary"
                            >
                              <p className="font-medium text-sm mb-2">
                                {idx + 1}. {q.question}
                              </p>
                              {q.options && q.options.length > 0 && (
                                  <ul className="ml-4 space-y-1">
                                    {q.options.map((opt, optIdx) => (
                                        <li key={optIdx} className="text-xs flex items-center">
                              <span className="w-4 h-4 rounded-full bg-muted flex items-center justify-center text-[10px] mr-2">
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                                          {opt}
                                        </li>
                                    ))}
                                  </ul>
                              )}
                              {q.correctAnswer && (
                                  <p className="mt-2 text-xs text-green-600">
                                    <strong>Answer:</strong> {q.correctAnswer}
                                  </p>
                              )}
                            </div>
                        ))}
                      </div>
                    </div>
                )}
              </div>
            </div>
        )}
      </div>
  );
};

export default DashboardHistory;
