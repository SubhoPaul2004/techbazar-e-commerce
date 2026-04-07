import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, CheckCircle, XCircle, Star, Image as ImageIcon, X } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { MOCK_PRODUCTS } from '../data';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

const ProductDetails = () => {
  const { id } = useParams();
  const addToCart = useCartStore((state) => state.addToCart);
  const { user } = useAuthStore(); // Check if user is logged in to review
  
  const product = MOCK_PRODUCTS.find(p => p._id === id);

  // --- REVIEW SYSTEM STATE ---
  // Mocking initial reviews since we don't have a database yet
  const [reviews, setReviews] = useState([
    {
      id: 1,
      user: 'Alex Johnson',
      rating: 5,
      comment: 'Absolutely love this! The quality is top-notch and delivery was fast.',
      image: null,
      date: '2026-04-01'
    }
  ]);

  // Form State
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  if (!product) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-white mb-4">Product Not Found</h2>
        <Link to="/" className="text-accent hover:underline">Return to Home</Link>
      </div>
    );
  }

  const handleAdd = () => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`, {
      style: { background: '#333', color: '#fff' }
    });
  };

  // Handle local image preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Creates a temporary local URL for the frontend preview
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
    }
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    
    if (!comment.trim()) {
      toast.error('Please write a review comment', { style: { background: '#333', color: '#fff' } });
      return;
    }

    const newReview = {
      id: Date.now(),
      user: user ? user.name : 'Guest User',
      rating,
      comment,
      image: imagePreview, // In production, this would be a Cloudinary URL
      date: new Date().toISOString().split('T')[0]
    };

    // Add new review to the top of the list
    setReviews([newReview, ...reviews]);
    
    // Reset form
    setRating(5);
    setComment('');
    setImagePreview(null);
    
    toast.success('Review submitted successfully!', { style: { background: '#333', color: '#fff' } });
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-accent transition-colors mb-8">
        <ArrowLeft size={20} />
        <span>Back to Products</span>
      </Link>

      {/* --- TOP: PRODUCT DETAILS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-dark-800 p-6 md:p-10 rounded-2xl border border-dark-700 mb-10">
        <div className="bg-dark-900 rounded-xl overflow-hidden flex items-center justify-center p-8 border border-dark-700 h-fit sticky top-24">
          <img 
            src={product.images[0]?.url || '/placeholder.png'} 
            alt={product.name} 
            className="max-w-full h-auto object-cover rounded-lg shadow-2xl"
          />
        </div>

        <div className="flex flex-col">
          <div className="uppercase tracking-wider text-sm font-bold text-accent mb-2">
            {product.category}
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            {product.name}
          </h1>
          
          {/* Average Rating Display */}
          <div className="flex items-center gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} size={18} className="text-yellow-400 fill-yellow-400" />
            ))}
            <span className="text-gray-400 text-sm ml-2">({reviews.length} reviews)</span>
          </div>

          <div className="text-3xl font-bold text-white mb-6 border-b border-dark-700 pb-6">
            ${product.price}
          </div>

          <p className="text-gray-300 leading-relaxed mb-8">
            {product.description}
          </p>

          <div className="mb-8">
            {product.stock > 0 ? (
              <span className="flex items-center gap-2 text-green-400 font-medium bg-green-400/10 w-fit px-3 py-1 rounded-full">
                <CheckCircle size={18} /> In Stock ({product.stock} available)
              </span>
            ) : (
              <span className="flex items-center gap-2 text-red-400 font-medium bg-red-400/10 w-fit px-3 py-1 rounded-full">
                <XCircle size={18} /> Out of Stock
              </span>
            )}
          </div>

          <div className="mt-auto">
            <button 
              onClick={handleAdd}
              disabled={product.stock === 0}
              className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-lg transition-all ${
                product.stock === 0 
                  ? 'bg-dark-700 text-gray-500 cursor-not-allowed' 
                  : 'bg-accent hover:bg-blue-600 text-white shadow-lg shadow-accent/30'
              }`}
            >
              <ShoppingCart size={24} />
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>

      {/* --- BOTTOM: REVIEWS SECTION --- */}
      <div className="bg-dark-800 rounded-2xl border border-dark-700 p-6 md:p-10">
        <h2 className="text-2xl font-bold text-white mb-8 border-b border-dark-700 pb-4">Customer Reviews</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left Column: Review List */}
          <div className="space-y-6">
            {reviews.length === 0 ? (
              <p className="text-gray-400">No reviews yet. Be the first to review this product!</p>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="bg-dark-900 p-5 rounded-xl border border-dark-700">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-bold text-white">{review.user}</h4>
                      <div className="flex items-center gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} size={14} 
                            className={star <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-600"} 
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">{review.date}</span>
                  </div>
                  <p className="text-gray-300 text-sm mb-4 leading-relaxed">{review.comment}</p>
                  
                  {/* Display uploaded image if it exists */}
                  {review.image && (
                    <img 
                      src={review.image} 
                      alt="Review attachment" 
                      className="w-24 h-24 object-cover rounded-lg border border-dark-700 cursor-pointer hover:opacity-80 transition-opacity"
                    />
                  )}
                </div>
              ))
            )}
          </div>

          {/* Right Column: Write a Review Form */}
          <div>
            <div className="bg-dark-900 p-6 rounded-xl border border-dark-700 sticky top-24">
              <h3 className="text-lg font-bold text-white mb-4">Write a Review</h3>
              
              <form onSubmit={handleReviewSubmit} className="space-y-5">
                {/* Star Rating Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Rating</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={28}
                        onClick={() => setRating(star)}
                        className={`cursor-pointer transition-colors ${
                          star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-600 hover:text-yellow-400/50"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Comment Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Your Review</label>
                  <textarea
                    rows="4"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="What did you like or dislike?"
                    className="w-full bg-dark-800 border border-dark-700 rounded-lg py-3 px-4 text-sm focus:outline-none focus:border-accent text-gray-200 resize-none custom-scrollbar"
                  ></textarea>
                </div>

                {/* Image Upload Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Add a Photo (Optional)</label>
                  
                  {!imagePreview ? (
                    <label className="flex items-center justify-center gap-2 w-full border-2 border-dashed border-dark-700 rounded-lg p-4 cursor-pointer hover:border-accent/50 hover:bg-dark-800 transition-colors text-gray-400">
                      <ImageIcon size={20} />
                      <span className="text-sm">Click to upload image</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageChange} 
                        className="hidden" 
                      />
                    </label>
                  ) : (
                    <div className="relative inline-block">
                      <img src={imagePreview} alt="Preview" className="w-24 h-24 object-cover rounded-lg border border-dark-700" />
                      <button 
                        type="button"
                        onClick={() => setImagePreview(null)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                </div>

                <button 
                  type="submit"
                  className="w-full bg-accent hover:bg-blue-600 text-white py-3 rounded-lg font-bold transition-all shadow-md"
                >
                  Submit Review
                </button>
              </form>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;