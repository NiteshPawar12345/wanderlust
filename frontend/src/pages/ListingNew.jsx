import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowLeft, Tag, FileText, IndianRupee, 
  MapPin, Globe, UploadCloud, FileImage 
} from 'lucide-react';

function ListingNew({ showNotification }) {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [country, setCountry] = useState('');
  const [image, setImage] = useState(null);
  
  const [submitting, setSubmitting] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !price || !location || !country || !image) {
      showNotification('Please fill out all required fields, including the stay image.', 'error');
      return;
    }

    setSubmitting(true);

    const formData = new FormData();
    formData.append('listing[title]', title);
    formData.append('listing[description]', description);
    formData.append('listing[price]', price);
    formData.append('listing[location]', location);
    formData.append('listing[country]', country);
    formData.append('listing[image]', image);

    try {
      const res = await axios.post('/api/listings', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data.success) {
        showNotification('Stay listed successfully! Welcome to Wanderlust.', 'success');
        navigate(`/listings/${res.data.listing._id}`);
      }
    } catch (err) {
      console.error(err);
      showNotification(err.response?.data?.error || 'Failed to list stay. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative w-full min-h-[80vh] flex flex-col items-center py-6 px-4 sm:px-6 transition-colors duration-300">
      
      {/* Decorative Premium Background Blobs */}
      <div className="absolute top-10 left-1/4 w-80 h-80 bg-rose-200/40 dark:bg-rose-950/10 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse"></div>
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-pink-200/30 dark:bg-pink-950/5 rounded-full blur-[140px] pointer-events-none -z-10"></div>

      <div className="w-full max-w-2xl space-y-6">
        
        {/* Back Link */}
        <Link to="/" className="inline-flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold text-xs uppercase tracking-wider transition-colors group self-start">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform stroke-[2.5]" />
          <span>Back to explore</span>
        </Link>

        {/* Glassmorphism Card */}
        <div className="backdrop-blur-xl bg-white/75 dark:bg-slate-900/60 border border-white/40 dark:border-slate-800/80 p-8 sm:p-10 rounded-[32px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.03)] dark:shadow-[0_25px_50px_rgba(0,0,0,0.2)] space-y-8 hover:shadow-[0_30px_60px_-15px_rgba(254,66,77,0.04)] dark:hover:shadow-rose-950/10 transition-all duration-300">
          
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-950 dark:text-white tracking-tight">Wanderlust your home</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Fill out details about your property to list it on Wanderlust.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Stay Title</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none text-slate-400">
                  <Tag className="w-4 h-4 stroke-[2.2]" />
                </div>
                <input
                  type="text"
                  placeholder="Catchy title (e.g., Cozy Beachfront Villa)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800 rounded-2xl pl-12 pr-5 py-3.5 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-brand/5 focus:border-brand dark:text-slate-100 transition-all placeholder-slate-400 dark:placeholder-slate-500"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Description</label>
              <div className="relative">
                <div className="absolute top-4.5 left-4.5 flex items-center pointer-events-none text-slate-400">
                  <FileText className="w-4 h-4 stroke-[2.2]" />
                </div>
                <textarea
                  rows="4"
                  placeholder="Describe the uniqueness of your stay, amenities, bedrooms, etc."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800 rounded-2xl pl-12 pr-5 py-3.5 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-brand/5 focus:border-brand dark:text-slate-100 transition-all placeholder-slate-400 dark:placeholder-slate-500"
                  required
                />
              </div>
            </div>

            {/* Price & Location (Row) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Price */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Price per night</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none text-slate-400">
                    <IndianRupee className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <input
                    type="number"
                    placeholder="Price in INR"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800 rounded-2xl pl-12 pr-5 py-3.5 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-brand/5 focus:border-brand dark:text-slate-100 transition-all placeholder-slate-400 dark:placeholder-slate-500"
                    required
                  />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">City / Location</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none text-slate-400">
                    <MapPin className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <input
                    type="text"
                    placeholder="City (e.g., Mumbai, Goa)"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800 rounded-2xl pl-12 pr-5 py-3.5 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-brand/5 focus:border-brand dark:text-slate-100 transition-all placeholder-slate-400 dark:placeholder-slate-500"
                    required
                  />
                </div>
              </div>

            </div>

            {/* Country */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Country</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none text-slate-400">
                  <Globe className="w-4 h-4 stroke-[2.2]" />
                </div>
                <input
                  type="text"
                  placeholder="Country (e.g., India)"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800 rounded-2xl pl-12 pr-5 py-3.5 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-brand/5 focus:border-brand dark:text-slate-100 transition-all placeholder-slate-400 dark:placeholder-slate-500"
                  required
                />
              </div>
            </div>

            {/* Styled File Upload */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Cover Image</label>
              
              <div className="relative border-2 border-dashed border-slate-200 dark:border-slate-850 rounded-3xl hover:border-brand/50 transition-colors p-6 bg-slate-50/30 dark:bg-slate-950/20 text-center cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  required
                />
                
                {!image ? (
                  <div className="space-y-2.5 flex flex-col items-center py-2">
                    <div className="bg-slate-100 dark:bg-slate-800 p-3.5 rounded-2xl text-slate-500 dark:text-slate-400 shadow-inner">
                      <UploadCloud className="w-6 h-6 stroke-[2]" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Click to upload listing image</p>
                      <p className="text-slate-400 dark:text-slate-550 text-xs font-semibold mt-1">PNG, JPG or JPEG (Max 5MB)</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3 text-brand py-2">
                    <FileImage className="w-8 h-8 stroke-[2]" />
                    <div className="text-left">
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate max-w-[280px]">
                        {image.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
                        {Math.round(image.size / 1024)} KB
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:brightness-105 active:scale-98 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-rose-500/10 hover:shadow-rose-500/20 text-sm flex items-center justify-center gap-2 border-none"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Listing stay on database...</span>
                </>
              ) : (
                <span>Create Stay Listing</span>
              )}
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}

export default ListingNew;
