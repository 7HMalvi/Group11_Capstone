import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProPopup({ isOpen, setIsOpen }) {
  const navigate = useNavigate();

  const handleNavigateToPro = () => {
    setIsOpen(false);
    navigate('/pro');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="p-6 bg-black rounded-lg shadow-red w-11/12 md:w-2/3 lg:w-1/2">
        <h2 className="text-2xl font-semibold mb-4 text-red-600">Become a Pro User</h2>
        <p className="mb-4">Unlock these amazing benefits:</p>
        <ul className="list-disc list-inside mb-4">
          <li>Unlimited song uploads</li>
          <li>Access to premium features</li>
          <li>Priority support</li>
          <li>And much more!</li>
        </ul>
        <button
          className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded"
          onClick={handleNavigateToPro}
        >
          Upgrade to Pro
        </button>
      </div>
    </div>
  );
}
