import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ListingsIndex from './pages/ListingsIndex';
import ListingShow from './pages/ListingShow';
import ListingNew from './pages/ListingNew';
import ListingEdit from './pages/ListingEdit';
import Login from './pages/Login';
import Signup from './pages/Signup';

axios.defaults.baseURL = import.meta.env.VITE_API_URL || (
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? ''
    : 'https://wanderlust-0jem.onrender.com'
);
axios.defaults.withCredentials = true;

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  // Robust Dark Mode state initialization checking localStorage first, then system preferences
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  // Synchronize root HTML class with dark mode state
  useEffect(() => {
    console.log("[Dark Mode] State updated to:", darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      console.log("[Dark Mode] Added 'dark' class to html. Current classList:", document.documentElement.classList.toString());
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      console.log("[Dark Mode] Removed 'dark' class from html. Current classList:", document.documentElement.classList.toString());
    }
  }, [darkMode]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const checkUserAuth = async () => {
    try {
      const response = await axios.get('/api/current-user');
      setUser(response.data.user);
    } catch (err) {
      console.error("Auth check failed:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkUserAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center transition-colors duration-300">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
          <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium">Loading Wanderlust...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300">
        <Navbar 
          user={user} 
          setUser={setUser} 
          showNotification={showNotification} 
          darkMode={darkMode} 
          toggleDarkMode={toggleDarkMode} 
        />

        {/* Global Toast Notification */}
        {notification && (
          <div className="fixed top-24 right-6 z-50 animate-bounce">
            <div className={`px-6 py-3 rounded-xl shadow-lg border text-white font-medium flex items-center gap-3 transition-all ${
              notification.type === 'success' 
                ? 'bg-emerald-600 border-emerald-500' 
                : 'bg-rose-600 border-rose-500'
            }`}>
              {notification.type === 'success' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              )}
              {notification.message}
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<ListingsIndex />} />
            <Route path="/listings/new" element={
              user ? <ListingNew showNotification={showNotification} /> : <Navigate to="/login" replace />
            } />
            <Route path="/listings/:id" element={
              <ListingShow user={user} showNotification={showNotification} darkMode={darkMode} />
            } />
            <Route path="/listings/:id/edit" element={
              user ? <ListingEdit showNotification={showNotification} /> : <Navigate to="/login" replace />
            } />
            <Route path="/login" element={
              !user ? <Login setUser={setUser} showNotification={showNotification} /> : <Navigate to="/" replace />
            } />
            <Route path="/signup" element={
              !user ? <Signup setUser={setUser} showNotification={showNotification} /> : <Navigate to="/" replace />
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
