import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('bookstoreCart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('bookstoreCart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (book) => {
  const token = localStorage.getItem('bookstoreToken');
  if (!token) {
    toast.warn("Please login to add items to cart");
    return;
  }

  const existingItem = cartItems.find(item => item.id === book.id);

  if (existingItem) {
    if (existingItem.quantity >= book.stock) {
      toast.info("Maximum stock limit reached");
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === book.id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
    toast.success(`Increased quantity of "${book.name}"`);
  } else {
    if (book.stock > 0) {
      setCartItems(prevItems => [...prevItems, { ...book, quantity: 1 }]);
      toast.success(`Added "${book.name}" to cart`);
    } else {
      toast.info("Out of stock");
    }
  }
};


  const updateCartItem = (bookId, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === bookId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (bookId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== bookId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      updateCartItem, 
      removeFromCart, 
      clearCart 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}