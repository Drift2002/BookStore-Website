import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Banner from './components/Banner'
import Hero from './components/Hero'
import { useState, useEffect } from 'react';
import Footer from './components/Footer'
import Shop from './components/Shop'
import { useCart } from './context/CartContext';
import { toast, ToastContainer } from 'react-toastify';
import Profile from "./pages/Profile";

function App() {

  const { clearCart } = useCart();
  const [searchQuery, setSearchQuery] = useState('best sellers');
  const location = useLocation();
  const navigate = useNavigate();

  // Check if the current path is login
  const isLoginPage = location.pathname === '/login';
  const isRegisterPage = location.pathname === '/register';

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check token in localStorage
    const token = localStorage.getItem("bookstoreToken");
    setIsLoggedIn(!!token);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("bookstoreToken");
    localStorage.removeItem("bookstoreUser");
    clearCart();
    setIsLoggedIn(false);
    toast.info("Reading Maketh a Man !!!");
    navigate('/login');
    
  };

  console.log("Current path:", location.pathname);
  console.log("Logged Status:", isLoggedIn)


  //Cart functions
  const isCartPage = location.pathname === '/cart';
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (book) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === book.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === book.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { ...book, quantity: 1 }];
      }
    });
  };

  //Checkout
  const isCheckout =location.pathname === "/checkout";

  //Profile
  const isProfile = location.pathname === "/profile";

  return (
    <>
      <header className=' sticky top-0 z-50 bg-gray-900'>
        <Navbar handleSearch={(term) => setSearchQuery(term)} isLoggedIn={isLoggedIn} handleLogout={handleLogout}/>
      </header>
      <main className='min-h-screen bg-gray-900'>
        {!(isLoginPage || isRegisterPage || isCartPage || isCheckout || isProfile) && <Banner />}
        {!(isLoginPage || isRegisterPage || isCartPage || isCheckout || isProfile) && <Hero searchQuery={searchQuery} />}
        {!(isLoginPage || isRegisterPage || isCartPage || isCheckout || isProfile) && <Shop/>}
        <div>
          <Outlet context={{setIsLoggedIn, addToCart, cartItems}}/>
        </div>
      </main>
      <Footer/>

      <ToastContainer position="top-center" autoClose={3000} />
      
    </>
  )
}

export default App
