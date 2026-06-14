import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { handleRegister } = useAuth()
  const error = useSelector((state) => state.auth.error)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await handleRegister({ username, email, password })
      navigate('/login')
    } catch (error) {
      console.error('register failed', error)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#18181b] to-[#23272f]">
      <form
        onSubmit={handleSubmit}
        className="bg-[#23272f] shadow-2xl rounded-2xl px-10 py-12 w-full max-w-md border border-[#2d2d36]"
      >
        <h2 className="text-3xl font-bold text-white mb-8 text-center tracking-tight">Create your account</h2>
        <div className="mb-6">
          <label className="block text-[#b3b3c6] text-sm font-semibold mb-2" htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            autoComplete="username"
            required
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-[#18181b] border border-[#35353f] text-white focus:outline-none focus:ring-2 focus:ring-[#FFD700] transition"
            placeholder="Your username"
          />
        </div>
        <div className="mb-6">
          <label className="block text-[#b3b3c6] text-sm font-semibold mb-2" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-[#18181b] border border-[#35353f] text-white focus:outline-none focus:ring-2 focus:ring-[#FFD700] transition"
            placeholder="you@email.com"
          />
        </div>
        <div className="mb-8">
          <label className="block text-[#b3b3c6] text-sm font-semibold mb-2" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-[#18181b] border border-[#35353f] text-white focus:outline-none focus:ring-2 focus:ring-[#FFD700] transition"
            placeholder="password"
          />
        </div>
        {error ? (
          <p className="mb-4 rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-gradient-to-r from-[#FFD700] to-[#B8860B] text-[#18181b] font-semibold text-lg shadow-lg hover:from-[#ffe066] hover:to-[#cfa93a] transition mb-4"
        >
          Register
        </button>
        <div className="text-center mt-2">
          <span className="text-[#b3b3c6]">Already have an account? </span>
          <Link to="/login" className="text-[#FFD700] hover:underline font-medium">Login</Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
