import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_PRODUCTS } from '../data';
import ProductCard from '../components/ProductCard';
import { SlidersHorizontal, ArrowDownUp, PackageX } from 'lucide-react';

const Category = () => {
  const { categoryName } = useParams();
  
  // Format the URL parameter for display (e.g., "smartphones" -> "Smartphones")
  const displayCategory = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);

  // --- FILTER & SORT STATE ---
  const [sortBy, setSortBy] = useState('featured');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [priceFilter, setPriceFilter] = useState('all');

  // --- ADVANCED FILTERING & SORTING LOGIC ---
  // useMemo ensures we only recalculate this when the state or category changes
  const filteredAndSortedProducts = useMemo(() => {
    // 1. Filter by Category
    let result = MOCK_PRODUCTS.filter(
      (p) => p.category.toLowerCase() === categoryName.toLowerCase()
    );

    // 2. Filter by Stock
    if (inStockOnly) {
      result = result.filter((p) => p.stock > 0);
    }

    // 3. Filter by Price Range
    if (priceFilter === 'under100') {
      result = result.filter((p) => p.price < 100);
    } else if (priceFilter === '100-500') {
      result = result.filter((p) => p.price >= 100 && p.price <= 500);
    } else if (priceFilter === 'over500') {
      result = result.filter((p) => p.price > 500);
    }

    // 4. Apply Sorting
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default: // 'featured' - just returns the default order
        break;
    }

    return result;
  }, [categoryName, sortBy, inStockOnly, priceFilter]);

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      
      {/* Page Header */}
      <div className="mb-8 border-b border-dark-700 pb-6">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          {displayCategory} 
          <span className="text-sm font-normal text-gray-500 bg-dark-800 px-3 py-1 rounded-full border border-dark-700">
            {filteredAndSortedProducts.length} Results
          </span>
        </h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* --- LEFT SIDEBAR: FILTERS --- */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-dark-800 p-6 rounded-xl border border-dark-700 sticky top-24">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2 border-b border-dark-700 pb-3">
              <SlidersHorizontal size={20} className="text-accent" /> Filters
            </h2>

            {/* Stock Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">Availability</h3>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={inStockOnly} 
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 rounded bg-dark-900 border-dark-700 text-accent focus:ring-accent focus:ring-offset-dark-800"
                />
                <span className="text-gray-300 group-hover:text-white transition-colors">In Stock Only</span>
              </label>
            </div>

            {/* Price Filter */}
            <div>
              <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">Price Range</h3>
              <div className="space-y-3">
                {[
                  { id: 'all', label: 'All Prices' },
                  { id: 'under100', label: 'Under $100' },
                  { id: '100-500', label: '$100 - $500' },
                  { id: 'over500', label: 'Over $500' },
                ].map((option) => (
                  <label key={option.id} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="priceRange"
                      value={option.id}
                      checked={priceFilter === option.id}
                      onChange={(e) => setPriceFilter(e.target.value)}
                      className="w-4 h-4 bg-dark-900 border-dark-700 text-accent focus:ring-accent focus:ring-offset-dark-800"
                    />
                    <span className="text-gray-300 group-hover:text-white transition-colors">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Reset Filters Button */}
            <button 
              onClick={() => { setInStockOnly(false); setPriceFilter('all'); }}
              className="w-full mt-8 py-2 text-sm text-gray-400 hover:text-white bg-dark-900 hover:bg-dark-700 border border-dark-700 rounded-lg transition-all"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* --- RIGHT CONTENT: SORTING & PRODUCTS --- */}
        <div className="flex-1">
          
          {/* Sorting Topbar */}
          <div className="bg-dark-800 p-4 rounded-xl border border-dark-700 mb-6 flex justify-between items-center">
            <span className="text-gray-400 text-sm hidden sm:block">
              Showing {filteredAndSortedProducts.length} items
            </span>
            
            <div className="flex items-center gap-3 ml-auto">
              <ArrowDownUp size={18} className="text-gray-400" />
              <span className="text-sm text-gray-400">Sort by:</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-dark-900 border border-dark-700 text-white text-sm rounded-lg py-2 px-3 focus:outline-none focus:border-accent cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          {filteredAndSortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredAndSortedProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-dark-800 rounded-xl border border-dark-700 text-center px-4">
              <PackageX size={64} className="text-gray-600 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No products found</h3>
              <p className="text-gray-400 max-w-md">
                We couldn't find any items matching your current filters in this category. Try adjusting your price range or stock filters.
              </p>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
};

export default Category;