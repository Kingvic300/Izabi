
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: string; 
}

export interface StudyMaterial {
  summary: string;
  quiz: QuizQuestion[];
}
