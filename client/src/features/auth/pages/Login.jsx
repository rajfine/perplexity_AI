import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const {handleLogin} = useAuth()
  const error = useSelector((state) => state.auth.error)
  const nevigate = useNavigate()
  
  const user = useSelector((state) => state.auth.user)
  const loading = useSelector((state) => state.auth.loading)
  
  if(!loading && user){
    return <Navigate to={"/"} replace/>
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {email, password}
    console.log("login payload: ",payload)

    try {
      await handleLogin(payload)
      nevigate("/")
    } catch (error) {
      console.error("login failed", error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#18181b] to-[#23272f]">
      <form
        onSubmit={handleSubmit}
        className="bg-[#23272f] shadow-2xl rounded-2xl px-10 py-12 w-full max-w-md border border-[#2d2d36]"
      >
        <h2 className="text-3xl font-bold text-white mb-8 text-center tracking-tight">Sign in to Perplexity</h2>
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
            autoComplete="current-password"
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
          Login
        </button>
        <div className="text-center mt-2">
          <span className="text-[#b3b3c6]">Don't have an account? </span>
          <Link to="/register" className="text-[#FFD700] hover:underline font-medium">Register</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
