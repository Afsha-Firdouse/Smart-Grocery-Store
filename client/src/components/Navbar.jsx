import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/useAppContext.js";
import Login from "./Login";
import toast from "react-hot-toast";

const Navbar = () => {
  const [open, setOpen] = React.useState(false);
  const [showSearch, setShowSearch] = React.useState(false);
  const {
    user,
    setUser,
    setShowUserLogin,
    navigate,
    setSearchQuery,
    searchQuery,
    getCartCount,
    axios
  } = useAppContext();

  useEffect(() => {
    if (searchQuery.length > 0) {
      navigate(`/products`);
    }
  }, [navigate, searchQuery]);

  // ✅ Logout function
  const logout = async () => {
    try{
      const {data} = await axios.get('/api/user/logout');
      if(data.success){
        toast.success(data.message);
        setUser(null);
        navigate("/");
      } else{
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <nav className="flex items-center justify-between px-4 sm:px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all">
      {/* ✅ Logo */}
      <NavLink to="/" onClick={() => setOpen(false)}>
        <img src={assets.logo} className="h-7" alt="GreenCart Logo" />
      </NavLink>

      {/* ✅ Desktop Menu */}
      <div className="hidden md:flex items-center gap-4 lg:gap-8">
        <NavLink to="/" onClick={() => setOpen(false)}>
          Home
        </NavLink>
        <NavLink to="/products" onClick={() => setOpen(false)}>
          All Products
        </NavLink>
        <NavLink to="/contact" onClick={() => setOpen(false)}>
          Contact
        </NavLink>

        {/* ✅ Search Bar (Desktop) */}
        <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
          <input
            onChange={(e) => setSearchQuery(e.target.value)}
            className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
            type="text"
            placeholder="Search products"
          />
          <img src={assets.search_icon} alt="search" className="w-4 h-4" />
        </div>

        {/* ✅ Cart Icon */}
        <div
          onClick={() => navigate("/cart")}
          className="relative cursor-pointer"
        >
          <img
            src={assets.nav_cart_icon}
            alt="cart"
            className="w-6 opacity-80"
          />
          <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">
            {getCartCount()}
          </button>
        </div>

        {/* ✅ Login / Profile */}
        {!user ? (
          <button
            onClick={() => setShowUserLogin(true)}
            className="cursor-pointer px-6 lg:px-8 py-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm lg:text-base"
          >
            Login
          </button>
        ) : (
          <div className="relative group">
            <img src={assets.profile_icon} className="w-10" alt="profile" />
            <ul
              className="hidden group-hover:block absolute top-10 right-0 bg-white
              shadow border border-gray-200 py-2.5 w-32 rounded-md text-sm z-40"
            >
              <li
                onClick={() => navigate("/my-orders")}
                className="p-1.5 pl-3 hover:bg-indigo-50 cursor-pointer"
              >
                My Orders
              </li>
              <li
                onClick={logout}
                className="p-1.5 pl-3 hover:bg-indigo-50 cursor-pointer"
              >
                Logout
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* ✅ Mobile Buttons */}
      <div className="md:hidden flex items-center gap-2">
        <div
          onClick={() => navigate("/cart")}
          className="relative cursor-pointer p-2"
        >
          <img
            src={assets.nav_cart_icon}
            alt="cart"
            className="w-6 opacity-80"
          />
          <button className="absolute top-0 right-0 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">
            {getCartCount()}
          </button>
        </div>

        <button
          onClick={() => setShowSearch(!showSearch)}
          aria-label="Search"
          className="p-2"
        >
          <img src={assets.search_icon} alt="search" className="w-5 h-5" />
        </button>
        <button
          onClick={() => setOpen(!open)}
          aria-label="Menu"
          className="p-2"
        >
          <img src={assets.menu_icon} alt="menu" />
        </button>
      </div>

      {/* ✅ Mobile Search */}
      {showSearch && (
        <div className="absolute top-[60px] left-0 w-full bg-white shadow-md py-4 px-5 md:hidden">
          <div className="flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
            <input
              onChange={(e) => setSearchQuery(e.target.value)}
              className="py-2 w-full bg-transparent outline-none placeholder-gray-500"
              type="text"
              placeholder="Search products"
            />
            <img src={assets.search_icon} alt="search" className="w-4 h-4" />
          </div>
        </div>
      )}

      {/* ✅ Mobile Menu */}
      {open && (
        <div className="absolute top-[60px] left-0 w-full bg-white shadow-md py-4 flex flex-col items-start gap-2 px-5 text-sm md:hidden z-50">
          <NavLink to="/" onClick={() => setOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/products" onClick={() => setOpen(false)}>
            All Products
          </NavLink>
          {user && (
            <NavLink to="/my-orders" onClick={() => setOpen(false)}>
              My Orders
            </NavLink>
          )}
          <NavLink to="/contact" onClick={() => setOpen(false)}>
            Contact
          </NavLink>

          {!user ? (
            <button
              onClick={() => {
                setOpen(false);
                setShowUserLogin(true);
              }}
              className="cursor-pointer px-6 py-2 mt-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full text-sm"
            >
              Login
            </button>
          ) : (
            <button
              onClick={logout}
              className="cursor-pointer px-6 py-2 mt-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full text-sm"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
