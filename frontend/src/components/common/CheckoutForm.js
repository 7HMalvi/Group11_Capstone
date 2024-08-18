import React, { useState } from 'react';
import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import { ConfirmPayment, CreatePaymentIntent } from '../../services/APIRoutes';

export default function CheckoutForm({totalAmount}) {
  const stripe = useStripe();
  const elements = useElements();

  const [billingDetails, setBillingDetails] = useState({
    name: '',
    email: '',
    address: {
      postal_code: '',
    },
    phone: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('address')) {
      setBillingDetails((prevState) => ({
        ...prevState,
        address: {
          ...prevState.address,
          [name.split('.')[1]]: value,
        },
      }));
    } else {
      setBillingDetails((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const response = await fetch(CreatePaymentIntent, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: totalAmount.toFixed(2) * 100 }),
    });
    const data = await response.json();
    console.log('data', data);
    const { error, paymentIntent } = await stripe.confirmCardPayment(data.clientSecret, {
      payment_method: {
        card: elements.getElement(CardNumberElement),
        billing_details: billingDetails,
      },
    });

    if (error) {
      console.error('Payment error:', error.message);
    } else if (paymentIntent.status === 'succeeded') {
      
        const token = localStorage.getItem('userToken');
        const response = await fetch(ConfirmPayment, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ amount: totalAmount.toFixed(2) * 100, billingDetails }),
        });
        const data = await response.json();
        localStorage.setItem('isProUser', data.user.isProUser)

        alert('Payment successful! Thank you for your purchase.');
        window.location.href = '/home';

    }
  };

  const ELEMENT_OPTIONS = {
    style: {
      base: {
        color: '#32325d',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
      },
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto p-8 bg-white rounded-lg shadow-lg">

        <h1 className="text-red-600">Billing Information</h1>
       
        <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="name">Name</label>
            <input
            id="name"
            type="text"
            name="name"
            value={billingDetails.name}
            onChange={handleInputChange}
            className="w-full p-3 rounded-lg border border-gray-300 text-black"
            required
            />
        </div>

        <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
            <input
            id="email"
            type="email"
            name="email"
            value={billingDetails.email}
            onChange={handleInputChange}
            className="w-full p-3 rounded-lg border border-gray-300 text-black"
            required
            />
        </div>

        <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="phone">Phone</label>
            <input
            id="phone"
            type="tel"
            name="phone"
            value={billingDetails.phone}
            onChange={handleInputChange}
            className="w-full p-3 rounded-lg border border-gray-300 text-black"
            />
        </div>

        <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="postal_code">Postal Code</label>
            <input
                id="postal_code"
                type="text"
                name="address.postal_code"
                value={billingDetails.address.postal_code}
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg border border-gray-300 text-black"
                required
            />
        </div>

        <h1 className='text-red-600'>Card Information</h1>

        <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="cardNumber">Card Number</label>
            <CardNumberElement options={ELEMENT_OPTIONS} className="w-full p-3 rounded-lg border border-gray-300 text-black" />
        </div>

        <div className="flex space-x-4 mb-4">
            <div className="w-1/2">
            <label className="block text-gray-700 mb-2" htmlFor="expiry">Expiration Date</label>
            <CardExpiryElement options={ELEMENT_OPTIONS} className="w-full p-3 rounded-lg border border-gray-300 text-black" />
            </div>
            <div className="w-1/2">
            <label className="block text-gray-700 mb-2" htmlFor="cvc">CVC</label>
            <CardCvcElement options={ELEMENT_OPTIONS} className="w-full p-3 rounded-lg border border-gray-300 text-black" />
            </div>
        </div>

      <button 
        type="submit" 
        disabled={!stripe} 
        className="bg-red-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-red-700 transition duration-300 w-full"
      >
        Pay
      </button>
    </form>
  );
}
