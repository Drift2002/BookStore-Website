import React, { useState } from "react";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const { username, email, password, confirmPassword } = formData;
    
    // Client-side validation
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        setErrorMessage(data.msg || "Registration failed");
        return;
      }

      // On successful registration, redirect to login
      toast.success("Registration succuessful");
      navigate("/login");
      
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
      console.error("Registration error:", error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-900 to-blue-900/30">
      <div className="bg-[rgba(207,189,203,0.60)] p-8 rounded-tl-[50px] rounded-tr-[0px] rounded-bl-[0px] rounded-br-[50px] shadow-lg w-96 relative">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          BOOKSTORE REGISTER
        </h2>
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Username
            </label>
            <div className="flex items-center bg-white border border-gray-300 rounded-md relative">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                name="username"
                id="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full outline-none bg-transparent pl-10 py-2 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-md"
                placeholder="Username"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <div className="flex items-center bg-white border border-gray-300 rounded-md relative">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
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
                minLength="6"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <div className="flex items-center bg-white border border-gray-300 rounded-md relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full outline-none bg-transparent pl-10 py-2 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-md"
                placeholder="Confirm Password"
                required
                minLength="6"
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
            Register
          </button>
        </form>
        
        <p className="text-center text-gray-800 mt-4">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-gray-800 font-semibold hover:underline"
          >
            LOGIN
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;