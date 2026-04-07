import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { MOCK_PRODUCTS } from '../data'; // Import shared data

const Home = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  // Filter products based on search query

  const displayedProducts = MOCK_PRODUCTS.filter(product => {
  
    const searchLower = searchQuery.toLowerCase().trim();
    

    if (!searchLower) return true;

  
    const matchName = product.name.toLowerCase().includes(searchLower);
    const matchCategory = product.category.toLowerCase().includes(searchLower);
    const matchDescription = product.description?.toLowerCase().includes(searchLower);

    return matchName || matchCategory || matchDescription;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Only show Hero Banner if not searching */}
      {!searchQuery && (
        <div className="bg-gradient-to-r from-dark-800 to-dark-700 rounded-2xl p-8 sm:p-12 border border-dark-700 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-8">
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 leading-tight">
              Next-Gen Tech, <br/><span className="text-accent">Delivered.</span>
            </h1>
            <p className="text-gray-400 max-w-md">Upgrade your setup with the latest premium electronics and accessories.</p>
          </div>
        </div>
      )}

      {/* Product Grid */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6 border-l-4 border-accent pl-3">
          {searchQuery ? `Search Results for "${searchQuery}"` : 'Featured Products'}
        </h2>
        
        {displayedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayedProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-dark-800 rounded-xl border border-dark-700">
            <p className="text-gray-400 text-lg">No products found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;