import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Compass, User, Mail, Lock } from 'lucide-react';

function Signup({ setUser, showNotification }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim() || !email.trim() || !password) {
      showNotification('Please fill in all inputs.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const response = await axios.post('/api/signup', { username, email, password });
      if (response.data.success) {
        setUser(response.data.user);
        showNotification('Welcome to Wanderlust! Your account is created.', 'success');
        navigate('/');
      }
    } catch (err) {
      console.error(err);
      showNotification(err.response?.data?.error || 'Registration failed. Try a different username/email.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative w-full min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 transition-colors duration-300">
      
      {/* Premium Decorative Blobs */}
      <div className="absolute top-10 right-1/4 w-72 h-72 bg-rose-200/50 dark:bg-rose-955/10 rounded-full blur-[100px] pointer-events-none -z-10 animate-pulse"></div>
      <div className="absolute bottom-10 left-1/4 w-80 h-80 bg-pink-200/40 dark:bg-pink-955/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>

      {/* Glassmorphism auth card */}
      <div className="backdrop-blur-xl bg-white/75 dark:bg-slate-900/60 border border-white/40 dark:border-slate-800/80 p-10 rounded-[32px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.04)] dark:shadow-[0_25px_50px_rgba(0,0,0,0.2)] w-full max-w-md space-y-8 flex flex-col items-center hover:shadow-[0_30px_60px_-15px_rgba(254,66,77,0.06)] dark:hover:shadow-rose-955/10 transition-all duration-300">
        
        {/* Header Branding */}
        <div className="flex flex-col items-center text-center gap-3">
          <div className="bg-gradient-to-tr from-rose-500 to-pink-500 p-3.5 rounded-2xl text-white shadow-md shadow-rose-500/20">
            <Compass className="w-8 h-8 stroke-[2.2]" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-950 dark:text-white tracking-tight">Join Wanderlust</h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mt-1.5">Sign up to get started</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-5">
          
          {/* Username */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4 stroke-[2.2]" />
              </div>
              <input
                type="text"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-50/50 dark:bg-slate-955/40 border border-slate-200/80 dark:border-slate-800 rounded-2xl pl-11 pr-4 py-3.5 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-brand/5 focus:border-brand dark:text-slate-100 transition-all placeholder-slate-400 dark:placeholder-slate-550"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4 stroke-[2.2]" />
              </div>
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50/50 dark:bg-slate-955/40 border border-slate-200/80 dark:border-slate-800 rounded-2xl pl-11 pr-4 py-3.5 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-brand/5 focus:border-brand dark:text-slate-100 transition-all placeholder-slate-400 dark:placeholder-slate-550"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4 stroke-[2.2]" />
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50/50 dark:bg-slate-955/40 border border-slate-200/80 dark:border-slate-800 rounded-2xl pl-11 pr-4 py-3.5 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-brand/5 focus:border-brand dark:text-slate-100 transition-all placeholder-slate-400 dark:placeholder-slate-550"
                required
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:brightness-105 active:scale-98 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-rose-500/10 hover:shadow-rose-500/20 text-sm flex items-center justify-center gap-2 border-none"
          >
            {submitting ? 'Creating account...' : 'Sign up'}
          </button>

        </form>

        <hr className="w-full border-slate-100 dark:border-slate-800" />

        {/* Footer info link */}
        <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">
          <span>Already have an account? </span>
          <Link to="/login" className="text-brand hover:text-brand-dark hover:underline font-bold">
            Log in
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Signup;
