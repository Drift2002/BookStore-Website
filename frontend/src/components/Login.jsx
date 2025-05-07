import React, { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import { useNavigate, useOutletContext } from "react-router-dom";
import { toast } from 'react-toastify';

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const {setIsLoggedIn} = useOutletContext();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
    
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        setErrorMessage(data.msg || "Login failed");
        return;
      }

      // Store token and user data
      localStorage.setItem('bookstoreToken', data.token);
      localStorage.setItem('bookstoreUser', JSON.stringify(data.user));

      setIsLoggedIn(true);
      
      // Redirect to home page
      toast.success("Login successful");
      navigate("/");
      
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
      console.error("Login error:", error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-900 to-blue-900/30">
      <div className="bg-[rgba(207,189,203,0.60)] p-8 rounded-tl-[50px] rounded-tr-[0px] rounded-bl-[0px] rounded-br-[50px] shadow-lg w-96 relative">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          BOOKSTORE LOGIN
        </h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <div className="flex items-center bg-white border border-gray-300 rounded-md relative">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full outline-none bg-transparent pl-10 py-2 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-md"
                placeholder="your@email.com"
                required
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <div className="flex items-center bg-white border border-gray-300 rounded-md relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full outline-none bg-transparent pl-10 py-2 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-md"
                placeholder="Password"
                required
              />
            </div>
          </div>
          
          {errorMessage && (
            <div className="text-red-500 text-sm text-center mb-4">
              {errorMessage}
            </div>
          )}
          
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-blue-800 text-white py-2 rounded-md hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-800 transition duration-300 shadow-md"
          >
            Login
          </button>
        </form>
        
        <p className="text-center text-gray-800 mt-4">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-gray-800 font-semibold hover:underline"
          >
            REGISTER
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;