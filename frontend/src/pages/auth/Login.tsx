import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login(email, password);
      navigate("/");
    } catch (error) {
      setError("An error occurred while logging in. Please try again later.");
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900  to-[#040D21]">
      <div className="relative p-6 rounded-2xl shadow-lg w-96 bg-blue-500 bg-opacity-50 backdrop-blur-lg border border-blue-700 border-opacity-80 overflow-hidden">
        <div className="absolute inset-0 rounded-lg border border-blue-300 opacity-30"></div>
        <h2 className="text-2xl font-semibold text-white mb-6 text-center">
          Welcome to GraphGuesser
        </h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form
          onSubmit={handleLogin}
          className="relative z-10 flex flex-col items-center space-y-6"
        >
          <div className="w-full">
            <label className="block text-white mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full border border-blue-300 rounded-2xl p-2 bg-transparent text-blue-100 placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-500"
              required
            />
          </div>
          <div className="w-full">
            <label className="block text-white mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full border border-blue-300 rounded-2xl p-2 bg-transparent text-blue-100 placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-900 text-white font-medium py-3 rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg transition duration-200"
          >
            Log In
          </button>
        </form>
        <p className="mt-6 text-center text-white">
          Don't have an account?{" "}
          <Link to="/signup" className="text-yellow-300 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
