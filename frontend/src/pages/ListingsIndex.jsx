import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { 
  Flame, BedDouble, Building2, Mountain, 
  Castle, Waves, Tent, Tractor, ShieldAlert,
  SearchCode
} from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All Stays', icon: SearchCode, apiPath: '/api/listings' },
  { id: 'trending', label: 'Trending', icon: Flame, apiPath: '/api/listings/trending' },
  { id: 'rooms', label: 'Rooms', icon: BedDouble, apiPath: '/api/listings/rooms' },
  { id: 'iconic', label: 'Iconic Cities', icon: Building2, apiPath: '/api/listings/iconic' },
  { id: 'mountains', label: 'Mountains', icon: Mountain, apiPath: '/api/listings/mountains' },
  { id: 'castles', label: 'Castles', icon: Castle, apiPath: '/api/listings/castles' },
  { id: 'pool', label: 'Amazing Pools', icon: Waves, apiPath: '/api/listings/pool' },
  { id: 'camping', label: 'Camping', icon: Tent, apiPath: '/api/listings/camping' },
  { id: 'farms', label: 'Farms', icon: Tractor, apiPath: '/api/listings/farms' },
];

function ListingsIndex() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [showTax, setShowTax] = useState(false);
  const [error, setError] = useState(null);

  const location = useLocation();

  const getSearchQuery = () => {
    const params = new URLSearchParams(location.search);
    return params.get('search') || '';
  };

  const fetchListings = async () => {
    setLoading(true);
    setError(null);
    try {
      const search = getSearchQuery();
      let response;
      
      if (search) {
        response = await axios.get(`/api/listings/search?country=${encodeURIComponent(search)}`);
        setActiveCategory('all');
      } else {
        const cat = CATEGORIES.find(c => c.id === activeCategory);
        response = await axios.get(cat.apiPath);
      }
      
      setListings(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to retrieve listings. Please check your database connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [activeCategory, location.search]);

  return (
    <div className="space-y-10 animate-fade-in transition-colors duration-300">
      
      {/* Category filters & Tax Switch Panel */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-100 dark:border-slate-800/80 pb-5">
        
        {/* Categories slider */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth pb-2 -mb-2">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id && !getSearchQuery();
            return (
              <button
                key={cat.id}
                onClick={() => {
                  if (location.search) {
                    window.history.replaceState({}, '', '/');
                  }
                  setActiveCategory(cat.id);
                }}
                className={`flex flex-col items-center gap-2 px-4 py-3 rounded-2xl transition-all duration-300 shrink-0 ${
                  isActive 
                    ? 'text-brand bg-brand-light/60 dark:bg-brand-light/10 font-bold scale-[1.03] shadow-[0_4px_15px_rgba(254,66,77,0.08)] dark:shadow-[0_4px_15px_rgba(254,66,77,0.03)]' 
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-slate-800/30'
                }`}
              >
                <div className={`p-2 rounded-xl transition-colors ${isActive ? 'bg-brand text-white shadow-md shadow-brand/20' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
                  <Icon className="w-4 h-4 stroke-[2.2]" />
                </div>
                <span className="text-[11px] font-bold tracking-wide uppercase">{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tax Switch Toggle */}
        <div className="flex items-center justify-between gap-5 p-4 bg-white dark:bg-slate-900/60 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-[0_4px_25px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_25px_rgba(0,0,0,0.2)] self-start lg:self-center shrink-0">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">Show price after taxes (+18% GST)</span>
          <button
            onClick={() => setShowTax(!showTax)}
            className={`w-12 h-7 rounded-full p-1 transition-colors duration-300 ease-in-out relative ${
              showTax ? 'bg-gradient-to-r from-rose-500 to-pink-500' : 'bg-slate-200 dark:bg-slate-700'
            }`}
          >
            <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ease-in-out ${
              showTax ? 'translate-x-5' : 'translate-x-0'
            }`} />
          </button>
        </div>

      </div>

      {/* Search Header Banner */}
      {getSearchQuery() && (
        <div className="bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20 border border-brand/10 dark:border-brand/20 px-8 py-5 rounded-3xl flex items-center justify-between shadow-sm">
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Search Country</p>
            <p className="text-slate-950 dark:text-white font-extrabold text-lg mt-0.5">
              Showing stays in <span className="text-brand">"{getSearchQuery()}"</span>
            </p>
          </div>
          <Link to="/" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-800 dark:hover:border-slate-100 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-full shadow-sm transition-all duration-200">
            Clear search
          </Link>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-4 bg-white dark:bg-slate-900/50 p-4.5 rounded-[32px] border border-slate-100 dark:border-slate-800/80">
              <div className="bg-slate-200/60 dark:bg-slate-800 aspect-[4/3] rounded-[24px] w-full animate-pulse"></div>
              <div className="space-y-3 pt-2">
                <div className="h-4.5 bg-slate-200/60 dark:bg-slate-800 rounded-lg w-2/3 animate-pulse"></div>
                <div className="h-3.5 bg-slate-200/60 dark:bg-slate-800 rounded-lg w-1/2 animate-pulse"></div>
                <div className="h-6 bg-slate-200/60 dark:bg-slate-800 rounded-lg w-1/3 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 p-8 rounded-3xl text-center max-w-lg mx-auto shadow-sm">
          <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-rose-950 dark:text-rose-100 mb-2">Error Loading Stays</h3>
          <p className="text-rose-600 dark:text-rose-400 text-sm mb-5">{error}</p>
          <button onClick={fetchListings} className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-6 py-3 rounded-2xl shadow-md shadow-rose-600/10 transition-colors">
            Try again
          </button>
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/40 rounded-[32px] border border-dashed border-slate-200 dark:border-slate-800 max-w-2xl mx-auto px-6">
          <SearchCode className="w-14 h-14 text-slate-400 dark:text-slate-600 mx-auto mb-4 stroke-[1.5]" />
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">No Stays Found</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 max-w-md mx-auto leading-relaxed">
            We couldn't find any stays matching your filters. Try checking your spelling or selection.
          </p>
          <button
            onClick={() => {
              window.history.replaceState({}, '', '/');
              setActiveCategory('all');
            }}
            className="bg-slate-950 dark:bg-slate-100 hover:bg-slate-900 dark:hover:bg-white text-white dark:text-slate-950 font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-full shadow-md transition-all"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        /* Listings Grid - Enlarged 3-Column Premium Card Layout */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {listings.map((listing) => {
            const finalPrice = showTax ? listing.price * 1.18 : listing.price;
            return (
              <Link 
                key={listing._id} 
                to={`/listings/${listing._id}`} 
                className="group flex flex-col bg-white dark:bg-slate-900/50 rounded-[32px] p-4.5 border border-slate-100 dark:border-slate-800/80 shadow-[0_8px_30px_rgba(0,0,0,0.015)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_30px_60px_rgba(254,66,77,0.07)] hover:shadow-rose-950/20 hover:-translate-y-2 transition-all duration-500 ease-out focus:outline-none"
              >
                {/* Stay Image with Hover Overlay */}
                <div className="aspect-[4/3] rounded-[24px] overflow-hidden bg-slate-50 dark:bg-slate-850 relative shadow-sm">
                  <img
                    src={listing.image.url}
                    alt={listing.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  {/* Premium dark glassmorphic location badge */}
                  <div className="absolute top-4.5 left-4.5 bg-slate-950/70 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-black tracking-wider text-white uppercase shadow-sm border border-white/10">
                    {listing.location}
                  </div>

                  {/* "Explore Stay" micro-interactive button layer */}
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
                    <div className="bg-white/95 backdrop-blur-md px-5.5 py-3 rounded-full text-[11px] font-extrabold tracking-wider uppercase text-slate-950 shadow-xl border border-white/30 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 flex items-center gap-1.5">
                      <span>Explore Stay</span>
                      <svg className="w-3.5 h-3.5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Stay Details */}
                <div className="flex flex-col gap-1.5 mt-5 px-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-450 dark:text-slate-500">
                    {listing.country}
                  </span>
                  
                  <h3 className="font-extrabold text-slate-900 dark:text-white group-hover:text-brand transition-colors text-[18px] leading-snug truncate">
                    {listing.title}
                  </h3>
                  
                  {/* Divider separating content and pricing */}
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-baseline gap-1 text-slate-800 dark:text-slate-200">
                      <span className="font-black text-[22px] text-slate-950 dark:text-white tracking-tight">
                        ₹{Math.round(finalPrice).toLocaleString('en-IN')}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400 text-xs font-semibold">/ night</span>
                    </div>
                    {showTax && (
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-black px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg border border-emerald-100 dark:border-emerald-900/30 shrink-0">
                        +18% GST
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

    </div>
  );
}

export default ListingsIndex;
