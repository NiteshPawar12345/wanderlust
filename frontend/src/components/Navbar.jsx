import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Compass, Search, Menu, X, Plus, LogOut, User as UserIcon, Sun, Moon } from 'lucide-react';

function Navbar({ user, setUser, showNotification, darkMode, toggleDarkMode }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/');
    }
  };

  const handleLogout = async () => {
    try {
      const res = await axios.get('/api/logout');
      if (res.data.success) {
        setUser(null);
        showNotification('You have logged out successfully!', 'success');
        navigate('/');
      }
    } catch (err) {
      console.error(err);
      showNotification('Logout failed. Please try again.', 'error');
    }
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-100 dark:border-slate-800 shadow-[0_2px_15px_rgba(0,0,0,0.02)] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group hover:scale-[1.02] transition-transform duration-200">
            <div className="bg-gradient-to-tr from-rose-500 to-pink-500 p-2 rounded-xl text-white shadow-md shadow-rose-500/20 group-hover:shadow-rose-500/30 transition-all duration-300">
              <Compass className="w-6 h-6 stroke-[2.2]" />
            </div>
            <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 bg-clip-text text-transparent font-black text-2xl tracking-tight leading-none">
              Wanderlust
            </span>
          </Link>

          {/* Search Bar (Desktop) */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_25px_rgba(0,0,0,0.06)] hover:border-slate-200/80 dark:hover:border-slate-700/80 focus-within:border-brand/40 focus-within:ring-4 focus-within:ring-brand/5 transition-all duration-300 rounded-full overflow-hidden p-1.5 w-full max-w-md mx-6">
            <input
              type="text"
              placeholder="Search destinations by country..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-grow pl-5 pr-2 text-sm text-slate-800 dark:text-slate-100 font-medium bg-transparent focus:outline-none placeholder-slate-400 dark:placeholder-slate-500"
            />
            <button type="submit" className="bg-gradient-to-r from-rose-500 to-pink-500 text-white p-3 rounded-full hover:brightness-105 active:scale-95 shadow-md shadow-rose-500/10 hover:shadow-rose-500/20 transition-all duration-200 shrink-0">
              <Search className="w-4 h-4 stroke-[2.5]" />
            </button>
          </form>

          {/* Actions (Desktop) */}
          <div className="hidden md:flex items-center gap-5">
            <Link to="/" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-sm font-semibold tracking-wide transition-colors">
              Explore
            </Link>
            
            <Link 
              to="/listings/new" 
              className="flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 hover:border-slate-900 dark:hover:border-white hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300 text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-full shadow-sm transition-all duration-300"
            >
              <Plus className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 stroke-[3]" />
              <span>Wanderlust your home</span>
            </Link>

            {/* Dark Mode Toggle Switch */}
            <button
              onClick={() => {
                console.log("[Navbar] Desktop theme toggle button clicked! Current state:", darkMode);
                toggleDarkMode();
              }}
              className="p-2.5 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:scale-105 transition-all duration-200"
              aria-label="Toggle Theme"
            >
              {darkMode ? <Sun className="w-4 h-4 stroke-[2.2]" /> : <Moon className="w-4 h-4 stroke-[2.2]" />}
            </button>

            <div className="h-5 w-px bg-slate-200 dark:bg-slate-800"></div>

            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-850 px-4 py-2 rounded-full text-slate-700 dark:text-slate-300 text-sm font-semibold border border-slate-100 dark:border-slate-800 shadow-inner">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center text-[10px] font-black text-white uppercase">
                    {user.username.charAt(0)}
                  </div>
                  <span>{user.username}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-850 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider border border-slate-200 dark:border-slate-800 hover:border-rose-200 dark:hover:border-rose-800 shadow-sm transition-all duration-200"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/40 rounded-full transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="bg-slate-950 dark:bg-slate-100 hover:bg-slate-900 dark:hover:bg-white text-white dark:text-slate-950 font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-full shadow-md hover:shadow-lg active:scale-98 transition-all"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            {/* Mobile Dark Mode Toggle */}
            <button
              onClick={() => {
                console.log("[Navbar] Mobile theme toggle button clicked! Current state:", darkMode);
                toggleDarkMode();
              }}
              className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all"
            >
              {darkMode ? <Sun className="w-5 h-5 stroke-[2.2]" /> : <Moon className="w-5 h-5 stroke-[2.2]" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-850 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 stroke-[2.5]" /> : <Menu className="w-5 h-5 stroke-[2.5]" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl py-6 px-6 space-y-6 shadow-xl animate-fade-in transition-colors duration-300">
          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="flex items-center bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-full overflow-hidden p-1.5">
            <input
              type="text"
              placeholder="Search destinations by country..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-grow pl-4 pr-2 text-sm text-slate-800 dark:text-slate-100 bg-transparent focus:outline-none"
            />
            <button type="submit" className="bg-brand text-white p-2 rounded-full shrink-0">
              <Search className="w-4 h-4" />
            </button>
          </form>

          <div className="flex flex-col gap-4">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-sm font-bold uppercase tracking-wider"
            >
              Explore Stays
            </Link>
            <Link
              to="/listings/new"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-sm font-bold uppercase tracking-wider"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              Wanderlust your home
            </Link>

            <hr className="border-slate-100 dark:border-slate-800" />

            {user ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold">
                  <div className="w-6 h-6 rounded-full bg-brand-light flex items-center justify-center text-[10px] font-black text-brand uppercase">
                    {user.username.charAt(0)}
                  </div>
                  <span>@{user.username}</span>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-rose-50 dark:bg-rose-950/20 hover:bg-rose-100 text-rose-600 dark:text-rose-400 py-3.5 rounded-2xl border border-rose-100 dark:border-rose-900/30 font-bold text-sm transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log out</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40 font-bold py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-sm transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center bg-slate-950 dark:bg-slate-100 hover:bg-slate-900 dark:hover:bg-white text-white dark:text-slate-950 font-bold py-3.5 rounded-2xl text-sm transition-colors shadow-sm"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
