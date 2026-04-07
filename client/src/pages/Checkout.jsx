import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { CreditCard, MapPin, CheckCircle, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const Checkout = () => {
  const { cartItems, getTotalPrice, clearCart } = useCartStore();
  const navigate = useNavigate();

  // Redirect back if cart is empty
  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  const [shippingData, setShippingData] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    country: ''
  });

  const handleChange = (e) => {
    setShippingData({ ...shippingData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    
    // Basic validation
    const { fullName, address, city, postalCode, country } = shippingData;
    if (!fullName || !address || !city || !postalCode || !country) {
      toast.error('Please fill in all shipping fields', { style: { background: '#333', color: '#fff' } });
      return;
    }

    // MOCK ORDER CREATION (Replace with API call later)
    toast.success('Order placed successfully! Check your email for details.', { 
      duration: 5000,
      icon: '🎉',
      style: { background: '#333', color: '#fff' } 
    });
    
    clearCart();
    navigate('/');
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <Link to="/cart" className="inline-flex items-center gap-2 text-gray-400 hover:text-accent transition-colors mb-6">
        <ArrowLeft size={20} />
        <span>Back to Cart</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        
        {/* Shipping Form Section */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-dark-800 p-6 md:p-8 rounded-2xl border border-dark-700">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2 border-b border-dark-700 pb-4">
              <MapPin className="text-accent" /> Shipping Details
            </h2>
            
            <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                <input 
                  type="text" name="fullName" value={shippingData.fullName} onChange={handleChange}
                  className="w-full bg-dark-900 border border-dark-700 rounded-lg py-3 px-4 text-sm focus:outline-none focus:border-accent text-gray-200"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Address</label>
                <input 
                  type="text" name="address" value={shippingData.address} onChange={handleChange}
                  className="w-full bg-dark-900 border border-dark-700 rounded-lg py-3 px-4 text-sm focus:outline-none focus:border-accent text-gray-200"
                  placeholder="123 Tech Street"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">City</label>
                  <input 
                    type="text" name="city" value={shippingData.city} onChange={handleChange}
                    className="w-full bg-dark-900 border border-dark-700 rounded-lg py-3 px-4 text-sm focus:outline-none focus:border-accent text-gray-200"
                    placeholder="Silicon Valley"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Postal Code</label>
                  <input 
                    type="text" name="postalCode" value={shippingData.postalCode} onChange={handleChange}
                    className="w-full bg-dark-900 border border-dark-700 rounded-lg py-3 px-4 text-sm focus:outline-none focus:border-accent text-gray-200"
                    placeholder="94025"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Country</label>
                <input 
                  type="text" name="country" value={shippingData.country} onChange={handleChange}
                  className="w-full bg-dark-900 border border-dark-700 rounded-lg py-3 px-4 text-sm focus:outline-none focus:border-accent text-gray-200"
                  placeholder="United States"
                />
              </div>
            </form>
          </div>

          {/* Payment Method (Visual Only for now) */}
          <div className="bg-dark-800 p-6 md:p-8 rounded-2xl border border-dark-700">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2 border-b border-dark-700 pb-4">
              <CreditCard className="text-accent" /> Payment Method
            </h2>
            <div className="bg-dark-900 border-2 border-accent rounded-lg p-4 flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="h-4 w-4 bg-accent rounded-full"></div>
                <span className="font-medium text-white">Credit Card (Mock)</span>
              </div>
              <div className="flex gap-2">
                <div className="w-8 h-5 bg-blue-500/20 rounded border border-blue-500/50"></div>
                <div className="w-8 h-5 bg-red-500/20 rounded border border-red-500/50"></div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4 text-center">
              Since this is a demo, no actual payment information is required.
            </p>
          </div>
        </div>

        {/* Order Summary Section */}
        <div className="lg:col-span-2">
          <div className="bg-dark-800 p-6 md:p-8 rounded-2xl border border-dark-700 sticky top-24">
            <h2 className="text-xl font-bold mb-6 border-b border-dark-700 pb-4">Order Summary</h2>
            
            <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
              {cartItems.map((item) => (
                <div key={item._id} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img src={item.images[0]?.url} alt={item.name} className="w-12 h-12 object-cover rounded bg-dark-900" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-200 truncate max-w-[120px] sm:max-w-[180px]">{item.name}</h4>
                      <p className="text-xs text-gray-500">Qty: {item.qty}</p>
                    </div>
                  </div>
                  <div className="text-sm font-bold text-white">${(item.price * item.qty).toFixed(2)}</div>
                </div>
              ))}
            </div>

            <div className="space-y-3 text-gray-300 mb-6 border-t border-dark-700 pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-400">Free</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>Calculated</span>
              </div>
            </div>
            
            <div className="flex justify-between text-2xl font-bold text-white border-t border-dark-700 pt-4 mb-8">
              <span>Total</span>
              <span className="text-accent">${getTotalPrice().toFixed(2)}</span>
            </div>

            <button 
              type="submit" 
              form="checkout-form"
              className="w-full bg-accent hover:bg-blue-600 text-white py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-accent/20"
            >
              <CheckCircle size={22} />
              Place Order
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;