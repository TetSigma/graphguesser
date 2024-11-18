import React from "react";
import useSignup from "../../hooks/auth/useSignup";

const Signup: React.FC = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    name,
    setName,
    surname,
    setSurname,
    profilePhoto,
    setProfilePhoto,
    error,
    success,
    handleSignup,
  } = useSignup();

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900  to-[#040D21]">
      <div className="relative p-6 rounded-2xl shadow-lg w-96 bg-blue-500 bg-opacity-50 backdrop-blur-lg border border-blue-700 border-opacity-80 overflow-hidden">
        <div className="absolute inset-0 rounded-2xl border-2 border-blue-300 opacity-20"></div>
        <div className="absolute inset-0 rounded-2xl border border-blue-400 opacity-30 animate-pulse"></div>

        <h2 className="text-2xl font-bold text-blue-200 mb-4 text-center">
          Sign Up
        </h2>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        {success && (
          <p className="text-green-500 mb-4 text-center">{success}</p>
        )}

        <form
          onSubmit={handleSignup}
          className="relative z-10 flex flex-col items-center"
        >
          <div className="mb-4 w-full">
            <label className="block text-blue-100">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full border border-blue-300 rounded-2xl p-2 bg-transparent text-blue-100 placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4 w-full">
            <label className="block text-blue-100">Profile Photo (URL)</label>
            <input
              type="url"
              value={profilePhoto}
              onChange={(e) => setProfilePhoto(e.target.value)}
              className="mt-1 block w-full border border-blue-300 rounded-2xl p-2 bg-transparent text-blue-100 placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>
          <div className="mb-4 w-full">
            <label className="block text-blue-100">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full border border-blue-300 rounded-2xl p-2 bg-transparent text-blue-100 placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4 w-full">
            <label className="block text-blue-100">Surname</label>
            <input
              type="text"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              className="mt-1 block w-full border border-blue-300 rounded-2xl p-2 bg-transparent text-blue-100 placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4 w-full">
            <label className="block text-blue-100">Password</label>
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
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-center text-blue-100">
          Already have an account?{" "}
          <a href="/login" className="text-yellow-300 hover:underline">
            Log In
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
