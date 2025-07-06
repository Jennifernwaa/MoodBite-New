import React, { createContext, useContext, useState, useEffect } from 'react';
import { getRecommendations } from '../utils/recommendationEngine';


const MoodBiteContext = createContext();

// Custom hook for using context
export const useMoodBite = () => {
  const context = useContext(MoodBiteContext);
  if (!context) {
    throw new Error('useMoodBite must be used within a MoodBiteProvider');
  }
  return context;
};

// Provider component
export const MoodBiteProvider = ({ children }) => {
  // State for mood selection
  const [selectedMood, setSelectedMood] = useState(null);
  const [moodIntensity, setMoodIntensity] = useState(5); // 1-10 scale
  
  // State for craving selection
  const [selectedCravings, setSelectedCravings] = useState([]);
  const [tastePreferences, setTastePreferences] = useState({
    sweet: false,
    salty: false,
    spicy: false,
    savory: false,
    sour: false,
    bitter: false,
    umami: false,
  });
  
  // State for food data and recommendations
  const [foodData, setFoodData] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // State for user preferences (simplified for demo)
  const [userPreferences, setUserPreferences] = useState({
    favoriteIngredients: [],
    dislikedIngredients: [],
    dietaryRestrictions: {
      vegetarian: false,
      vegan: false,
      glutenFree: false,
      dairyFree: false,
      nutFree: false,
    }
  });
  
  // Fetch food data on component mount
  useEffect(() => {
    const fetchFoodData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/data/moodbite_food_dataset.json');
        if (!response.ok) {
          throw new Error('Failed to load food data');
        }
        const data = await response.json();
        setFoodData(data);
      } catch (err) {
        setError(err.message);
        console.error('Error loading food data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFoodData();
  }, []);
  
  // Generate recommendations based on mood and cravings
  const generateRecommendations = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      try {
        if (!selectedMood) {
          throw new Error('Please select a mood before getting recommendations');
        }
        
        const recommendations = getRecommendations({
          foodData,
          selectedMood,
          moodIntensity,
          selectedCravings,
          tastePreferences,
          userPreferences
        });
        
        setRecommendations(recommendations);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }, 1000); // Simulating API delay
  };
  
  // Reset all selections
  const resetSelections = () => {
    setSelectedMood(null);
    setMoodIntensity(5);
    setSelectedCravings([]);
    setTastePreferences({
      sweet: false,
      salty: false,
      spicy: false,
      savory: false,
      sour: false,
      bitter: false,
      umami: false,
    });
    setRecommendations([]);
  };
  
  // Update user preferences
  const updateUserPreferences = (newPreferences) => {
    setUserPreferences({
      ...userPreferences,
      ...newPreferences
    });
  };
  
  const value = {
    // Mood related
    selectedMood,
    setSelectedMood,
    moodIntensity,
    setMoodIntensity,
    
    // Craving related
    selectedCravings,
    setSelectedCravings,
    tastePreferences,
    setTastePreferences,
    
    // Food and recommendations
    foodData,
    recommendations,
    generateRecommendations,
    
    // User preferences
    userPreferences,
    updateUserPreferences,
    
    // Utility states and functions
    isLoading,
    error,
    resetSelections
  };
  
  return (
    <MoodBiteContext.Provider value={value}>
      {children}
    </MoodBiteContext.Provider>
  );
};