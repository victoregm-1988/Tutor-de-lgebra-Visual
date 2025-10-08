import React, { useState } from 'react';
import BalanceScaleExercise from './components/BalanceScaleExercise';
import FieldPerimeterExercise from './components/FieldPerimeterExercise';
import FruitStallExercise from './components/FruitStallExercise';
import { Difficulty } from './types';

type Exercise = 'balance' | 'perimeter' | 'fruits';

interface ExerciseProgress {
  difficulty: Difficulty;
  correctStreak: number;
}

const TABS: { id: Exercise; name: string; icon: string }[] = [
    { id: 'balance', name: 'Balança', icon: '⚖️' },
    { id: 'perimeter', name: 'Terreno', icon: '🌳' },
    { id: 'fruits', name: 'Feira', icon: '🍎' },
];

const DIFFICULTY_ORDER = [Difficulty.EASY, Difficulty.MEDIUM, Difficulty.DIFFICULT];

const App: React.FC = () => {
  const [currentExercise, setCurrentExercise] = useState<Exercise>('balance');
  const [progress, setProgress] = useState<Record<Exercise, ExerciseProgress>>({
    balance: { difficulty: Difficulty.EASY, correctStreak: 0 },
    perimeter: { difficulty: Difficulty.EASY, correctStreak: 0 },
    fruits: { difficulty: Difficulty.EASY, correctStreak: 0 },
  });

  const handleCorrectAnswer = () => {
    const currentProgress = progress[currentExercise];
    const newStreak = currentProgress.correctStreak + 1;

    if (newStreak >= 5) {
      const currentDifficultyIndex = DIFFICULTY_ORDER.indexOf(currentProgress.difficulty);
      
      if (currentDifficultyIndex === DIFFICULTY_ORDER.length - 1) { // Is 'Difícil'
        const currentTabIndex = TABS.findIndex(tab => tab.id === currentExercise);
        const nextTabIndex = (currentTabIndex + 1) % TABS.length;
        setCurrentExercise(TABS[nextTabIndex].id);
        
        // Reset streak for the exercise we are leaving
        setProgress(prev => ({
          ...prev,
          [currentExercise]: { ...prev[currentExercise], correctStreak: 0 }
        }));
      } else { // Not the highest difficulty, so level up
        const nextDifficulty = DIFFICULTY_ORDER[currentDifficultyIndex + 1];
        setProgress(prev => ({
          ...prev,
          [currentExercise]: { difficulty: nextDifficulty, correctStreak: 0 }
        }));
      }
    } else { // Streak is not yet 5, just increment
      setProgress(prev => ({
        ...prev,
        [currentExercise]: { ...prev[currentExercise], correctStreak: newStreak }
      }));
    }
  };
  
  const handleDifficultyChange = (newDifficulty: Difficulty) => {
    setProgress(prev => ({
        ...prev,
        [currentExercise]: { difficulty: newDifficulty, correctStreak: 0 }
    }));
  };

  const renderExercise = () => {
    const props = {
      difficulty: progress[currentExercise].difficulty,
      onCorrectAnswer: handleCorrectAnswer,
      onDifficultyChange: handleDifficultyChange,
    };

    switch (currentExercise) {
      case 'balance':
        return <BalanceScaleExercise {...props} />;
      case 'perimeter':
        return <FieldPerimeterExercise {...props} />;
      case 'fruits':
        return <FruitStallExercise {...props} />;
      default:
        return <BalanceScaleExercise {...props} />;
    }
  };

  return (
    <div className="min-h-screen bg-green-50/50 font-sans p-4 sm:p-6 text-slate-800">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-green-800 mb-2">
            Tutor de Álgebra Visual
          </h1>
          <p className="text-base sm:text-lg text-green-700">
            Resolva equações da forma <span className="font-mono font-semibold bg-green-100 px-2 py-1 rounded">ax + b = c</span> de maneira prática e divertida!
          </p>
        </header>
        
        <div className="flex justify-center border-b-2 border-green-200 mb-6" aria-label="Navegação de exercícios">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setCurrentExercise(tab.id)}
              className={`flex items-center gap-2 px-3 sm:px-6 py-3 text-sm sm:text-lg font-semibold transition-all duration-300 ease-in-out -mb-0.5 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500 rounded-t-lg ${
                currentExercise === tab.id
                  ? 'border-b-4 border-green-600 text-green-700'
                  : 'text-gray-500 hover:text-green-600 hover:bg-green-100/50'
              }`}
              aria-current={currentExercise === tab.id ? 'page' : undefined}
            >
              <span className="text-xl sm:text-2xl">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </div>
        
        <div className="text-center mb-4 text-gray-600 bg-white/50 rounded-lg p-2 border">
            <p className="font-semibold">Nível Atual: <span className="font-bold text-green-700">{progress[currentExercise].difficulty}</span> | Acertos seguidos: <span className="font-bold text-green-700">{progress[currentExercise].correctStreak} / 5</span></p>
        </div>

        <main>
          {renderExercise()}
        </main>
        
        <footer className="text-center text-sm text-gray-500 mt-12">
          <p>Criado para inspirar o aprendizado da matemática no campo.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;