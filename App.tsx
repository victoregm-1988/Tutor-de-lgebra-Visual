import React, { useState } from 'react';
import BalanceScaleExercise from './components/BalanceScaleExercise';
import FieldPerimeterExercise from './components/FieldPerimeterExercise';
import FruitStallExercise from './components/FruitStallExercise';

type Exercise = 'balance' | 'perimeter' | 'fruits';

const TABS: { id: Exercise; name: string; icon: string }[] = [
    { id: 'balance', name: 'Balança', icon: '⚖️' },
    { id: 'perimeter', name: 'Terreno', icon: '🌳' },
    { id: 'fruits', name: 'Feira', icon: '🍎' },
];

const App: React.FC = () => {
  const [currentExercise, setCurrentExercise] = useState<Exercise>('balance');

  const renderExercise = () => {
    switch (currentExercise) {
      case 'balance':
        return <BalanceScaleExercise />;
      case 'perimeter':
        return <FieldPerimeterExercise />;
      case 'fruits':
        return <FruitStallExercise />;
      default:
        return <BalanceScaleExercise />;
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
