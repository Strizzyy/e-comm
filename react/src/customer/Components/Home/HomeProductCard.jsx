import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

const HomeProductCard = ({ product }) => {
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleNavigate = () => {
    navigate(`/product/${product?.id || product?._id || 2}`);
  };

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div
      onClick={handleNavigate}
      className="group relative flex flex-col w-[15rem] border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
      role="button"
      tabIndex={0}
      onKeyPress={(e) => e.key === 'Enter' && handleNavigate()}
    >
      {/* Wishlist Button */}
      <button
        onClick={handleWishlistClick}
        className="absolute top-2 right-2 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        {isWishlisted ? (
          <HeartIconSolid className="h-5 w-5 text-red-500" />
        ) : (
          <HeartIcon className="h-5 w-5 text-gray-600 group-hover:text-red-500" />
        )}
      </button>

      {/* Product Image */}
      <div className="relative aspect-square w-full overflow-hidden">
        {imageError ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <span className="text-gray-400">Image not available</span>
          </div>
        ) : (
          <img
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
            src={product?.image || product?.imageUrl}
            alt={product?.title}
            onError={handleImageError}
            loading="lazy"
          />
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col gap-2">
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-500">{product?.brand}</p>
          <h3 className="text-base font-semibold text-gray-900 line-clamp-2">
            {product?.title}
          </h3>
        </div>
        
        {product?.discountedPrice && (
          <div className="flex items-center gap-2 mt-2">
            <p className="text-lg font-bold text-gray-900">₹{product?.discountedPrice}</p>
            {product?.price && (
              <p className="text-sm text-gray-400 line-through">₹{product?.price}</p>
            )}
            {product?.discountPersent > 0 && (
              <span className="text-sm font-medium text-green-600">
                {product?.discountPersent}% off
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeProductCard;
