'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { HelpCircle, CheckCircle2, XCircle, Award, AlertTriangle, ArrowRight, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuizQuestion {
  id: string;
  subjectCode: string;
  unitTitle: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const mockQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    subjectCode: 'ADP1',
    unitTitle: 'Unit 1: Algorithmic Problem Solving',
    question: 'Which of the following data types in standard C is not supported as a switch-case expression condition?',
    options: ['char', 'int', 'float', 'enum'],
    correctIndex: 2,
    explanation: 'switch expressions in C must evaluate to an integral or enumeration type; floating-point numbers are illegal.',
  },
  {
    id: 'q2',
    subjectCode: 'IDE',
    unitTitle: 'Unit 1: Number Systems & Logic Gates',
    question: 'Why are NAND and NOR known as Universal Gates in Digital Electronics?',
    options: [
      'They have the lowest power consumption',
      'Any boolean function can be realized solely using only NAND or only NOR gates',
      'They operate at universal frequency',
      'They have single input only',
    ],
    correctIndex: 1,
    explanation: 'Any combinational logic (AND, OR, NOT, XOR) can be constructed exclusively using NAND or NOR gates.',
  },
  {
    id: 'q3',
    subjectCode: 'DADM',
    unitTitle: 'Unit 3: Normalization',
    question: 'A relational schema is in 2NF if and only if it is in 1NF and:',
    options: [
      'It contains no transitive dependencies',
      'Every non-prime attribute is fully functionally dependent on every candidate key (no partial dependency)',
      'All attributes are numeric',
      'It has only one table',
    ],
    correctIndex: 1,
    explanation: '2NF eliminates partial functional dependency where a non-prime attribute depends on a proper subset of a composite candidate key.',
  },
  {
    id: 'q4',
    subjectCode: 'IWD1',
    unitTitle: 'Unit 2: CSS3 Styling',
    question: 'With `box-sizing: border-box`, what components are included inside the declared width of an element?',
    options: [
      'Content only',
      'Content, Padding, and Border',
      'Content and Margin only',
      'Margin, Border, and Padding',
    ],
    correctIndex: 1,
    explanation: 'border-box causes the declared width/height to encompass the content, padding, and border, avoiding unexpected box expansion.',
  },
];

export default function TestsPage() {
  const { state, addTestAttempt } = useAppStore();

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [wrongTopics, setWrongTopics] = useState<string[]>([]);

  const currentQ = mockQuestions[currentIdx];

  const handleOptionSelect = (index: number) => {
    setSelectedOption(index);
  };

  const handleNext = () => {
    if (selectedOption === null) return;

    let newScore = score;
    const isCorrect = selectedOption === currentQ.correctIndex;
    if (isCorrect) {
      newScore += 1;
      setScore(newScore);
    } else {
      setWrongTopics((prev) => [...prev, `${currentQ.subjectCode} — ${currentQ.unitTitle}`]);
    }

    if (currentIdx + 1 < mockQuestions.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      setIsFinished(true);
      const percentage = Math.round((newScore / mockQuestions.length) * 100);

      addTestAttempt({
        testId: 'test-sem1-diagnostic',
        subjectCode: 'ALL-SEM1',
        unitTitle: 'Semester-I Diagnostic Assessment',
        score: newScore,
        totalMarks: mockQuestions.length,
        percentage,
        weakTopics: wrongTopics,
        recommendations:
          percentage < 70
            ? ['Revise switch-case rules in C', 'Practice 2NF and 3NF decomposition examples', 'Review K-map groupings']
            : ['Outstanding mastery! Move to advanced C pointer and DSA recursion practice.'],
      });

      if (percentage >= 75) {
        confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
      }
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setScore(0);
    setIsFinished(false);
    setWrongTopics([]);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-1">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center justify-center gap-2">
          <HelpCircle className="w-8 h-8 text-indigo-400" />
          <span>Semester-I Unit Knowledge Check & Mock Tests</span>
        </h2>
        <p className="text-xs text-slate-400">
          Verify your retention across ADP1, IDE, DADM, and IWD1. Automatic revision recommendations are generated for low scores.
        </p>
      </div>

      {!isFinished ? (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-indigo-500/30 space-y-6 shadow-2xl">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-indigo-400 font-bold">
              Question {currentIdx + 1} of {mockQuestions.length}
            </span>
            <span className="text-slate-400 font-semibold">{currentQ.subjectCode}</span>
          </div>

          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-indigo-500 h-full transition-all duration-300"
              style={{ width: `${((currentIdx + 1) / mockQuestions.length) * 100}%` }}
            />
          </div>

          {/* Question */}
          <div className="space-y-1">
            <span className="text-[11px] font-mono text-cyan-400">{currentQ.unitTitle}</span>
            <h3 className="text-base font-bold text-white leading-relaxed">{currentQ.question}</h3>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              return (
                <div
                  key={idx}
                  onClick={() => handleOptionSelect(idx)}
                  className={`p-3.5 rounded-2xl border text-xs font-semibold cursor-pointer transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-md'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-slate-950 flex items-center justify-center font-mono text-xs text-indigo-400 border border-slate-800">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Next Button */}
          <div className="flex justify-end pt-3 border-t border-slate-800">
            <button
              onClick={handleNext}
              disabled={selectedOption === null}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2"
            >
              <span>{currentIdx + 1 === mockQuestions.length ? 'Finish Quiz' : 'Next Question'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Results Card */
        <div className="glass-panel p-8 rounded-3xl border border-indigo-500/30 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-indigo-500/20 text-indigo-400 mx-auto flex items-center justify-center">
            <Award className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-xl font-extrabold text-white">Diagnostic Test Completed!</h3>
            <div className="text-3xl font-black text-indigo-400 mt-2 font-mono">
              {score} / {mockQuestions.length} ({Math.round((score / mockQuestions.length) * 100)}%)
            </div>
          </div>

          {wrongTopics.length > 0 ? (
            <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-left space-y-2">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> Recommended Revisions
              </span>
              <ul className="text-xs text-slate-300 space-y-1 list-disc pl-5">
                {wrongTopics.map((wt, i) => (
                  <li key={i}>{wt}</li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-300">
              🌟 Flawless test score! All core concepts retained.
            </div>
          )}

          <button
            onClick={handleRestart}
            className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold transition-colors inline-flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Diagnostic Test</span>
          </button>
        </div>
      )}
    </div>
  );
}
