import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Difficulty, EquationProblem } from '../types';

interface FieldPerimeterExerciseProps {
  difficulty: Difficulty;
  onCorrectAnswer: () => void;
  onDifficultyChange: (newDifficulty: Difficulty) => void;
}

const FieldPerimeterExercise: React.FC<FieldPerimeterExerciseProps> = ({ difficulty, onCorrectAnswer, onDifficultyChange }) => {
  const [problem, setProblem] = useState<EquationProblem | null>(null);
  const [userInput, setUserInput] = useState<string>('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const generateProblem = useCallback(() => {
    // Equation is 2x + b = c, so a is always 2.
    const a = 2;
    let x_range = [5, 10], b_range = [10, 30];

    switch (difficulty) {
      case Difficulty.MEDIUM:
        x_range = [10, 25]; b_range = [20, 50];
        break;
      case Difficulty.DIFFICULT:
        x_range = [20, 50]; b_range = [40, 100];
        break;
    }
    
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
      <h2 className="text-2xl font-bold text-center text-lime-700 mb-4">Exercício 2: Cercando o Terreno</h2>
      <div className="flex justify-center gap-2 mb-6">
        {difficultyLevels.map(level => (
          <button key={level} onClick={() => {
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
            }
            onDifficultyChange(level);
          }} className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${difficulty === level ? 'bg-lime-600 text-white shadow' : 'bg-lime-100 text-lime-800 hover:bg-lime-200'}`}>
            {level}
          </button>
        ))}
      </div>

      <div className="flex flex-col items-center space-y-4 my-4">
        <p className="text-lg text-center">Você tem <span className="font-bold text-blue-600">{problem.c} metros</span> de cerca para os três lados de um terreno retangular.</p>
        <div className="relative w-full max-w-md aspect-[3/2] bg-green-200 border-4 border-dashed border-green-600 rounded-lg p-4 flex justify-center items-center">
          <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-white/70 px-2 rounded font-semibold text-green-800 text-lg">Lado conhecido: {problem.b}m</div>
          <div className="absolute left-2 top-1/2 -translate-y-1/2 -rotate-90 font-semibold text-green-800 text-lg">Lado: x</div>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 rotate-90 font-semibold text-green-800 text-lg">Lado: x</div>
          <div className="absolute bottom-0 w-full h-8 bg-blue-300 rounded-b-sm flex items-center justify-center font-semibold text-blue-800">Rio (sem cerca)</div>
        </div>
      </div>
      
      <p className="text-center text-lg mt-4 mb-4">Qual o comprimento, em metros, de cada um dos outros dois lados (<span className="font-bold">x</span>)?</p>
      
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <div className="flex items-center gap-2">
            <span className="font-semibold text-lg">x =</span>
            <input 
              type="number"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCheckAnswer()}
              disabled={feedback === 'correct'}
              className="w-24 text-center text-lg p-2 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition"
              aria-label="Resposta para x"
            />
             <span className="font-semibold text-lg">metros</span>
        </div>
        {feedback !== 'correct' ? (
          <button onClick={handleCheckAnswer} className="bg-lime-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-lime-700 transition shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500">
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
          {feedback === 'correct' ? 'Ótimo trabalho! Terreno medido corretamente!' : 'Quase lá! Verifique seus cálculos.'}
        </div>
      )}
    </div>
  );
};

export default FieldPerimeterExercise;