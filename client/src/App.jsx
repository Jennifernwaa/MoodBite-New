import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import MoodSelector from './components/MoodSelector';
import CravingSelector from './components/CravingSelector';
import FoodRecommendations from './components/FoodRecommendations';
import Register from './components/Register';
import Login from './components/login';

import { MoodBiteProvider } from './context/MoodBiteContext';

function ProtectedApp() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(Math.max(1, step - 1));
  const resetSteps = () => setStep(1);

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:8080/auth/logout', {
        method: 'POST',
        credentials: 'include', // Important for cookies
      });

      // Clear client-side token (if any)
      localStorage.removeItem('token');
      navigate('/login');
    } catch (err) {
      console.error('Logout failed', err);
      alert('Logout failed');
    }
  };
  console.log(window.paypal);


  return (
    <MoodBiteProvider>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-amber-50 to-orange-100 font-[Poppins]">
        <header className="py-6 px-4 md:px-8 bg-white shadow-sm">
          <div className="container mx-auto flex justify-between items-center">
            {/* Left section: Logo and App Name */}
            <div className="flex items-center gap-2">
              <span className="text-orange-500 text-3xl">
                <i className="fas fa-utensils"></i>
              </span>
              <h1 className="text-2xl font-semibold text-gray-800">MoodBite</h1>
            </div>

            {/* Right section: Navigation items and User actions */}
            <div className="flex items-center gap-4">
              {/* Optional: User Profile Link */}
              <Link to="/profile" className="text-sm text-gray-600 hover:text-gray-800">
                <i className="fas fa-user-circle mr-2"></i>
                Profile
              </Link>

              {/* Optional: Order History Link */}
              <Link to="/orders" className="text-sm text-gray-600 hover:text-gray-800">
                <i className="fas fa-history mr-2"></i>
                My Orders
              </Link>

              {step > 1 && (
                <button
                  onClick={resetSteps}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  <i className="fas fa-redo mr-2"></i>
                  Start Over
                </button>
              )}
              <button
                onClick={handleLogout} // Add the onClick handler for logout
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-5xl flex-1">
          {step === 1 && <MoodSelector onNext={nextStep} />}
          {step === 2 && <CravingSelector onNext={nextStep} onBack={prevStep} />}
          {step === 3 && <FoodRecommendations onBack={prevStep} onReset={resetSteps} />}
        </main>

        <footer className="py-6 px-4 bg-gray-800 text-gray-300 text-sm">
          <div className="container mx-auto">
            <p className="text-center">© {new Date().getFullYear()} MoodBite</p>
          </div>
        </footer>
      </div>
    </MoodBiteProvider>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  if (loading) return <div>Loading...</div>;
  
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route
        path="/"
        element={
          isAuthenticated ? <ProtectedApp /> : <Navigate to="/login" replace />
        }
      />
    </Routes>
  );
}

export default App;
