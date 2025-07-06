import React, { useState, useEffect } from 'react';
import { generateFoodExplanation } from '../utils/recommendationEngine';

function FoodCard({ food }) {
  const [expanded, setExpanded] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  
  // I use Unsplash images since the json data doesn't have image_url field
  useEffect(() => {
    const fetchImage = async () => {
      const accessKey = "VTeptAU-ucyeK5gdoOjXfdh1NlIEAWoxlJi0jcx9b24";
      try {
        const res = await fetch(
          `https://api.unsplash.com/search/photos?query=${encodeURIComponent(food.name + ' food')}`,
          {
            headers: {
              Authorization: `Client-ID ${accessKey}`,
            },
          }
        );
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          setImageUrl(data.results[0].urls.small);
        } else {
          setImageUrl('https://via.placeholder.com/400x300?text=No+Image');
        }
      } catch (err) {
        console.error('Error fetching image:', err);
        setImageUrl('https://via.placeholder.com/400x300?text=Error');
      }
    };

    fetchImage();
  }, [food.name]);

  // Toggle expanded state
  const toggleExpanded = () => setExpanded(!expanded);
  
  return (
    <div 
      className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 ${
        expanded ? 'transform scale-105 shadow-lg z-10' : 'hover:shadow-lg'
      }`}
    >
      <div className="relative">
        <img 
          src={imageUrl} 
          alt={food.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium text-gray-800">
          {food.cuisine}
        </div>
        
        {/* Dietary indicators */}
        <div className="absolute bottom-2 left-2 flex gap-1">
          {food.dietary_info?.vegetarian && (
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">V</span>
          )}
          {food.dietary_info?.vegan && (
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">VG</span>
          )}
          {food.dietary_info?.gluten_free && (
            <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">GF</span>
          )}
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{food.name}</h3>
          <div className="flex gap-1">
            {food.moods?.slice(0, 2).map((mood) => (
              <span 
                key={mood}
                className="inline-block bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full"
              >
                {mood}
              </span>
            ))}
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {food.description}
        </p>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {food.taste_profile?.map((taste) => (
            <span 
              key={taste}
              className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full"
            >
              {taste}
            </span>
          ))}
        </div>
        
        {/* Explanation of recommendation */}
        <p className="text-sm text-gray-700 italic mb-3">
          {generateFoodExplanation(food, food.moods?.[0])}
        </p>
        
        {/* Conditional expanded content */}
        {expanded && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-900 mb-1">Nutritional Information</h4>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="bg-blue-50 p-2 rounded">
                <p className="text-blue-800 font-medium">Calories</p>
                <p>{food.nutrition?.calories || 'N/A'}</p>
              </div>
              <div className="bg-green-50 p-2 rounded">
                <p className="text-green-800 font-medium">Protein</p>
                <p>{food.nutrition?.protein || 'N/A'}g</p>
              </div>
              <div className="bg-amber-50 p-2 rounded">
                <p className="text-amber-800 font-medium">Carbs</p>
                <p>{food.nutrition?.carbs || 'N/A'}g</p>
              </div>
            </div>
            
            {food.preparation_time && (
              <p className="text-xs text-gray-600 mt-2">
                <span className="font-medium">Prep time:</span> {food.preparation_time} mins
              </p>
            )}
          </div>
        )}
        
        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={toggleExpanded}
            className="text-amber-600 hover:text-amber-800 text-sm flex items-center"
          >
            {expanded ? (
              <>
                <i className="fas fa-chevron-up mr-1"></i>
                Less info
              </>
            ) : (
              <>
                <i className="fas fa-chevron-down mr-1"></i>
                More info
              </>
            )}
          </button>
          
          <button
            className="bg-amber-500 hover:bg-amber-600 text-white py-1 px-3 rounded-full text-sm transition-colors"
          >
            <i className="fas fa-heart mr-1"></i>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default FoodCard;