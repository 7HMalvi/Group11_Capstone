import React, { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from '../common/CheckoutForm';

const stripePromise = loadStripe('pk_test_51Pkzz9RoFTuRWEmA0h9BbBEpX456CEFCIG5QmaiAnxdbupQjdsR7Xbx5fmZ2ujJZUbfq4VzU8rDf9sFAPCWxXP6r00BOQB34ci');

export default function Pro() {
  const [isProUser, setIsProUser] = useState(false);
  const [showBilling, setShowBilling] = useState(false);

  useEffect(() => {
    console.log(localStorage.getItem('isProUser'))
    setIsProUser(localStorage.getItem('isProUser'));
  }, []);

  const handleShowBilling = () => {
    setShowBilling(true);
  };

  const subscriptionFee = 50;
  const taxRate = 0.13;
  const totalAmount = subscriptionFee * (1 + taxRate);

  return (
    <>
      <div className="max-w-3xl mx-auto my-9 p-8 rounded-lg shadow-red">
        <h1 className="text-3xl font-bold text-center text-red-600 mb-6">Pro Version Benefits</h1>
        
        <ul className="mb-6 space-y-4 text-gray-700">
          <li className="flex items-center">
            <span className="bg-red-600 text-white rounded-full px-2 py-1 mr-3">✔</span>
            Access to exclusive content
          </li>
          <li className="flex items-center">
            <span className="bg-red-600 text-white rounded-full px-2 py-1 mr-3">✔</span>
            Priority support
          </li>
          <li className="flex items-center">
            <span className="bg-red-600 text-white rounded-full px-2 py-1 mr-3">✔</span>
            Early access to new features
          </li>
          <li className="flex items-center">
            <span className="bg-red-600 text-white rounded-full px-2 py-1 mr-3">✔</span>
            Unlimited song uploads
          </li>
        </ul>

        {isProUser===true ? (
          <div className="text-center text-green-600 font-bold">
            You are already a Pro user!
          </div>
        ) : (
          <div className="text-center mt-6">
            <h1 className="text-xl font-bold text-center text-red-600 mb-6">Lifetime access for 50CAD</h1>

            <button 
              onClick={handleShowBilling} 
              className="bg-red-600 text-white py-2 px-6 rounded-lg shadow-md hover:bg-red-700 transition duration-300"
            >
              Purchase Pro Subscription
            </button>
          </div>
        )}
      </div>

      {showBilling && (
        <>
          <div className="max-w-3xl mx-auto my-9 p-4">
            <h2 className="text-xl font-bold text-red-600 mb-2">Billing Summary</h2>
            <p className="mb-2">Subscription Fee: ${subscriptionFee.toFixed(2)} CAD</p>
            <p className="mb-2">Tax (13%): ${(subscriptionFee * taxRate).toFixed(2)} CAD</p>
            <p className="font-bold">Total Amount:<span className='text-red-600'> ${totalAmount.toFixed(2)} CAD</span></p>
          </div>

          <Elements stripe={stripePromise}>
            <CheckoutForm totalAmount={totalAmount}/>
          </Elements>
        </>
      )}
    </>
  );
}
