import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const AppContext = createContext(null);

export default AppContext;
export const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY || "₹";

  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(true);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState({});

// Fetch Seller Status
 const fetchSeller = async () => {
   try{
      const {data} = await axios.get('/api/seller/is-auth');
      if(data.success){
       setIsSeller(true);
      } else{
       setIsSeller(false);
      }

   } catch(error){
     console.log(error);
     setIsSeller(false);

   }
   }
   
  // Fetch User Auth Status , User Data and Cart Items
  const fetchUser = async () => {
    try{
      const {data} = await axios.get('/api/user/is-auth');
      if(data.success){
        setUser(data.user);
        setCartItems(data.user.cartItems || {});
        setShowUserLogin(false);
      } else {
        setUser(null);
        setShowUserLogin(true);
      }
    } catch(error){
      console.log(error);
      setUser(null);
      setShowUserLogin(true);
    } finally {
      setLoading(false);
    }
  }

  //Fetch ALL products
  const fetchProducts = async () => {
    try{
      const {data} = await axios.get('/api/product/list');
      if(data.success){
        setProducts(data.products);
      } else{
        console.error(data.message);
      }

    } catch(error){
      console.error(error.message);
    }
  };

  //Add Product to cart
  const addToCart = (itemId) => {
    let cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      cartData[itemId] += 1;
    } else {
      cartData[itemId] = 1;
    }
    setCartItems(cartData);
    toast.success("Added to cart");
  };

  // update cart item quantity
  const updateCartItem = (itemId, quantity) => {
    let cartData = structuredClone(cartItems);
    if (quantity > 0) {
      cartData[itemId] = quantity;
    } else {
      delete cartData[itemId];
    }
    setCartItems(cartData);
    toast.success("Cart updated successfully");
  };

  //Remove Product from cart
  const removeFromCart = (itemId) => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId] -= 1;
      if (cartData[itemId] === 0) {
        delete cartData[itemId];
      }
    }
    toast.success("Removed from cart");
    setCartItems(cartData);
  };

  //get cart item count
  const getCartCount = () => {
    let totalCount = 0;
    for (const item in cartItems) {
      totalCount += cartItems[item];
    }
    return totalCount;
  };

  //get cart total amount
  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);
      if (cartItems[items] > 0) {
        totalAmount += itemInfo.offerPrice * cartItems[items];
      }
    }
    return Math.floor(totalAmount * 100) / 100;
  };

  useEffect(() => {
    fetchUser();
    fetchSeller();
    fetchProducts();
  }, []);

  // Update Database Cart Items
  useEffect(() => {
    const updateCart = async () => {
       try{ 
        const {data} = await axios.post('/api/cart/update', {cartItems});
        if(!data.success){
          toast.error(data.message);
        }

       } catch (error) {
        toast.error(error.message);
       }
    };
   if(user){
     updateCart();
   }
  }, [cartItems]);


  const value = {
    navigate,
    user,
    products,
    setUser,
    isSeller,
    setIsSeller,
    showUserLogin,
    setShowUserLogin,
    currency,
    addToCart,
    updateCartItem,
    removeFromCart,
    cartItems,
    searchQuery,
    setSearchQuery,
    getCartCount,
    getCartAmount,
    axios,
    fetchProducts,
    loading
    };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
