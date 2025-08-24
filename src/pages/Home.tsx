import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, FileText, Mic, Users, Zap, Globe } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  const features = [
    {
      icon: <FileText className="h-8 w-8" />,
      title: "Smart Note Upload",
      description: "Upload PDFs and notes - AI scans instantly"
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: "AI Summaries",
      description: "Get intelligent summaries and explanations"
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Auto Quiz Generator",
      description: "Generate quizzes automatically from your content"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Kahoot-Style Games",
      description: "Play quizzes in group battles with friends"
    },
    {
      icon: <Mic className="h-8 w-8" />,
      title: "Voice Learning",
      description: "Hands-free learning with voice input/output"
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Multilingual",
      description: "Switch between English and Pidgin anytime"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Brain className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                Izabi
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost"  className="text-white border-white hover:bg-white/10">Login</Button>
              </Link>
              <Link to="/signup">
                <Button variant="hero">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-hero opacity-5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-bold mb-6">
              Turn your notes into{" "}
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                AI-powered learning
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Transform PDFs into quizzes, summaries, and voice-guided learning experiences. 
              Study smarter in English & Pidgin with Izabi's AI assistant.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button variant="hero" size="lg" className="min-w-[200px]">
                  Start Learning Free
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="text-white min-w-[200px]">
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything you need to{" "}
              <span className="bg-gradient-secondary bg-clip-text text-transparent">
                excel academically
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Designed for university students, college students, and secondary school students preparing for WAEC/UTME
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-card transition-all duration-300 border-0 bg-card shadow-sm">
                <div className="text-primary mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to revolutionize your studying?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of students already using Izabi to improve their academic performance
          </p>
          <Link to="/signup">
            <Button variant="hero" size="lg" className="min-w-[250px]">
              Get Started Now - It's Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-6 h-6 bg-gradient-primary rounded flex items-center justify-center">
              <Brain className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold bg-gradient-hero bg-clip-text text-transparent">
              Izabi
            </span>
            <span className="text-muted-foreground">- AI-Powered Student Assistant</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;