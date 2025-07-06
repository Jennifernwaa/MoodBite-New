import React, { useState } from 'react';
import { useMoodBite } from '../context/MoodBiteContext';
import { Button, Card, Checkbox } from './UI/index';

const cravingOptions = [
  { id: 'comfort', label: 'Comfort Food', icon: '🧸', description: 'Familiar and satisfying' },
  { id: 'energizing', label: 'Energizing', icon: '⚡', description: 'Boost your energy' },
  { id: 'refreshing', label: 'Refreshing', icon: '❄️', description: 'Cool and revitalizing' },
  { id: 'indulgent', label: 'Indulgent', icon: '🎭', description: 'Treat yourself' },
  { id: 'healthy', label: 'Healthy', icon: '🥗', description: 'Nutritious options' },
  { id: 'quick', label: 'Quick & Easy', icon: '⏱️', description: 'Ready in no time' },
  { id: 'hearty', label: 'Hearty', icon: '🔥', description: 'Filling and substantial' },
  { id: 'light', label: 'Light', icon: '☁️', description: 'Not too heavy' },
];

const tasteOptions = [
  { id: 'sweet', label: 'Sweet', icon: '🍯' },
  { id: 'salty', label: 'Salty', icon: '🧂' },
  { id: 'spicy', label: 'Spicy', icon: '🌶️' },
  { id: 'savory', label: 'Savory', icon: '🍲' },
  { id: 'sour', label: 'Sour', icon: '🍋' },
  { id: 'bitter', label: 'Bitter', icon: '☕' },
  { id: 'umami', label: 'Umami', icon: '🍄' },
];

function CravingSelector({ onNext, onBack }) {
  const { 
    selectedCravings, 
    setSelectedCravings, 
    tastePreferences, 
    setTastePreferences 
  } = useMoodBite();
  
  const [error, setError] = useState('');

  const handleCravingToggle = (cravingId) => {
    setSelectedCravings(prevCravings => {
      if (prevCravings.includes(cravingId)) {
        return prevCravings.filter(id => id !== cravingId);
      } else {
        return [...prevCravings, cravingId];
      }
    });
    setError('');
  };

  const handleTasteToggle = (tasteId) => {
    setTastePreferences(prev => ({
      ...prev,
      [tasteId]: !prev[tasteId]
    }));
  };

  const handleContinue = () => {
    if (selectedCravings.length === 0) {
      setError('Please select at least one craving type');
      return;
    }
    
    const hasTasteSelected = Object.values(tastePreferences).some(value => value);
    if (!hasTasteSelected) {
      setError('Please select at least one taste preference');
      return;
    }
    
    onNext();
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">What are you craving?</h2>
        <p className="text-gray-600">Select the types of food you're in the mood for</p>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-medium text-gray-800 mb-4">Craving type</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {cravingOptions.map((craving) => (
            <button
              key={craving.id}
              onClick={() => handleCravingToggle(craving.id)}
              className={`p-4 rounded-lg flex flex-col items-center justify-center transition-all text-center ${
                selectedCravings.includes(craving.id)
                  ? 'bg-amber-100 border-2 border-amber-600 shadow-md'
                  : 'bg-white border border-gray-200 hover:border-gray-300 hover:shadow'
              }`}
            >
              <span className="text-3xl mb-2">{craving.icon}</span>
              <span className="font-medium">{craving.label}</span>
              <span className="text-xs text-gray-500 mt-1">{craving.description}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-medium text-gray-800 mb-4">Taste preferences</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {tasteOptions.map((taste) => (
            <div key={taste.id} className="flex items-center">
              <Checkbox
                id={`taste-${taste.id}`}
                checked={tastePreferences[taste.id]}
                onChange={() => handleTasteToggle(taste.id)}
                label={
                  <span className="flex items-center">
                    <span className="mr-2">{taste.icon}</span>
                    {taste.label}
                  </span>
                }
              />
            </div>
          ))}
        </div>
      </div>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <div className="flex justify-between">
        <Button 
          onClick={onBack}
          variant="secondary"
        >
          <i className="fas fa-arrow-left mr-2"></i>
          Back to Mood
        </Button>
        
        <Button 
          onClick={handleContinue}
          variant="primary"
          size="lg"
        >
          Get Recommendations
          <i className="fas fa-utensils ml-2"></i>
        </Button>
      </div>
    </Card>
  );
}

export default CravingSelector;