import React, { useState } from 'react';
import { Brain } from 'lucide-react';
import { IRT_QUESTION_BANK } from '../data/mockData';

/**
 * Adaptive Test Component
 * Uses IRT (Item Response Theory) to assess student competency
 */
const AdaptiveTest = ({ onComplete }) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [theta, setTheta] = useState(0); 

  const handleAnswer = (optionIndex) => {
    const isCorrect = optionIndex === IRT_QUESTION_BANK[currentQ].correct;
    const newTheta = isCorrect ? theta + 1.0 : theta - 0.5;
    setTheta(newTheta);
    
    const newAnswers = [...answers, { q: currentQ, correct: isCorrect }];
    setAnswers(newAnswers);

    if (currentQ < IRT_QUESTION_BANK.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      onComplete(newTheta, newAnswers);
    }
  };

  const question = IRT_QUESTION_BANK[currentQ];

  return (
    <div className="max-w-2xl mx-auto bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700 animate-in fade-in zoom-in duration-300">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Brain className="text-indigo-400" />
          Competency Assessment
        </h2>
        <span className="text-sm text-slate-400">Question {currentQ + 1} of {IRT_QUESTION_BANK.length}</span>
      </div>
      
      <div className="mb-2 flex gap-1 h-1 w-full bg-slate-700 rounded-full overflow-hidden">
        <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${((currentQ)/IRT_QUESTION_BANK.length)*100}%` }}></div>
      </div>
      <p className="text-xs text-slate-500 mb-6 text-right">Calibrating difficulty...</p>

      <p className="text-lg text-slate-200 mb-8 font-medium leading-relaxed">{question.text}</p>

      <div className="space-y-3">
        {question.options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => handleAnswer(idx)}
            className="w-full text-left p-4 rounded-lg bg-slate-700 hover:bg-slate-600 hover:border-indigo-500 border border-transparent transition-all text-slate-200 font-medium"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AdaptiveTest;
