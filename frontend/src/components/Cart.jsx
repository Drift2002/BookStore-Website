import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { XMarkIcon, ArrowLeftIcon, ShoppingBagIcon, TrashIcon } from '@heroicons/react/24/outline';

function Cart() {
  const { cartItems, removeFromCart, clearCart } = useCart();

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen pt-16 md:pt-20 bg-gradient-to-b from-gray-900 to-gray-800 p-4 sm:p-6 md:p-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="bg-gray-800/30 rounded-xl md:rounded-2xl backdrop-blur-xl border border-white/10 p-8 md:p-12 shadow-lg">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-full flex items-center justify-center">
              <ShoppingBagIcon className="h-10 w-10 text-cyan-400" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-2">
              Your cart is empty
            </h3>
            <p className="text-gray-400 mb-6">Browse our collection and find your next read</p>
            <Link 
              to="/"
              className="inline-flex items-center bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 rounded-full font-medium text-white shadow-lg hover:shadow-cyan-500/30 transition-all hover:-translate-y-0.5"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 md:pt-20 bg-gradient-to-b from-gray-900 to-gray-800 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
            Your Shopping Cart
          </h2>
          <span className="px-3 py-1 bg-cyan-400/10 text-cyan-300 text-sm rounded-full">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {cartItems.map(item => (
              <div 
                key={item.id} 
                className="group relative bg-gray-800/30 rounded-xl md:rounded-2xl backdrop-blur-xl border border-white/10 hover:border-cyan-400/30 transition-all duration-300 p-4 md:p-6 shadow-lg hover:shadow-cyan-400/10"
              >
                <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                  <div className="flex-shrink-0 relative aspect-[3/4] w-24 md:w-32 rounded-lg overflow-hidden bg-gradient-to-br from-cyan-400/10 to-blue-400/10">
                    <img 
                      src={item.coverImg} 
                      alt={`Cover of ${item.name}`} 
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

                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-cyan-300">{item.name}</h3>
                        <p className="text-gray-400 text-sm md:text-base">{item.author || 'Unknown Author'}</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-400 transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm md:text-base">
                      <div>
                        <p className="text-gray-400">Price</p>
                        <p className="text-cyan-300 font-medium">${item.price.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Quantity</p>
                        <p className="text-purple-300 font-medium">{item.quantity}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Subtotal</p>
                        <p className="text-green-300 font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute inset-0 rounded-xl md:rounded-2xl bg-gradient-to-br from-cyan-400/20 to-blue-500/20 opacity-0 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none" />
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gray-800/30 rounded-xl md:rounded-2xl backdrop-blur-xl border border-white/10 p-6 md:p-8 shadow-lg sticky top-6">
              <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-6">
                Order Summary
              </h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="text-cyan-300">${calculateTotal()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Shipping</span>
                  <span className="text-green-300">Free</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-4 border-t border-gray-700/50">
                  <span className="text-gray-300">Total</span>
                  <span className="text-white">${calculateTotal()}</span>
                </div>
              </div>

              <div className="space-y-4">
                <Link
                  to="/checkout"
                  className="w-full flex justify-center items-center bg-gradient-to-r from-green-500 to-green-600 px-6 py-3 rounded-xl font-medium text-white shadow-lg hover:shadow-green-500/30 transition-all hover:-translate-y-0.5"
                >
                  Proceed to Checkout
                </Link>

                <button
                  onClick={clearCart}
                  className="w-full flex justify-center items-center bg-gradient-to-r from-red-500 to-red-600 px-6 py-3 rounded-xl font-medium text-white shadow-lg hover:shadow-red-500/30 transition-all hover:-translate-y-0.5"
                >
                  <TrashIcon className="h-5 w-5 mr-2" />
                  Clear Cart
                </button>

                <Link 
                  to="/"
                  className="w-full flex justify-center items-center bg-gray-700/50 border border-gray-600/50 px-6 py-3 rounded-xl font-medium text-cyan-300 shadow-lg hover:bg-gray-700/70 transition-all hover:-translate-y-0.5"
                >
                  <ArrowLeftIcon className="h-5 w-5 mr-2" />
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;