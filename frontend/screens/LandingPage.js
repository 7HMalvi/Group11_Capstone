import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logoImg from '../../image/logo.png';
import backgroundImage from '../../image/landingpage.jpg';

export default function LandingPage() {
  const navigate = useNavigate();

  const handleExploreMusicClick = () => {
    navigate('/login');
  };

  return (
    <div
      className="relative flex flex-col items-center justify-center h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-center sm:justify-start">
        <div className="flex-shrink-0">
          <Link to="/">
            <img className="h-12 w-auto" src={logoImg} alt="Logo" />
          </Link>
        </div>
      </div>
      <div className="relative z-10 text-center text-white">
        <h1 className="text-4xl sm:text-6xl font-bold mb-4">Welcome to your Rhythmic Haven!</h1>
        <p className="text-xl sm:text-2xl mb-8">Find Your Beat, Feel the Groove at Grooveix!</p>
        <div className="flex flex-col sm:flex-row sm:justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <button
            className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
            onClick={handleExploreMusicClick}
          >
            Explore Music
          </button>
        </div>
      </div>
      <div className="absolute inset-0 bg-black opacity-50"></div>
    </div>
  );
}
