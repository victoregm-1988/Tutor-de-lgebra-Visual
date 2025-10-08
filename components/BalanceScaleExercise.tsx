import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Difficulty, EquationProblem } from '../types';

interface BalanceScaleExerciseProps {
  difficulty: Difficulty;
  onCorrectAnswer: () => void;
  onDifficultyChange: (newDifficulty: Difficulty) => void;
}

const BalanceScaleExercise: React.FC<BalanceScaleExerciseProps> = ({ difficulty, onCorrectAnswer, onDifficultyChange }) => {
  const [problem, setProblem] = useState<EquationProblem | null>(null);
  const [userInput, setUserInput] = useState<string>('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const generateProblem = useCallback(() => {
    let a_range = [2, 3], x_range = [2, 5], b_range = [1, 10];

    switch (difficulty) {
      case Difficulty.MEDIUM:
        a_range = [3, 5]; x_range = [5, 10]; b_range = [5, 20];
        break;
      case Difficulty.DIFFICULT:
        a_range = [4, 7]; x_range = [8, 15]; b_range = [10, 30];
        break;
    }
    
    const a = Math.floor(Math.random() * (a_range[1] - a_range[0] + 1)) + a_range[0];
    const x = Math.floor(Math.random() * (x_range[1] - x_range[0] + 1)) + x_range[0];
    const b = Math.floor(Math.random() * (b_range[1] - b_range[0] + 1)) + b_range[0];
    const c = a * x + b;

    setProblem({ a, b, c, solution: x });
    setUserInput('');
    setFeedback(null);
  }, [difficulty]);

  useEffect(() => {
    generateProblem();
  }, [generateProblem]);

  useEffect(() => {
    // Clear timeout on component unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleCheckAnswer = () => {
    if (problem && parseInt(userInput, 10) === problem.solution) {
      setFeedback('correct');
      onCorrectAnswer();
      timeoutRef.current = window.setTimeout(() => {
        generateProblem();
      }, 2000);
    } else {
      setFeedback('incorrect');
    }
  };
  
  const handleManualNext = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    generateProblem();
  };

  const difficultyLevels = useMemo(() => Object.values(Difficulty), []);

  if (!problem) {
    return <div className="text-center p-10">Carregando exercício...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-center text-amber-700 mb-4">Exercício 1: Balança de Equilíbrio</h2>
      <div className="flex justify-center gap-2 mb-6">
        {difficultyLevels.map(level => (
          <button key={level} onClick={() => {
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
            }
            onDifficultyChange(level);
          }} className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${difficulty === level ? 'bg-amber-500 text-white shadow' : 'bg-amber-100 text-amber-800 hover:bg-amber-200'}`}>
            {level}
          </button>
        ))}
      </div>

      <div className="flex flex-col items-center my-4 p-2 bg-slate-50 rounded-lg">
        {/* The two pans */}
        <div className="flex w-full justify-around items-start">
          <div className="flex items-center justify-center flex-wrap gap-2 p-2 bg-gray-200 border-2 border-gray-400 rounded-lg min-h-[80px] w-2/5">
            {Array.from({ length: problem.a }).map((_, i) => (
              <div key={`x-${i}`} className="w-10 h-10 bg-orange-500 rounded flex items-center justify-center font-bold text-white shadow-md text-lg">x</div>
            ))}
            {Array.from({ length: problem.b }).map((_, i) => (
              <div key={`b-${i}`} className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center font-bold text-white text-xs shadow-md">1</div>
            ))}
          </div>
          <div className="flex items-center justify-center flex-wrap gap-2 p-2 bg-gray-200 border-2 border-gray-400 rounded-lg min-h-[80px] w-2/5">
            {Array.from({ length: problem.c }).map((_, i) => (
              <div key={`c-${i}`} className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center font-bold text-white text-xs shadow-md">1</div>
            ))}
          </div>
        </div>

        {/* The scale structure */}
        <div className="w-full max-w-md -mt-2">
          {/* The strings connecting pans to beam */}
          <div className="flex justify-around h-10">
            <div className="w-1 bg-gray-600"></div>
            <div className="w-1 bg-gray-600"></div>
          </div>
          {/* The beam itself */}
          <div className="h-2 bg-gray-600"></div>
          {/* The fulcrum */}
          <div className="flex justify-center">
            <div className="w-0 h-0 border-x-8 border-x-transparent border-b-[16px] border-b-gray-600"></div>
          </div>
        </div>
      </div>
      
      <p className="text-center text-lg mt-4 mb-4">Cada caixa 'x' tem o mesmo peso. Qual o peso de <span className="font-bold">uma</span> caixa 'x' para a balança ficar equilibrada?</p>
      
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <div className="flex items-center gap-2">
            <span className="font-semibold text-lg">x =</span>
            <input 
              type="number"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCheckAnswer()}
              disabled={feedback === 'correct'}
              className="w-24 text-center text-lg p-2 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
              aria-label="Resposta para x"
            />
        </div>
        {feedback !== 'correct' ? (
          <button onClick={handleCheckAnswer} className="bg-amber-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-amber-700 transition shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500">
            Verificar
          </button>
        ) : (
          <button onClick={handleManualNext} className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 transition shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
            Próximo
          </button>
        )}
      </div>

      {feedback && (
        <div className={`mt-4 text-center text-lg font-semibold p-3 rounded-lg ${feedback === 'correct' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {feedback === 'correct' ? 'Correto! Você equilibrou a balança!' : 'Tente de novo! A matemática é prática.'}
        </div>
      )}
    </div>
  );
};

export default BalanceScaleExercise;