import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Zap, LogOut } from 'lucide-react'; // Added LogOut icon
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore'; // <--- Import Auth Store

const Navbar = () => {
  const cartItems = useCartStore((state) => state.cartItems);
  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  
  // Bring in Auth State
  const { user, logout } = useAuthStore(); 

  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    // ... keep existing search logic ...
    if (e.key === 'Enter') {
      if (searchTerm.trim()) {
        navigate(`/?search=${searchTerm}`);
      } else {
        navigate(`/`);
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-dark-800/80 backdrop-blur-md border-b border-dark-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* ... Keep Logo and Search Bar exactly the same ... */}
          <Link to="/" className="flex items-center gap-2 group">
            <Zap className="text-accent group-hover:scale-110 transition-transform" />
            <span className="text-xl font-bold tracking-wider text-white">TECH<span className="text-accent">VORTEX</span></span>
          </Link>

          <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearch}
              placeholder="Search electronics... (Press Enter)" 
              className="w-full bg-dark-900 border border-dark-700 rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:border-accent text-gray-200"
            />
            <Search className="absolute right-3 top-2.5 text-gray-400" size={18} />
          </div>

          {/* Updated Icons Section */}
          <div className="flex items-center gap-6">
            <Link to="/cart" className="relative group p-1">
              <ShoppingCart className="text-gray-300 group-hover:text-accent transition-colors" size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-accent text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-dark-800">
                  {cartCount}
                </span>
              )}
            </Link>
            
            {/* Conditional Rendering based on Login Status */}
            {user ? (
              <div className="flex items-center gap-4">
                <span className="hidden sm:block text-sm font-medium text-accent">Hi, {user.name}</span>
                <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-colors" title="Logout">
                  <LogOut size={22} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="flex items-center gap-2 text-gray-300 hover:text-accent transition-colors">
                <User size={24} />
                <span className="hidden sm:block text-sm font-medium">Login</span>
              </Link>
            )}
            
          </div>
          
        </div>
      </div>
      {/* --- ADD THIS: Secondary Category Navigation --- */}
      <div className="border-t border-dark-700 bg-dark-900/50 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8 h-10 text-sm font-medium text-gray-400">
            <Link to="/category/smartphones" className="hover:text-accent transition-colors">Smartphones</Link>
            <Link to="/category/laptops" className="hover:text-accent transition-colors">Laptops</Link>
            <Link to="/category/audio" className="hover:text-accent transition-colors">Audio & Headphones</Link>
            <Link to="/category/accessories" className="hover:text-accent transition-colors">Accessories</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;