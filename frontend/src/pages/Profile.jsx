import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StarIcon, PencilIcon, LockClosedIcon, UserIcon } from "@heroicons/react/24/outline";

const Profile = () => {
  const [username, setUsername] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    newUsername: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('bookstoreToken');
    const userData = localStorage.getItem('bookstoreUser');

    if (!token || !userData) {
      navigate('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUsername(parsedUser.username);
    setFormData(prev => ({ ...prev, newUsername: parsedUser.username }));

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:5000/api/orders`, {
          headers: {
            'x-auth-token': token,
          },
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || 'Failed to fetch orders');
        }

        const data = await res.json();
        setOrders(data);
      } catch (err) {
        setError(err.message || 'An error occurred while fetching orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setEditError('');
    setEditSuccess('');

    // Validation
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setEditError("New passwords don't match");
      return;
    }

    try {
      const token = localStorage.getItem('bookstoreToken');
      const userData = JSON.parse(localStorage.getItem('bookstoreUser'));

      const response = await fetch(`http://localhost:5000/api/users`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({
          username: formData.newUsername,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const updatedUser = await response.json();
      
      // Update local storage
      localStorage.setItem('bookstoreUser', JSON.stringify({
        ...userData,
        username: updatedUser.username
      }));

      setUsername(updatedUser.username);
      setEditSuccess('Profile updated successfully!');
      setEditMode(false);
      
      // Clear password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));

    } catch (error) {
      console.error('Update error:', error);
      setEditError(error.message || 'Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-6 md:p-8">
        <div className="max-w-7xl mx-auto animate-pulse">
          <div className="h-16 bg-gray-800/50 rounded-xl mb-8"></div>
          <div className="grid gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-40 bg-gray-800/50 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-8 md:pt-12 bg-gradient-to-b from-gray-900 to-gray-800 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Profile Header */}
        <div className="mb-8 md:mb-12 bg-gray-800/30 rounded-xl md:rounded-2xl backdrop-blur-xl border border-white/10 p-6 md:p-8 shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-2">
                👤 User Profile
              </h1>
              <div className="flex items-center space-x-4 mt-4">
                <div className="h-12 w-12 md:h-16 md:w-16 rounded-full bg-gradient-to-br from-cyan-400/20 to-blue-500/20 flex items-center justify-center text-cyan-300 text-xl md:text-2xl font-bold">
                  {username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-gray-400 text-sm md:text-base">Welcome back</p>
                  {editMode ? (
                    <input
                      type="text"
                      name="newUsername"
                      value={formData.newUsername}
                      onChange={handleInputChange}
                      className="bg-gray-700/50 border border-cyan-400/30 rounded-lg px-3 py-1 text-cyan-300 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                    />
                  ) : (
                    <h2 className="text-lg md:text-xl font-bold text-cyan-300">{username}</h2>
                  )}
                </div>
              </div>
            </div>
            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center space-x-2 bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-400/30 px-4 py-2 rounded-lg text-cyan-300 transition-all"
              >
                <PencilIcon className="h-5 w-5" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setEditMode(false);
                  setEditError('');
                  setEditSuccess('');
                }}
                className="flex items-center space-x-2 bg-gray-700/50 hover:bg-gray-700/70 border border-gray-600/30 px-4 py-2 rounded-lg text-gray-300 transition-all"
              >
                <span>Cancel</span>
              </button>
            )}
          </div>

          {/* Edit Profile Form */}
          {editMode && (
            <form onSubmit={handleProfileUpdate} className="mt-6 space-y-4">
              {editError && (
                <div className="bg-red-900/30 border border-red-700/50 rounded-xl p-3 text-red-300 text-sm">
                  {editError}
                </div>
              )}
              {editSuccess && (
                <div className="bg-green-900/30 border border-green-700/50 rounded-xl p-3 text-green-300 text-sm">
                  {editSuccess}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="flex items-center space-x-3 text-gray-300 mb-1">
                    <LockClosedIcon className="h-5 w-5 text-cyan-400" />
                    <span>Current Password</span>
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                    placeholder="Enter current password"
                  />
                </div>

                <div>
                  <label className="flex items-center space-x-3 text-gray-300 mb-1">
                    <UserIcon className="h-5 w-5 text-cyan-400" />
                    <span>New Username</span>
                  </label>
                  <input
                    type="text"
                    name="newUsername"
                    value={formData.newUsername}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                    placeholder="Enter new username"
                  />
                </div>

                <div>
                  <label className="flex items-center space-x-3 text-gray-300 mb-1">
                    <LockClosedIcon className="h-5 w-5 text-cyan-400" />
                    <span>New Password (optional)</span>
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                    placeholder="Enter new password"
                  />
                </div>

                {formData.newPassword && (
                  <div>
                    <label className="flex items-center space-x-3 text-gray-300 mb-1">
                      <LockClosedIcon className="h-5 w-5 text-cyan-400" />
                      <span>Confirm New Password</span>
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                      placeholder="Confirm new password"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full md:w-auto bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-2 rounded-lg font-medium text-white shadow-lg hover:shadow-cyan-500/30 transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Orders Section */}
        <div className="bg-gray-800/30 rounded-xl md:rounded-2xl backdrop-blur-xl border border-white/10 p-6 md:p-8 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
            🛒 Order History
          </h2>
          <span className="px-3 py-1 bg-cyan-400/10 text-cyan-300 text-xs md:text-sm rounded-full">
            {orders.length} {orders.length === 1 ? 'order' : 'orders'}
          </span>
        </div>

        {error ? (
          <div className="bg-red-900/30 border border-red-700/50 rounded-xl p-4 text-red-300">
            {error}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">You have no orders yet.</p>
            <button 
              onClick={() => navigate('/shop')}
              className="mt-4 px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              Browse Books
            </button>
          </div>
        ) : (
          <div className="space-y-4 md:space-y-6">
            {orders.map((order) => (
              <div 
                key={order._id} 
                className="group relative bg-gray-800/50 rounded-xl md:rounded-2xl backdrop-blur-lg border border-white/10 hover:border-cyan-400/30 transition-all duration-300 p-4 md:p-6 shadow-md hover:shadow-cyan-400/10"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-cyan-300 mb-2">Order Summary</h3>
                    <div className="space-y-2 text-sm md:text-base">
                      <p className="flex items-center">
                        <span className="text-gray-400 w-24">ID:</span>
                        <span className="text-blue-300 truncate">{order._id}</span>
                      </p>
                      <p className="flex items-center">
                        <span className="text-gray-400 w-24">Date:</span>
                        <span className="text-purple-300">
                          {new Date(order.createdAt?.$date || order.createdAt).toLocaleString()}
                        </span>
                      </p>
                      <p className="flex items-center">
                        <span className="text-gray-400 w-24">Total:</span>
                        <span className="text-green-300 font-medium">
                          ${order.totalAmount.toFixed(2)}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-cyan-300 mb-2">Details</h3>
                    <div className="space-y-2 text-sm md:text-base">
                      <p className="flex items-center">
                        <span className="text-gray-400 w-24">Payment:</span>
                        <span className="capitalize text-amber-300">
                          {order.paymentMethod}
                        </span>
                      </p>
                      <p className="flex items-center">
                        <span className="text-gray-400 w-24">Status:</span>
                        <span className={`capitalize px-2 py-1 rounded-full text-xs ${
                          order.status === 'completed' 
                            ? 'bg-green-900/50 text-green-300'
                            : order.status === 'processing'
                            ? 'bg-blue-900/50 text-blue-300'
                            : 'bg-amber-900/50 text-amber-300'
                        }`}>
                          {order.status}
                        </span>
                      </p>
                      <p className="flex items-center">
                        <span className="text-gray-400 w-24">Items:</span>
                        <span className="text-gray-300">
                          {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-cyan-300 mb-2">Items</h3>
                    <div className="max-h-40 overflow-y-auto pr-2">
                      <ul className="space-y-2 text-sm">
                        {order.items.map((item, i) => (
                          <li key={i} className="flex justify-between items-center">
                            <span className="text-gray-300 truncate max-w-[120px] md:max-w-[160px]">
                              {item.name}
                            </span>
                            <div className="flex items-center space-x-2">
                              <span className="text-gray-400 text-xs">×{item.quantity}</span>
                              <span className="text-cyan-300 font-medium">
                                ${item.price.toFixed(2)}
                              </span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="absolute inset-0 rounded-xl md:rounded-2xl bg-gradient-to-br from-cyan-400/20 to-blue-500/20 opacity-0 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none" />
              </div>
            ))}
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default Profile;