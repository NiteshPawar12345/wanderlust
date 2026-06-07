import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowLeft, Tag, FileText, IndianRupee, 
  MapPin, Globe, UploadCloud, FileImage 
} from 'lucide-react';

function ListingEdit({ showNotification }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [country, setCountry] = useState('');
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  
  const [newImage, setNewImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchListingData = async () => {
      try {
        const response = await axios.get(`/api/listings/${id}`);
        const data = response.data;
        setTitle(data.title);
        setDescription(data.description);
        setPrice(data.price);
        setLocation(data.location);
        setCountry(data.country);
        setCurrentImageUrl(data.image?.url || '');
      } catch (err) {
        console.error(err);
        showNotification(err.response?.data?.error || 'Failed to fetch listing details for editing.', 'error');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchListingData();
  }, [id]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !price || !location || !country) {
      showNotification('Please fill out all required fields.', 'error');
      return;
    }

    setSubmitting(true);

    const formData = new FormData();
    formData.append('listing[title]', title);
    formData.append('listing[description]', description);
    formData.append('listing[price]', price);
    formData.append('listing[location]', location);
    formData.append('listing[country]', country);
    if (newImage) {
      formData.append('listing[image]', newImage);
    }

    try {
      const res = await axios.put(`/api/listings/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data.success) {
        showNotification('Stay updated successfully!', 'success');
        navigate(`/listings/${id}`);
      }
    } catch (err) {
      console.error(err);
      showNotification(err.response?.data?.error || 'Failed to update stay. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-slate-50 dark:bg-slate-950 min-h-[60vh] transition-colors duration-300">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
        <p className="mt-4 text-slate-500 dark:text-slate-400 font-semibold animate-pulse">Loading listing details...</p>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-[80vh] flex flex-col items-center py-6 px-4 sm:px-6 transition-colors duration-300">
      
      {/* Decorative Premium Background Blobs */}
      <div className="absolute top-10 right-1/4 w-80 h-80 bg-rose-200/40 dark:bg-rose-950/10 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse"></div>
      <div className="absolute bottom-10 left-1/4 w-96 h-96 bg-pink-200/30 dark:bg-pink-950/5 rounded-full blur-[140px] pointer-events-none -z-10"></div>

      <div className="w-full max-w-2xl space-y-6">
        
        {/* Cancel Link */}
        <Link to={`/listings/${id}`} className="inline-flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold text-xs uppercase tracking-wider transition-colors group self-start">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform stroke-[2.5]" />
          <span>Cancel editing</span>
        </Link>

        {/* Glassmorphic card */}
        <div className="backdrop-blur-xl bg-white/75 dark:bg-slate-900/60 border border-white/40 dark:border-slate-800/80 p-8 sm:p-10 rounded-[32px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.03)] dark:shadow-[0_25px_50px_rgba(0,0,0,0.2)] space-y-8 hover:shadow-[0_30px_60px_-15px_rgba(254,66,77,0.04)] dark:hover:shadow-rose-950/10 transition-all duration-300">
          
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-950 dark:text-white tracking-tight">Edit Your Listing</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Update details about your stay listing.</p>
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
                  placeholder="Stay Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50/50 dark:bg-slate-955/40 border border-slate-200/80 dark:border-slate-800 rounded-2xl pl-12 pr-5 py-3.5 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-brand/5 focus:border-brand dark:text-slate-100 transition-all"
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
                  placeholder="Stay Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50/50 dark:bg-slate-955/40 border border-slate-200/80 dark:border-slate-800 rounded-2xl pl-12 pr-5 py-3.5 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-brand/5 focus:border-brand dark:text-slate-100 transition-all"
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
                    placeholder="Price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-slate-50/50 dark:bg-slate-955/40 border border-slate-200/80 dark:border-slate-800 rounded-2xl pl-12 pr-5 py-3.5 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-brand/5 focus:border-brand dark:text-slate-100 transition-all"
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
                    placeholder="City"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-slate-50/50 dark:bg-slate-955/40 border border-slate-200/80 dark:border-slate-800 rounded-2xl pl-12 pr-5 py-3.5 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-brand/5 focus:border-brand dark:text-slate-100 transition-all"
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
                  placeholder="Country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-slate-50/50 dark:bg-slate-955/40 border border-slate-200/80 dark:border-slate-800 rounded-2xl pl-12 pr-5 py-3.5 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-brand/5 focus:border-brand dark:text-slate-100 transition-all"
                  required
                />
              </div>
            </div>

            {/* Original Image display */}
            {currentImageUrl && (
              <div className="space-y-2.5">
                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Original Cover Image</label>
                <div className="w-44 aspect-video rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-inner">
                  <img
                    src={currentImageUrl}
                    alt="Current cover"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* Styled File Upload */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Upload New Cover Image (Optional)</label>
              
              <div className="relative border-2 border-dashed border-slate-200 dark:border-slate-850 rounded-3xl hover:border-brand/50 transition-colors p-6 bg-slate-50/30 dark:bg-slate-955/20 text-center cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                
                {!newImage ? (
                  <div className="space-y-2.5 flex flex-col items-center py-2">
                    <div className="bg-slate-100 dark:bg-slate-800 p-3.5 rounded-2xl text-slate-500 dark:text-slate-400 shadow-inner">
                      <UploadCloud className="w-6 h-6 stroke-[2]" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Click to select new image</p>
                      <p className="text-slate-400 dark:text-slate-550 text-xs font-semibold mt-1">Leave empty to keep original image</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3 text-brand py-2">
                    <FileImage className="w-8 h-8 stroke-[2]" />
                    <div className="text-left">
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate max-w-[280px]">
                        {newImage.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
                        {Math.round(newImage.size / 1024)} KB
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
                  <span>Updating stay in database...</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}

export default ListingEdit;
