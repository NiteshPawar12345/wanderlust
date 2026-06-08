import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Globe, User as UserIcon, Trash2, Edit, Star, ChevronLeft, ShieldAlert } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

function ListingShow({ user, showNotification, darkMode }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Review Form States
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Map Refs
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);

  const fetchListingDetails = async () => {
    try {
      const response = await axios.get(`/api/listings/${id}`);
      setListing(response.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to retrieve stay details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListingDetails();
  }, [id]);

  // Leaflet Map Initialization and Dynamic Skin Updating Hook
  useEffect(() => {
    if (!listing || !mapContainerRef.current) return;

    let coords = listing.geometry?.coordinates;
    if (!coords || !Array.isArray(coords) || coords.length < 2 || coords[0] === undefined || coords[1] === undefined || coords[0] === null || coords[1] === null) {
      coords = [77.2090, 28.6139]; // Default coordinates (Delhi)
    }
    const lat = coords[1];
    const lng = coords[0];

    const tileUrl = darkMode 
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

    // If map already initialized, dynamically swap the tile layer
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([lat, lng], 13);
      if (tileLayerRef.current) {
        mapInstanceRef.current.removeLayer(tileLayerRef.current);
      }
      const newTiles = L.tileLayer(tileUrl, {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(mapInstanceRef.current);
      tileLayerRef.current = newTiles;
      return;
    }

    // Initialize Map instance
    const map = L.map(mapContainerRef.current, {
      zoomControl: true,
      scrollWheelZoom: false
    }).setView([lat, lng], 13);
    
    mapInstanceRef.current = map;

    // Save tile layer reference for future swaps
    const tiles = L.tileLayer(tileUrl, {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);
    tileLayerRef.current = tiles;

    // Custom brand SVG location marker pin
    const brandPinIcon = L.divIcon({
      html: `
        <div class="relative group">
          <div class="absolute -inset-1 rounded-full bg-brand/35 blur animate-ping"></div>
          <svg class="w-8 h-8 drop-shadow-md text-brand fill-current stroke-white dark:stroke-slate-900 stroke-2" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        </div>
      `,
      className: 'custom-brand-marker',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });

    L.marker([lat, lng], { icon: brandPinIcon })
      .addTo(map)
      .bindPopup(`
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; padding: 2px;">
          <p style="font-weight: 800; font-size: 13px; margin: 0; color: #0f172a;">${listing.title}</p>
          <p style="font-weight: 500; font-size: 11px; margin: 3px 0 0 0; color: #64748b;">${listing.location}, ${listing.country}</p>
        </div>
      `)
      .openPopup();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        tileLayerRef.current = null;
      }
    };
  }, [listing, darkMode]);

  const handleDeleteListing = async () => {
    if (window.confirm('Are you absolutely sure you want to delete this listing?')) {
      try {
        const res = await axios.delete(`/api/listings/${id}`);
        if (res.data.success) {
          showNotification('Listing deleted successfully!', 'success');
          navigate('/');
        }
      } catch (err) {
        console.error(err);
        showNotification(err.response?.data?.error || 'Could not delete listing.', 'error');
      }
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      showNotification('Please enter a comment for your review.', 'error');
      return;
    }
    setSubmittingReview(true);
    try {
      const res = await axios.post(`/api/listings/${id}/reviews`, {
        review: { rating, comment }
      });
      if (res.data.success) {
        showNotification('Review posted successfully!', 'success');
        setComment('');
        setRating(5);
        fetchListingDetails();
      }
    } catch (err) {
      console.error(err);
      showNotification(err.response?.data?.error || 'Could not submit review.', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Delete this review?')) {
      try {
        const res = await axios.delete(`/api/listings/${id}/reviews/${reviewId}`);
        if (res.data.success) {
          showNotification('Review deleted successfully!', 'success');
          fetchListingDetails();
        }
      } catch (err) {
        console.error(err);
        showNotification(err.response?.data?.error || 'Could not delete review.', 'error');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
        <p className="mt-4 text-slate-500 dark:text-slate-450 font-semibold animate-pulse">Fetching stay details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-50 dark:bg-rose-955/20 border border-rose-100 dark:border-rose-900/30 p-8 rounded-2xl text-center max-w-lg mx-auto py-10 my-10 shadow-sm">
        <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-rose-800 dark:text-rose-200 mb-2">Listing Error</h3>
        <p className="text-rose-600 dark:text-rose-400 text-sm mb-6">{error}</p>
        <Link to="/" className="bg-brand hover:bg-brand-dark text-white font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-md">
          Return to home
        </Link>
      </div>
    );
  }

  const isListingOwner = user && listing.owner && user._id === listing.owner._id;

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto transition-colors duration-300">
      
      {/* Back button */}
      <Link to="/" className="inline-flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold text-xs uppercase tracking-wider transition-colors group">
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform stroke-[2.5]" />
        <span>Back to search</span>
      </Link>

      {/* Main Listing Header */}
      <div className="space-y-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
          {listing.title}
        </h1>
        
        {/* Sub-header info */}
        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-sm font-semibold text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 px-3.5 py-1.5 rounded-full border border-slate-200/50 dark:border-slate-800/80">
            <MapPin className="w-4 h-4 text-slate-455 dark:text-slate-500" />
            <span>{listing.location}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 px-3.5 py-1.5 rounded-full border border-slate-200/50 dark:border-slate-800/80">
            <Globe className="w-4 h-4 text-slate-455 dark:text-slate-500" />
            <span>{listing.country}</span>
          </div>
          {listing.owner && (
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
              <span>Hosted by</span>
              <span className="text-slate-800 dark:text-slate-200 font-extrabold">@{listing.owner.username}</span>
            </div>
          )}
        </div>
      </div>

      {/* Gallery Image */}
      <div className="aspect-[21/9] w-full rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-900 shadow-md">
        <img
          src={listing.image.url}
          alt={listing.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Detailed Content (2-Column Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Column: Stay Information */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="bg-white dark:bg-slate-900/50 p-6 sm:p-8 rounded-[32px] border border-slate-200/65 dark:border-slate-800/80 shadow-[0_5px_20px_rgba(0,0,0,0.01)] space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 border-b border-slate-100 dark:border-slate-800/85 pb-3">About this space</h2>
              <p className="text-slate-650 dark:text-slate-300 text-base leading-relaxed whitespace-pre-wrap">
                {listing.description || "No description provided."}
              </p>
            </div>

            {/* Price Box Card */}
            <div className="bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200/60 dark:border-slate-800/50 p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Price per night</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-black text-slate-900 dark:text-white">₹{listing.price.toLocaleString('en-IN')}</span>
                  <span className="text-slate-500 dark:text-slate-400 font-semibold text-sm">/ night</span>
                </div>
              </div>

              {/* Edit/Delete Owners Action Panel */}
              {isListingOwner && (
                <div className="flex items-center gap-3">
                  <Link
                    to={`/listings/${listing._id}/edit`}
                    className="flex items-center gap-1.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 font-bold px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow transition-all text-xs uppercase tracking-wider"
                  >
                    <Edit className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    <span>Edit</span>
                  </Link>
                  <button
                    onClick={handleDeleteListing}
                    className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-sm hover:shadow transition-all text-xs uppercase tracking-wider border-none"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Map Location Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800/85 pb-2">Where you'll be</h2>
            <div className="relative overflow-hidden rounded-[24px] border border-slate-200/80 dark:border-slate-800/85 shadow-md">
              <div 
                ref={mapContainerRef} 
                className="h-[350px] w-full z-10"
                style={{ minHeight: '350px' }}
              ></div>
            </div>
            
            <div className="flex flex-wrap items-center justify-between gap-4 px-1">
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-brand" />
                <span>{listing.location}, {listing.country}</span>
              </p>
              {listing.geometry?.coordinates && listing.geometry.coordinates.length >= 2 && listing.geometry.coordinates[0] !== undefined && listing.geometry.coordinates[1] !== undefined && (
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${listing.geometry.coordinates[1]},${listing.geometry.coordinates[0]}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-brand hover:text-brand-dark dark:text-brand-light dark:hover:text-brand hover:underline flex items-center gap-1 transition-colors uppercase tracking-wider"
                >
                  <span>Open in Google Maps</span>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Reviews List Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/85 pb-3">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Reviews ({listing.reviews?.length || 0})
              </h2>
            </div>

            {(listing.reviews?.length || 0) > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {listing.reviews.map((rev) => {
                  const isReviewAuthor = user && rev.author && user._id === rev.author._id;
                  return (
                    <div key={rev._id} className="bg-white dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col justify-between space-y-4 hover:shadow transition-shadow">
                      <div className="space-y-2.5">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-brand-light dark:bg-brand-light/10 flex items-center justify-center text-brand font-bold uppercase text-sm border border-brand/20">
                            {rev.author.username ? rev.author.username.charAt(0) : '?'}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">@{rev.author.username || 'anonymous'}</p>
                          </div>
                        </div>

                        <div className="starability-result" data-rating={rev.rating}>
                          Rated: {rev.rating} stars
                        </div>

                        <p className="text-slate-600 dark:text-slate-350 text-sm leading-relaxed">
                          {rev.comment}
                        </p>
                      </div>

                      {isReviewAuthor && (
                        <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800/80">
                          <button
                            onClick={() => handleDeleteReview(rev._id)}
                            className="text-xs font-bold uppercase tracking-wider text-rose-500 hover:text-rose-700 flex items-center gap-1 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 border-dashed p-8 rounded-2xl text-center text-slate-500 dark:text-slate-400 text-sm">
                No reviews yet. Be the first to share your experience!
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Write Review Box */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 bg-white dark:bg-slate-900/50 p-6 rounded-[32px] border border-slate-200/80 dark:border-slate-800/80 shadow-md space-y-6">
            {user ? (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800/80 pb-2">Leave a Review</h3>
                
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Rating</label>
                  
                  <fieldset className="starability-slot">
                    <input 
                      type="radio" 
                      id="no-rate" 
                      className="input-no-rate" 
                      name="review[rating]" 
                      value="1" 
                      checked={rating === 1}
                      onChange={() => setRating(1)} 
                      aria-label="No rating." 
                    />
                    <input 
                      type="radio" 
                      id="first-rate1" 
                      name="review[rating]" 
                      value="1" 
                      checked={rating === 1} 
                      onChange={() => setRating(1)} 
                    />
                    <label htmlFor="first-rate1" title="Terrible">1 star</label>
                    
                    <input 
                      type="radio" 
                      id="first-rate2" 
                      name="review[rating]" 
                      value="2" 
                      checked={rating === 2} 
                      onChange={() => setRating(2)} 
                    />
                    <label htmlFor="first-rate2" title="Not good">2 stars</label>
                    
                    <input 
                      type="radio" 
                      id="first-rate3" 
                      name="review[rating]" 
                      value="3" 
                      checked={rating === 3} 
                      onChange={() => setRating(3)} 
                    />
                    <label htmlFor="first-rate3" title="Average">3 stars</label>
                    
                    <input 
                      type="radio" 
                      id="first-rate4" 
                      name="review[rating]" 
                      value="4" 
                      checked={rating === 4} 
                      onChange={() => setRating(4)} 
                    />
                    <label htmlFor="first-rate4" title="Very good">4 stars</label>
                    
                    <input 
                      type="radio" 
                      id="first-rate5" 
                      name="review[rating]" 
                      value="5" 
                      checked={rating === 5} 
                      onChange={() => setRating(5)} 
                    />
                    <label htmlFor="first-rate5" title="Amazing">5 stars</label>
                  </fieldset>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="comment" className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Your Comment</label>
                  <textarea
                    id="comment"
                    rows="4"
                    placeholder="Write details about your stay..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full bg-slate-55 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand dark:text-slate-100 transition-all placeholder-slate-400"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="w-full bg-slate-950 dark:bg-slate-100 text-white dark:text-slate-950 font-bold py-3.5 rounded-xl transition-all shadow-sm text-sm"
                >
                  {submittingReview ? 'Posting review...' : 'Submit Review'}
                </button>
              </form>
            ) : (
              <div className="text-center py-6 space-y-4">
                <Star className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
                <h3 className="font-bold text-slate-900 dark:text-white">Review this stay</h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed px-4">
                  You must be logged in to write comments and leave reviews for listings.
                </p>
                <Link
                  to="/login"
                  className="inline-block bg-brand hover:bg-brand-dark text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-sm hover:shadow transition-all"
                >
                  Log in to comment
                </Link>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}

export default ListingShow;
