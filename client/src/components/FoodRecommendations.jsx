import React, { useEffect, useState } from 'react';
import { useMoodBite } from '../context/MoodBiteContext';
import FoodCard from './FoodCard';
import { Button, Card, LoadingSpinner } from './UI/index';

function FoodRecommendations({ onBack, onReset }) {
  const { 
    recommendations, 
    generateRecommendations, 
    isLoading, 
    error, 
    selectedMood,
    selectedCravings
  } = useMoodBite();
  
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    cuisine: '',
    dietary: {
      vegetarian: false,
      vegan: false,
      glutenFree: false
    }
  });
  
  const [filteredRecommendations, setFilteredRecommendations] = useState([]);
  
  // Generate recommendations on component mount
  useEffect(() => {
    generateRecommendations();
  }, []);
  
  // Apply filters when recommendations or filters change
  useEffect(() => {
    if (recommendations.length === 0) return;
    
    let filtered = [...recommendations];
    
    // Apply cuisine filter
    if (filters.cuisine) {
      filtered = filtered.filter(item => 
        item.cuisine.toLowerCase().includes(filters.cuisine.toLowerCase())
      );
    }
    
    // Apply dietary filters
    if (filters.dietary.vegetarian) {
      filtered = filtered.filter(item => item.dietary_info?.vegetarian);
    }
    
    if (filters.dietary.vegan) {
      filtered = filtered.filter(item => item.dietary_info?.vegan);
    }
    
    if (filters.dietary.glutenFree) {
      filtered = filtered.filter(item => item.dietary_info?.gluten_free);
    }
    
    setFilteredRecommendations(filtered);
  }, [recommendations, filters]);
  
  // Handle cuisine filter change
  const handleCuisineChange = (e) => {
    setFilters({
      ...filters,
      cuisine: e.target.value
    });
  };
  
  // Handle dietary filter change
  const handleDietaryChange = (id, checked) => {
    setFilters({
      ...filters,
      dietary: {
        ...filters.dietary,
        [id]: checked
      }
    });
  };
  
  // Get unique cuisines from recommendations
  const cuisines = [...new Set(recommendations.map(item => item.cuisine))].sort();
  
  // Mood and craving descriptions for the header
  const getMoodDescription = (mood) => {
    const descriptions = {
      happy: "joyful",
      sad: "blue",
      stressed: "tense",
      relaxed: "chill",
      energetic: "vibrant",
      tired: "exhausted",
      bored: "unstimulated",
      nostalgic: "reminiscent",
      romantic: "affectionate",
      anxious: "worried"
    };
    return descriptions[mood] || mood;
  };
  
  return (
    <div className="space-y-6">
      <Card className="max-w-5xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Your Food Recommendations</h2>
          <p className="text-gray-600">
            Based on your {getMoodDescription(selectedMood)} mood 
            {selectedCravings.length > 0 ? ` and ${selectedCravings.join(', ')} cravings` : ''}
          </p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
            <span className="ml-3 text-lg text-gray-600">Finding the perfect food for your mood...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-red-700">{error}</p>
            <Button onClick={onReset} variant="secondary" className="mt-4">
              Start Over
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center text-gray-700 hover:text-gray-900"
              >
                <i className={`fas fa-filter mr-2 ${showFilters ? 'text-amber-500' : ''}`}></i>
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
              
              {showFilters && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label htmlFor="cuisine" className="block text-sm font-medium text-gray-700 mb-1">
                        Cuisine Type
                      </label>
                      <select
                        id="cuisine"
                        value={filters.cuisine}
                        onChange={handleCuisineChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="">All Cuisines</option>
                        {cuisines.map(cuisine => (
                          <option key={cuisine} value={cuisine}>
                            {cuisine}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <p className="block text-sm font-medium text-gray-700 mb-1">
                        Dietary Preferences
                      </p>
                      <div className="flex flex-wrap gap-4">
                        <label className="inline-flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.dietary.vegetarian}
                            onChange={(e) => handleDietaryChange('vegetarian', e.target.checked)}
                            className="rounded text-amber-500 focus:ring-amber-500"
                          />
                          <span className="ml-2">Vegetarian</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.dietary.vegan}
                            onChange={(e) => handleDietaryChange('vegan', e.target.checked)}
                            className="rounded text-amber-500 focus:ring-amber-500"
                          />
                          <span className="ml-2">Vegan</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.dietary.glutenFree}
                            onChange={(e) => handleDietaryChange('glutenFree', e.target.checked)}
                            className="rounded text-amber-500 focus:ring-amber-500"
                          />
                          <span className="ml-2">Gluten Free</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {filteredRecommendations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRecommendations.map(food => (
                  <FoodCard key={food.food_id} food={food} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-lg text-gray-600">
                  {recommendations.length > 0 ? 
                    "No foods match your current filters. Try adjusting them." : 
                    "We couldn't find any recommendations. Please try another mood or craving combination."}
                </p>
              </div>
            )}
            
            <div className="flex justify-between mt-8">
              <Button 
                onClick={onBack}
                variant="secondary"
              >
                <i className="fas fa-arrow-left mr-2"></i>
                Adjust Cravings
              </Button>
              
              <Button 
                onClick={onReset}
                variant="outline"
              >
                <i className="fas fa-redo mr-2"></i>
                Start Over
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}

export default FoodRecommendations;