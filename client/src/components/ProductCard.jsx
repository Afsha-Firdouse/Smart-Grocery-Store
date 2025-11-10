import React from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/useAppContext";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { currency, addToCart, removeFromCart, cartItems } = useAppContext();

  return (
    product && (
      <div
        onClick={() => {
          navigate(
            `/products/${product.category.toLowerCase()}/${product._id}`
          );
          window.scrollTo(0, 0);
        }}
        className="border border-gray-500/20 rounded-md bg-white p-4 sm:p-5 w-full max-w-[200px] mx-auto shadow-sm hover:shadow-md transition-shadow duration-300"
      >
        <div className="group cursor-pointer flex items-center justify-center px-2">
          <img
            className="group-hover:scale-105 transition max-w-26 md:max-w-36"
            src={product.image[0]}
            alt={product.name}
          />
        </div>
        <div className="text-gray-500/60 text-sm">
          <p>{product.category}</p>
          <p className="text-gray-700 font-medium text-lg truncate w-full">
            {product.name}
          </p>
          <div className="flex items-center gap-0.5">
            {Array(5)
              .fill("")
              .map((_, i) => (
                <img
                  key={i}
                  src={
                    i < product.rating
                      ? assets.star_icon
                      : assets.star_dull_icon
                  }
                  alt=""
                  className="md:w-3.5 w-3"
                />
              ))}
            <p>({product.rating})</p>
          </div>
          <div className="flex items-end justify-between mt-3">
            <p className="md:text-xl text-base font-medium text-primary">
              {currency}
              {product.offerPrice}{" "}
              <span className="text-gray-500/60 md:text-sm text-xs line-through">
                {currency}
                {product.price}
              </span>
            </p>
            <div
              className="text-primary"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {!cartItems[product._id] ? (
                <button
                  className="flex items-center justify-center gap-1 bg-primary/10 border border-primary/40 md:w-[80px] w-[64px] h-[34px] rounded "
                  onClick={() => addToCart(product._id)}
                >
                  <img src={assets.cart_icon} alt="cart_icon" />
                  Add
                </button>
              ) : (
                <div className="flex items-center justify-center gap-2 md:w-20 w-16 h-[34px] bg-primary/25 rounded select-none">
                  <button
                    onClick={() => removeFromCart(product._id)}
                    className="cursor-pointer text-md px-2 h-full"
                  >
                    -
                  </button>
                  <span className="w-5 text-center">
                    {cartItems[product._id]}
                  </span>
                  <button
                    onClick={() => addToCart(product._id)}
                    className="cursor-pointer text-md px-2 h-full"
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default ProductCard;
