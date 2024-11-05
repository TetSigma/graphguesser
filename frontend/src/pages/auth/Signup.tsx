import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';

const Signup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      setError(error.message);
    } else {
      setError('');
      alert('Check your email for the confirmation link!');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-spaceBlack">
      <div className="p-6 rounded-lg shadow-lg w-96 bg-gradient-to-br from-blue-500/60 to-blue-500/60 backdrop-blur-lg border border-gray-500">
        <h2 className="text-2xl font-bold text-white mb-4">Sign Up</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSignup}>
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
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
