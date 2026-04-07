import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User as UserIcon, Zap, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // MOCK AUTHENTICATION (Replace with Axios call later)
    if (isLogin) {
      if (formData.email && formData.password) {
        // Fake successful login
        login({ name: 'Test User', email: formData.email, role: 'user' }, 'mock-jwt-token-123');
        toast.success('Welcome back!', { style: { background: '#333', color: '#fff' } });
        navigate('/');
      } else {
        toast.error('Please fill in all fields', { style: { background: '#333', color: '#fff' } });
      }
    } else {
      if (formData.name && formData.email && formData.password) {
        // Fake successful registration
        login({ name: formData.name, email: formData.email, role: 'user' }, 'mock-jwt-token-123');
        toast.success('Account created successfully!', { style: { background: '#333', color: '#fff' } });
        navigate('/');
      } else {
        toast.error('Please fill in all fields', { style: { background: '#333', color: '#fff' } });
      }
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center animate-fade-in px-4">
      <div className="w-full max-w-md bg-dark-800 rounded-2xl border border-dark-700 shadow-2xl overflow-hidden">
        
        {/* Header Section */}
        <div className="bg-dark-900 p-8 text-center border-b border-dark-700">
          <div className="flex justify-center mb-4">
            <div className="bg-accent/10 p-3 rounded-full">
              <Zap className="text-accent" size={32} />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {isLogin ? 'Welcome Back' : 'Create an Account'}
          </h2>
          <p className="text-gray-400 text-sm">
            {isLogin ? 'Sign in to access your cart and orders.' : 'Join us to get the best tech deals.'}
          </p>
        </div>

        {/* Form Section */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Name Input (Only shows if Registering) */}
            {!isLogin && (
              <div className="relative group">
                <UserIcon className="absolute left-3 top-3 text-gray-500 group-focus-within:text-accent transition-colors" size={20} />
                <input 
                  type="text" 
                  name="name"
                  placeholder="Full Name" 
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-dark-900 border border-dark-700 rounded-lg py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-accent text-gray-200 transition-colors"
                />
              </div>
            )}

            {/* Email Input */}
            <div className="relative group">
              <Mail className="absolute left-3 top-3 text-gray-500 group-focus-within:text-accent transition-colors" size={20} />
              <input 
                type="email" 
                name="email"
                placeholder="Email Address" 
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-dark-900 border border-dark-700 rounded-lg py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-accent text-gray-200 transition-colors"
              />
            </div>

            {/* Password Input */}
            <div className="relative group">
              <Lock className="absolute left-3 top-3 text-gray-500 group-focus-within:text-accent transition-colors" size={20} />
              <input 
                type="password" 
                name="password"
                placeholder="Password" 
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-dark-900 border border-dark-700 rounded-lg py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-accent text-gray-200 transition-colors"
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-accent hover:bg-blue-600 text-white py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 group"
            >
              {isLogin ? 'Sign In' : 'Sign Up'}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Toggle Button */}
          <div className="mt-6 text-center text-sm text-gray-400">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => {
                setIsLogin(!isLogin);
                setFormData({ name: '', email: '', password: '' }); // Reset form
              }}
              className="text-accent hover:underline font-medium"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;