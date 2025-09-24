import React, { useState } from "react";
import { Phone, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../services/auth";

const Login: React.FC = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await AuthService.login({ phone, password });

    if (response.success) {
      navigate("/dashboard");
    } else {
      alert(response.message || "Invalid credentials");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Section */}
      <div className="flex w-full md:w-1/2 flex-col justify-center items-center bg-white px-8 py-10">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <img
            src="/logo192.png"
            alt="App Logo"
            className="h-12 w-12 mb-2"
          />
          <h1 className="text-2xl font-bold text-gray-800">
            Login to your account
          </h1>
        </div>

        {/* Social buttons */}
        
        
        {/* Login Form */}
        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded border-gray-300" />
              <span>Remember me</span>
            </label>
            <a href="#" className="text-red-500 hover:underline">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-900 transition-colors"
          >
            Login now
          </button>
        </form>

       
      </div>

      {/* Right Section */}
      <div className="hidden md:flex w-1/2 flex-col justify-center items-center bg-gradient-to-b from-green-50 to-green-100 text-center px-10">
        <h2 className="text-sm uppercase font-semibold text-gray-600 mb-2">
          Welcome Back!
        </h2>
        <p className="text-xl font-medium text-gray-800 max-w-md">
          You’re just one step away from a high-quality scanning experience.
        </p>
        <img
          src="https://www.svgrepo.com/show/447968/document.svg"
          alt="Document illustration"
          className="mt-10 h-32 w-32"
        />
      </div>
    </div>
  );
};

export default Login;
