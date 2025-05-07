import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CreditCardIcon, BanknotesIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

function Checkout() {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleCheckout = async () => {
    setIsProcessing(true);
    setError('');
    
    const token = localStorage.getItem('bookstoreToken');
    console.log('JWT token:', token);

    if (!token) {
      setError('Please login to complete your order');
      setIsProcessing(false);
      navigate("/login");
      return;
    }

    try {
      const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

      const response = await fetch("http://localhost:5000/api/orders", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
        },
        body: JSON.stringify({
          items: cartItems.map(item => ({
            bookId: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity
          })),
          paymentMethod,
          totalAmount
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to place order');
      }

      const data = await response.json();
      clearCart();
      toast.success("Book Order Completed");
      navigate("/");
    } catch (error) {
      console.error('Checkout error:', error);
      setError(error.message || 'Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  return (
    <div className="min-h-screen pt-10 md:pt-16 bg-gradient-to-b from-gray-900 to-gray-800 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
            Checkout
          </h2>
          <span className="px-3 py-1 bg-cyan-400/10 text-cyan-300 text-sm rounded-full">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        {error && (
          <div className="mb-6 bg-red-900/30 border border-red-700/50 rounded-xl p-4 text-red-300">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Order Summary */}
          <div className="bg-gray-800/30 rounded-xl md:rounded-2xl backdrop-blur-xl border border-white/10 p-6 md:p-8 shadow-lg">
            <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-6">
              Order Summary
            </h3>
            
            <ul className="space-y-4 mb-6">
              {cartItems.map(item => (
                <li key={item.id} className="group relative bg-gray-700/20 rounded-lg p-4 hover:bg-gray-700/30 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 relative aspect-[3/4] w-16 rounded-lg overflow-hidden bg-gradient-to-br from-cyan-400/10 to-blue-400/10">
                        <img 
                          src={item.coverImg} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = `data:image/svg+xml;utf8,${encodeURIComponent(
                              `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400" viewBox="0 0 300 400">
                                <rect width="100%" height="100%" fill="#2D3748"/>
                                <text x="50%" y="50%" fill="#4A5568" font-family="monospace" font-size="40" 
                                      text-anchor="middle" dominant-baseline="middle">${item.name.split(' ').slice(0,2).map(w => w[0]).join('')}</text>
                              </svg>`
                            )}`;
                          }}
                        />
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-cyan-300">{item.name}</h4>
                        <p className="text-gray-400 text-sm">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="text-lg font-medium text-green-300">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            
            <div className="border-t border-gray-700/50 pt-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Subtotal</span>
                <span className="text-cyan-300">${calculateTotal()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Shipping</span>
                <span className="text-green-300">Free</span>
              </div>
              <div className="flex justify-between text-xl font-bold pt-3">
                <span className="text-gray-300">Total</span>
                <span className="text-white">${calculateTotal()}</span>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-gray-800/30 rounded-xl md:rounded-2xl backdrop-blur-xl border border-white/10 p-6 md:p-8 shadow-lg">
            <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-6">
              Payment Method
            </h3>
            
            <div className="space-y-4 mb-8">
              <button
                onClick={() => setPaymentMethod('credit_card')}
                className={`w-full flex items-center space-x-4 p-4 rounded-xl border transition-all ${paymentMethod === 'credit_card' ? 'border-cyan-400/50 bg-cyan-400/10' : 'border-gray-700/50 hover:border-cyan-400/30'}`}
              >
                <CreditCardIcon className={`h-6 w-6 ${paymentMethod === 'credit_card' ? 'text-cyan-400' : 'text-gray-400'}`} />
                <span className={`text-left flex-grow ${paymentMethod === 'credit_card' ? 'text-cyan-300' : 'text-gray-300'}`}>
                  Credit Card
                </span>
                {paymentMethod === 'credit_card' && (
                  <div className="h-5 w-5 rounded-full bg-cyan-400 flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-gray-900"></div>
                  </div>
                )}
              </button>
              
              <button
                onClick={() => setPaymentMethod('paypal')}
                className={`w-full flex items-center space-x-4 p-4 rounded-xl border transition-all ${paymentMethod === 'paypal' ? 'border-blue-400/50 bg-blue-400/10' : 'border-gray-700/50 hover:border-blue-400/30'}`}
              >
                <BanknotesIcon className={`h-6 w-6 ${paymentMethod === 'paypal' ? 'text-blue-400' : 'text-gray-400'}`} />
                <span className={`text-left flex-grow ${paymentMethod === 'paypal' ? 'text-blue-300' : 'text-gray-300'}`}>
                  PayPal
                </span>
                {paymentMethod === 'paypal' && (
                  <div className="h-5 w-5 rounded-full bg-blue-400 flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-gray-900"></div>
                  </div>
                )}
              </button>
              
              <button
                onClick={() => setPaymentMethod('bank_transfer')}
                className={`w-full flex items-center space-x-4 p-4 rounded-xl border transition-all ${paymentMethod === 'bank_transfer' ? 'border-purple-400/50 bg-purple-400/10' : 'border-gray-700/50 hover:border-purple-400/30'}`}
              >
                <ArrowPathIcon className={`h-6 w-6 ${paymentMethod === 'bank_transfer' ? 'text-purple-400' : 'text-gray-400'}`} />
                <span className={`text-left flex-grow ${paymentMethod === 'bank_transfer' ? 'text-purple-300' : 'text-gray-300'}`}>
                  Bank Transfer
                </span>
                {paymentMethod === 'bank_transfer' && (
                  <div className="h-5 w-5 rounded-full bg-purple-400 flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-gray-900"></div>
                  </div>
                )}
              </button>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isProcessing || cartItems.length === 0}
              className="w-full flex justify-center items-center bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-4 rounded-xl font-bold text-white shadow-lg hover:shadow-cyan-500/30 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {isProcessing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing Order...
                </>
              ) : (
                'Place Your Order'
              )}
            </button>
            
            <div className="mt-4 text-center text-sm text-gray-400">
              By placing your order, you agree to our Terms of Service and Privacy Policy
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;