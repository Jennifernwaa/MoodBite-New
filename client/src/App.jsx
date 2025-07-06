import { useState, useEffect } from 'react';
import MoodSelector from './components/MoodSelector';
import CravingSelector from './components/CravingSelector';
import FoodRecommendations from './components/FoodRecommendations';
import { MoodBiteProvider } from './context/MoodBiteContext';

function App() {
  const [step, setStep] = useState(1);
  
  // Navigation between steps
  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(Math.max(1, step - 1));
  const resetSteps = () => setStep(1);

  return (
    <MoodBiteProvider>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-amber-50 to-orange-100 font-[Poppins]">
        <header className="py-6 px-4 md:px-8 bg-white shadow-sm">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-orange-500 text-3xl">
                <i className="fas fa-utensils"></i>
              </span>
              <h1 className="text-2xl font-semibold text-gray-800">MoodBite</h1>
            </div>
            {step > 1 && (
              <button 
                onClick={resetSteps}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                <i className="fas fa-redo mr-2"></i>
                Start Over
              </button>
            )}
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-5xl flex-1">
          {step === 1 && <MoodSelector onNext={nextStep} />}
          {step === 2 && <CravingSelector onNext={nextStep} onBack={prevStep} />}
          {step === 3 && <FoodRecommendations onBack={prevStep} onReset={resetSteps} />}
        </main>

        <footer className="py-6 px-4 bg-gray-800 text-gray-300 text-sm">
          <div className="container mx-auto">
            <p className="text-center">© {new Date().getFullYear()} MoodBite - Food recommendations based on your mood and cravings</p>
          </div>
        </footer>
      </div>
    </MoodBiteProvider>
  );
}

export default App;