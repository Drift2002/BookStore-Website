import React, { useState, useEffect } from 'react';
import bookData from '../assets/data/books.json';
import {useCart} from '../context/CartContext';

function Shop() {
  //Cart
  const {addToCart} = useCart();

  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  

  // Get all unique categories from books
  const categories = ['All', ...new Set(bookData.map(book => book.category))];

  useEffect(() => {
    const fetchCoverImages = async () => {
      const booksWithCovers = await Promise.all(
        bookData.map(async (book) => {
          if (book.isbn) {
            try {
              const response = await fetch(
                `https://www.googleapis.com/books/v1/volumes?q=isbn:${book.isbn}`
              );
              if (!response.ok) {
                console.error(`Error fetching cover for ${book.name}: ${response.status}`);
                return { ...book, coverImg: '' };
              }
              const data = await response.json();
              if (data.items && data.items.length > 0 && data.items[0].volumeInfo.imageLinks) {
                return { ...book, coverImg: data.items[0].volumeInfo.imageLinks.thumbnail || '' };
              } else {
                return { ...book, coverImg: '' };
              }
            } catch (error) {
              console.error(`Error fetching cover for ${book.name}:`, error);
              return { ...book, coverImg: '' };
            }
          }
          return book;
        })
      );
      setBooks(booksWithCovers);
      setFilteredBooks(booksWithCovers);
      setLoading(false);
    };

    fetchCoverImages();
  }, []);

  // Filter books by category
  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredBooks(books);
    } else {
      const filtered = books.filter(book => book.category === selectedCategory);
      setFilteredBooks(filtered);
    }
  }, [selectedCategory, books]);

  if (loading) {
    return <div className="text-center py-8 text-cyan-300">Loading books...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-400">Error loading books: {error.message}</div>;
  }
  


  

  return (
    <div className="min-h-screen pt-8 md:pt-10 bg-gradient-to-b from-gray-800 to-gray-900 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-6 md:mb-8">
          Our Books
        </h1>
        
        {/* Category Filter */}
        <div className="mb-8 flex flex-wrap gap-2 md:gap-4">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm md:text-base font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                  : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700/70'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {filteredBooks.map(book => (
            <div key={book.id} className="group relative bg-gray-800/30 rounded-xl md:rounded-2xl backdrop-blur-xl border border-white/10 hover:border-cyan-400/30 transition-all duration-300 hover:-translate-y-1 md:hover:-translate-y-2 shadow-lg hover:shadow-xl md:shadow-2xl hover:shadow-cyan-400/10 p-4 md:p-6 flex flex-col h-full">
              {/* Book cover image */}
              <div className="relative aspect-[4/5] w-full rounded-xl md:rounded-2xl overflow-hidden bg-gradient-to-br from-cyan-400/10 to-blue-400/10 mb-4">
                {book.coverImg ? (
                  <img 
                    src={book.coverImg} 
                    alt={`Cover of ${book.name}`} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No cover available
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent"/>
              </div>

              {/* Book details */}
              <div className='flex-grow'>
                  <h3 className="text-lg md:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                      {book.name}
                  </h3>
                  
                  <p className="text-gray-400 mt-1 md:mt-2 text-sm md:text-base">
                      By: {book.author}
                  </p>
                  
                  <p className="text-gray-300 mt-2 text-sm md:text-base">
                      {book.description}
                  </p>
                  
                  <p className="text-gray-400 mt-2 text-sm md:text-base">
                      Category: {book.category}
                  </p>
                  
                  <p className="text-cyan-300 mt-2 text-sm md:text-base">
                      Price: ${book.price}
                  </p>
                  
                  <p className="text-blue-300 mt-2 text-sm md:text-base">
                      Stock: {book.stock}
                  </p>
              </div>

              <button 
              onClick={() => addToCart(book)}
              className="mt-4 bg-gradient-to-r from-cyan-500 to-blue-600 w-full px-6 py-2 rounded-full font-bold text-white shadow-lg hover:shadow-cyan-500/30 transition-all">
                  Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Shop;