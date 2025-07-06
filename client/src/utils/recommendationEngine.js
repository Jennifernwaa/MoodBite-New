/**
 * Recommendation engine for the MoodBite application.
 * Uses the algorithm described in the recommendation algorithm design document.
 */

// Helper function to calculate the match score between two arrays
const calculateArrayMatchScore = (array1, array2) => {
  if (!array1 || !array2) return 0;
  if (array1.length === 0 || array2.length === 0) return 0;
  
  const intersection = array1.filter(item => array2.includes(item));
  // Base the score on how many items match proportionally
  return intersection.length / Math.min(array1.length, array2.length);
};

// Helper function to calculate the match score between food and taste preferences
const calculateTastePreferenceScore = (foodTasteProfile, userTastePreferences) => {
  if (!foodTasteProfile || foodTasteProfile.length === 0) return 0;
  
  const userSelectedTastes = Object.entries(userTastePreferences)
    .filter(([_, selected]) => selected)
    .map(([taste]) => taste);
  
  if (userSelectedTastes.length === 0) return 0;
  
  return calculateArrayMatchScore(foodTasteProfile, userSelectedTastes);
};

// Helper function to check if food meets dietary restrictions
const meetsUserDietaryRestrictions = (food, userPreferences) => {
  if (!userPreferences.dietaryRestrictions) return true;
  
  const { vegetarian, vegan, glutenFree, dairyFree, nutFree } = userPreferences.dietaryRestrictions;
  const dietaryInfo = food.dietary_info || {};
  
  if (vegetarian && !dietaryInfo.vegetarian) return false;
  if (vegan && !dietaryInfo.vegan) return false;
  if (glutenFree && !dietaryInfo.gluten_free) return false;
  if (dairyFree && !dietaryInfo.dairy_free) return false;
  if (nutFree && !dietaryInfo.nut_free) return false;
  
  return true;
};

/**
 * Generate food recommendations based on user's mood, cravings, and preferences.
 * 
 * @param {Object} params - The parameters for generating recommendations
 * @param {Array} params.foodData - The array of food objects to filter and rank
 * @param {string} params.selectedMood - The user's selected mood
 * @param {number} params.moodIntensity - The intensity of the user's mood (1-10)
 * @param {Array} params.selectedCravings - The user's selected craving types
 * @param {Object} params.tastePreferences - The user's taste preferences
 * @param {Object} params.userPreferences - The user's dietary restrictions and preferences
 * @returns {Array} - Sorted array of food recommendations
 */
export const getRecommendations = ({
  foodData,
  selectedMood,
  moodIntensity,
  selectedCravings,
  tastePreferences,
  userPreferences
}) => {
  if (!foodData || foodData.length === 0) {
    return [];
  }
  
  // Normalize mood intensity to a 0-1 scale
  const normalizedMoodIntensity = moodIntensity / 10;
  
  // Filter out foods that don't meet dietary restrictions
  const eligibleFoods = foodData.filter(food => 
    meetsUserDietaryRestrictions(food, userPreferences)
  );
  
  // Calculate scores for each eligible food
  const scoredFoods = eligibleFoods.map(food => {
    // Calculate individual factor scores
    
    // Mood match score: How well does this food match the user's current mood?
    const moodMatchScore = food.moods?.includes(selectedMood) ? 1 : 0;
    
    // Craving match score: How well does this food match the user's selected cravings?
    const cravingMatchScore = calculateArrayMatchScore(food.cravings, selectedCravings);
    
    // Taste preference match: How well does this food match the user's taste preferences?
    const tastePreferenceScore = calculateTastePreferenceScore(food.taste_profile, tastePreferences);
    
    // Additional factors could be added here based on the algorithm design
    // such as time context, location, etc.
    
    // Weighted scoring based on the algorithm design
    // Adjust these weights to change the importance of each factor
    const weights = {
      moodMatch: 0.4,
      cravingMatch: 0.3,
      tastePreference: 0.3
    };
    
    // Calculate final score
    const finalScore = 
      (weights.moodMatch * moodMatchScore) +
      (weights.cravingMatch * cravingMatchScore) +
      (weights.tastePreference * tastePreferenceScore);
    
    // Add mood intensity as a factor - foods that strongly match the mood
    // will be boosted when mood intensity is high
    const intensityAdjustedScore = moodMatchScore ? 
      finalScore * (1 + (normalizedMoodIntensity - 0.5) * 0.4) : 
      finalScore;
    
    return {
      ...food,
      score: intensityAdjustedScore
    };
  });
  
  // Sort foods by score (descending)
  const sortedRecommendations = scoredFoods
    .sort((a, b) => b.score - a.score)
    // Only recommend foods with a minimum score
    .filter(food => food.score > 0.1);
  
  return sortedRecommendations;
};

// Function to translate mood to food qualities
export const getMoodFoodQualities = (mood) => {
  const moodQualities = {
    happy: ['vibrant', 'colorful', 'exciting'],
    sad: ['comforting', 'warm', 'hearty'],
    stressed: ['soothing', 'simple', 'familiar'],
    relaxed: ['light', 'refreshing', 'balanced'],
    energetic: ['protein-rich', 'nutrient-dense', 'energizing'],
    tired: ['revitalizing', 'easy-to-prepare', 'comforting'],
    bored: ['novel', 'exotic', 'stimulating'],
    nostalgic: ['traditional', 'homestyle', 'familiar'],
    romantic: ['elegant', 'sensual', 'indulgent'],
    anxious: ['calming', 'easy-to-digest', 'simple'],
  };
  
  return moodQualities[mood] || ['suitable', 'appropriate', 'matching'];
};

// Function to explain why a food is recommended
export const generateFoodExplanation = (food, selectedMood) => {
  if (!food || !selectedMood) return '';
  
  const qualities = getMoodFoodQualities(selectedMood);
  const randomQuality = qualities[Math.floor(Math.random() * qualities.length)];
  
  const explanations = [
    `This ${randomQuality} ${food.cuisine} dish is perfect for your ${selectedMood} mood.`,
    `When you're feeling ${selectedMood}, a ${randomQuality} option like this ${food.cuisine} favorite can really hit the spot.`,
    `The ${food.taste_profile?.join(' and ')} flavors in this dish complement your ${selectedMood} mood wonderfully.`,
    `This ${food.cuisine} classic provides a ${randomQuality} experience that resonates with how you're feeling.`,
  ];
  
  return explanations[Math.floor(Math.random() * explanations.length)];
};