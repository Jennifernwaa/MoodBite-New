import React, { useState } from 'react';
import { useMoodBite } from '../context/MoodBiteContext';
import { Button, Card, Slider } from './UI/index';

const moodOptions = [
  { id: 'happy', label: 'Happy', icon: '😊', color: 'bg-yellow-100' },
  { id: 'sad', label: 'Sad', icon: '😢', color: 'bg-blue-100' },
  { id: 'stressed', label: 'Stressed', icon: '😰', color: 'bg-red-100' },
  { id: 'relaxed', label: 'Relaxed', icon: '😌', color: 'bg-green-100' },
  { id: 'energetic', label: 'Energetic', icon: '⚡', color: 'bg-purple-100' },
  { id: 'tired', label: 'Tired', icon: '😴', color: 'bg-gray-100' },
  { id: 'bored', label: 'Bored', icon: '😑', color: 'bg-indigo-100' },
  { id: 'nostalgic', label: 'Nostalgic', icon: '🕰️', color: 'bg-amber-100' },
  { id: 'romantic', label: 'Romantic', icon: '❤️', color: 'bg-pink-100' },
  { id: 'anxious', label: 'Anxious', icon: '😟', color: 'bg-orange-100' },
];

function MoodSelector({ onNext }) {
  const { selectedMood, setSelectedMood, moodIntensity, setMoodIntensity } = useMoodBite();
  const [error, setError] = useState('');

  const handleMoodSelect = (moodId) => {
    setSelectedMood(moodId);
    setError('');
  };

  const handleContinue = () => {
    if (!selectedMood) {
      setError('Please select your current mood');
      return;
    }
    onNext();
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">How are you feeling today?</h2>
        <p className="text-gray-600">Let's find the perfect food to match your mood</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-8">
        {moodOptions.map((mood) => (
          <button
            key={mood.id}
            onClick={() => handleMoodSelect(mood.id)}
            className={`p-4 rounded-lg flex flex-col items-center justify-center transition-all ${
              selectedMood === mood.id 
                ? `${mood.color} border-2 border-gray-800 shadow-md transform scale-105` 
                : 'bg-white border border-gray-200 hover:border-gray-300 hover:shadow'
            }`}
          >
            <span className="text-4xl mb-2">{mood.icon}</span>
            <span className="font-medium">{mood.label}</span>
          </button>
        ))}
      </div>

      {selectedMood && (
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-800 mb-4">How strongly do you feel this way?</h3>
          <Slider 
            min={1}
            max={10}
            value={moodIntensity}
            onChange={(value) => setMoodIntensity(value)}
            labels={{
              1: 'Slightly',
              5: 'Moderately',
              10: 'Intensely'
            }}
          />
        </div>
      )}

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <div className="flex justify-center">
        <Button 
          onClick={handleContinue}
          variant="primary"
          size="lg"
        >
          Continue to Cravings
          <i className="fas fa-arrow-right ml-2"></i>
        </Button>
      </div>
    </Card>
  );
}

export default MoodSelector;