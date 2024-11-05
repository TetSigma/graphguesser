import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      setError(error.message);
    } else {
      setError('');
      login();
      navigate('/');
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-spaceBlack">
      <div className="p-6 rounded-lg shadow-lg w-96 bg-gradient-to-br from-blue-500/60 to-blue-500/60 backdrop-blur-lg border border-gray-500 z-10">
        <h2 className="text-2xl font-bold text-white mb-4">Log In</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded p-2 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded p-2 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-spaceBlack text-white font-bold py-2 rounded hover:bg-gray-800"
          >
            Log In
          </button>
        </form>
        <p className="mt-4 text-center text-gray-300">
          Don't have an account?{' '}
          <Link to="/signup" className="hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
