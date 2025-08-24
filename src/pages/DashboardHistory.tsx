import React ,{ useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {BASE_URL} from "@/contants/contants.ts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, FileText, Calendar, Eye, Download, Trash2 } from "lucide-react";

// Mock data for uploaded files
const mockFiles = [
  { id: 1, name: "Mathematics_Chapter_5.pdf", uploadDate: "2024-01-15", type: "Mathematics", status: "processed", size: "2.3 MB" },
  { id: 2, name: "Physics_Mechanics.pdf", uploadDate: "2024-01-14", type: "Physics", status: "processed", size: "4.1 MB" },
  { id: 3, name: "Chemistry_Organic.pdf", uploadDate: "2024-01-12", type: "Chemistry", status: "processing", size: "3.7 MB" },
  { id: 4, name: "English_Literature.pdf", uploadDate: "2024-01-10", type: "English", status: "processed", size: "1.9 MB" },
  { id: 5, name: "Biology_Genetics.pdf", uploadDate: "2024-01-08", type: "Biology", status: "failed", size: "5.2 MB" }
];

const DashboardHistory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // This state will hold backend data when ready
  const [backendFiles, setBackendFiles] = useState<any[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const userId = localStorage.getItem("userId"); // replace with your auth userId
        const response = await axios.get(`${BASE_URL}/api/study/history?userId=${userId}`);
        console.log("Backend study history:", response.data);
        setBackendFiles(response.data); // you can use this later to replace mockFiles
      } catch (err) {
        console.error("Error fetching study history:", err);
      }
    };

    fetchHistory().then(() => {
      console.log("History fetch completed");
    });
  }, []);

  const filteredFiles = mockFiles.filter(file => {
    const matchesSearch =
        file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || file.type.toLowerCase() === filterType.toLowerCase();
    const matchesStatus = filterStatus === "all" || file.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "processed": return "bg-learning-green/10 text-learning-green border-learning-green/20";
      case "processing": return "bg-learning-orange/10 text-learning-orange border-learning-orange/20";
      case "failed": return "bg-destructive/10 text-destructive border-destructive/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "processed": return "Processed";
      case "processing": return "Processing";
      case "failed": return "Failed";
      default: return "Unknown";
    }
  };

  return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">File History</h1>
          <p className="text-muted-foreground">
            View and manage all your uploaded PDF files
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
                    placeholder="Search files by name or subject..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="mathematics">Mathematics</SelectItem>
                  <SelectItem value="physics">Physics</SelectItem>
                  <SelectItem value="chemistry">Chemistry</SelectItem>
                  <SelectItem value="biology">Biology</SelectItem>
                  <SelectItem value="english">English</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="processed">Processed</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {filteredFiles.length} file{filteredFiles.length !== 1 ? 's' : ''} found
            </h2>
          </div>

          {filteredFiles.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No files found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search terms or filters
                  </p>
                </CardContent>
              </Card>
          ) : (
              <div className="grid gap-4">
                {filteredFiles.map((file) => (
                    <Card key={file.id} className="hover:shadow-card transition-all duration-200">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                              <FileText className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-medium text-lg">{file.name}</h3>
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(file.uploadDate).toLocaleDateString()}</span>
                          </span>
                                <span>{file.size}</span>
                                <Badge variant="secondary">{file.type}</Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Badge className={getStatusColor(file.status)}>
                              {getStatusText(file.status)}
                            </Badge>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="ghost" disabled={file.status !== "processed"}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost" disabled={file.status !== "processed"}>
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
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
