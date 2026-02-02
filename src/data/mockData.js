/**
 * MOCK DATA & CONFIGURATION
 */

// Curriculum Graph (Simulating Neo4j)
export const KNOWLEDGE_GRAPH = [
  { id: 'cs101', label: 'Intro to Logic', x: 100, y: 150, prereqs: [], domain: 'CS' },
  { id: 'math101', label: 'Discrete Math', x: 100, y: 300, prereqs: [], domain: 'Math' },
  { id: 'cs102', label: 'Pointers & Memory', x: 300, y: 150, prereqs: ['cs101'], domain: 'CS' },
  { id: 'ds101', label: 'Data Structures', x: 500, y: 225, prereqs: ['cs102', 'math101'], domain: 'CS' },
  { id: 'algo101', label: 'Algorithms', x: 700, y: 225, prereqs: ['ds101'], domain: 'CS' },
  { id: 'sys101', label: 'OS Principles', x: 700, y: 100, prereqs: ['cs102'], domain: 'Systems' },
];

// Adaptive Test Questions (Simulating IRT Item Bank)
export const IRT_QUESTION_BANK = [
  {
    id: 1,
    difficulty: 'easy',
    text: "What is the time complexity of accessing an array element by index?",
    options: ["O(1)", "O(n)", "O(log n)", "O(n^2)"],
    correct: 0,
    concept: "Arrays"
  },
  {
    id: 2,
    difficulty: 'medium',
    text: "In a Max-Heap, where is the smallest element guaranteed to be?",
    options: [" The root", "A leaf node", "The middle index", "It varies"],
    correct: 1,
    concept: "Heaps"
  },
  {
    id: 3,
    difficulty: 'hard',
    text: "Which of the following solves the 'ABA problem' in concurrent programming?",
    options: ["Mutex Locks", "Semaphores", "Double-Checked Locking", "Tagged Pointers / CAS"],
    correct: 3,
    concept: "Concurrency"
  }
];

// User Quests (Engineering Gamification)
export const QUESTS = [
  { id: 1, title: "Memory Master", desc: "Solve a problem using < 2MB Memory", progress: 80, reward: "Badge: Minimalist" },
  { id: 2, title: "Clean Code", desc: "Pass static analysis with 0 warnings", progress: 40, reward: "+50 Efficiency Pts" },
  { id: 3, title: "Peer Review", desc: "Review 2 Jigsaw module PRs", progress: 0, reward: "Mentor Status" }
];
