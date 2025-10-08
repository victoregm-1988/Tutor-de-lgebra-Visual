import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Difficulty, EquationProblem } from '../types';

const FruitStallExercise: React.FC = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.EASY);
  const [problem, setProblem] = useState<EquationProblem | null>(null);
  const [userInput, setUserInput] = useState<string>('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const generateProblem = useCallback(() => {
    let a_range = [2, 4], x_range = [2, 5], b_range = [3, 8];

    switch (difficulty) {
      case Difficulty.MEDIUM:
        a_range = [3, 6]; x_range = [5, 10]; b_range = [5, 15];
        break;
      case Difficulty.DIFFICULT:
        a_range = [5, 8]; x_range = [8, 12]; b_range = [10, 25];
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
      <h2 className="text-2xl font-bold text-center text-red-700 mb-4">Exercício 3: Barraca de Frutas</h2>
      <div className="flex justify-center gap-2 mb-6">
        {difficultyLevels.map(level => (
          <button key={level} onClick={() => {
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
            }
            setDifficulty(level);
          }} className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${difficulty === level ? 'bg-red-500 text-white shadow' : 'bg-red-100 text-red-800 hover:bg-red-200'}`}>
            {level}
          </button>
        ))}
      </div>

      <div className="flex flex-col items-center space-y-4 my-4">
        <div className="flex items-center justify-center gap-2 sm:gap-4 p-4 bg-yellow-100/70 rounded-lg flex-wrap">
          {Array.from({ length: problem.a }).map((_, i) => (
            <div key={i} className="flex flex-col items-center p-2">
                <span className="text-4xl sm:text-5xl">🍎</span>
                <span className="font-semibold bg-white px-2 py-1 rounded shadow-sm">R$ x</span>
            </div>
          ))}
          <div className="text-3xl sm:text-4xl font-bold text-gray-600">+</div>
          <div className="flex flex-col items-center p-2">
            <span className="text-4xl sm:text-5xl">🍈</span>
            <span className="font-semibold bg-white px-2 py-1 rounded shadow-sm">R$ {problem.b}</span>
          </div>
        </div>
        <p className="text-lg text-center font-semibold">Total da Compra: <span className="font-bold text-emerald-600 text-xl">R$ {problem.c},00</span></p>
      </div>

      <p className="text-center text-lg mt-4 mb-4">Você comprou {problem.a} sacolas de maçãs de mesmo preço e um melão. Quanto custou cada sacola de maçãs (<span className="font-bold">x</span>)?</p>
      
       <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <div className="flex items-center gap-2">
            <span className="font-semibold text-lg">R$</span>
            <input 
              type="number"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCheckAnswer()}
              disabled={feedback === 'correct'}
              className="w-24 text-center text-lg p-2 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
              aria-label="Resposta para x"
            />
        </div>
        {feedback !== 'correct' ? (
          <button onClick={handleCheckAnswer} className="bg-red-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-700 transition shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
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
          {feedback === 'correct' ? 'Exato! Boa compra!' : 'Opa, o troco não vai bater. Tente de novo!'}
        </div>
      )}
    </div>
  );
};

export default FruitStallExercise;