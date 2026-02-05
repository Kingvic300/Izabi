const { MongoClient } = require('mongodb');

// MongoDB connection URI
const MONGODB_URI = 'mongodb+srv://Kingvic:Kingvic300@student-app.cqzbps5.mongodb.net/StudentApp?retryWrites=true&w=majority&appName=Student-App';

async function seedExams() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('izabi_db');
    const examsCollection = db.collection('exams');

    const sampleExams = [
      // JAMB
      {
        title: "JAMB Biology 2023",
        type: "JAMB",
        category: "Secondary",
        subject: "Biology",
        year: 2023,
        questions: [
          {
            question: "Which of the following organelles is known as the powerhouse of the cell?",
            options: ["Nucleus", "Mitochondria", "Ribosome", "Golgi Body"],
            answer: "Mitochondria",
            explanation: "Mitochondria are responsible for ATP production through cellular respiration."
          },
          {
            question: "The process by which plants lose water through their leaves is called?",
            options: ["Osmosis", "Photosynthesis", "Transpiration", "Respiration"],
            answer: "Transpiration",
            explanation: "Transpiration is the evaporation of water from plant leaves."
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // WAEC
      {
        title: "WAEC Chemistry 2022",
        type: "WAEC",
        category: "Secondary",
        subject: "Chemistry",
        year: 2022,
        questions: [
          {
            question: "What is the atomic number of Carbon?",
            options: ["6", "12", "14", "8"],
            answer: "6",
            explanation: "Carbon is the 6th element in the periodic table."
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // NECO
      {
        title: "NECO Physics 2021",
        type: "NECO",
        category: "Secondary",
        subject: "Physics",
        year: 2021,
        questions: [
          {
            question: "The unit of electric current is?",
            options: ["Volt", "Ohm", "Ampere", "Watt"],
            answer: "Ampere",
            explanation: "Current is measured in Amperes (A)."
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // UNILAG (University)
      {
        title: "CSC 201: Introduction to Programming",
        type: "UNI-COURSE",
        category: "University",
        institution: "UNILAG",
        subject: "Computer Science",
        year: 2023,
        questions: [
          {
            question: "Which of these is not a high-level programming language?",
            options: ["Python", "Java", "Assembly", "C++"],
            answer: "Assembly",
            explanation: "Assembly is a low-level language."
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // UI (University)
      {
        title: "MAT 101: Calculus I",
        type: "UNI-COURSE",
        category: "University",
        institution: "UI",
        subject: "Mathematics",
        year: 2023,
        questions: [
          {
            question: "The derivative of sin(x) is?",
            options: ["cos(x)", "-cos(x)", "tan(x)", "sec(x)"],
            answer: "cos(x)",
            explanation: "The derivative of the sine function is the cosine function."
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    console.log('Seeding exams...');
    await examsCollection.deleteMany({}); // Clear existing for demo
    await examsCollection.insertMany(sampleExams);
    console.log('Exams seeded successfully!');

  } catch (error) {
    console.error('Error seeding exams:', error);
  } finally {
    await client.close();
  }
}

seedExams();
