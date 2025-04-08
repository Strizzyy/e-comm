import React from "react";
import { PlusIcon, MinusIcon, TrashIcon } from '@heroicons/react/24/outline';

const CartItem = ({ item, showButton, onCartUpdate }) => {
  const jwt = localStorage.getItem("jwt");

  const handleRemoveItemFromCart = async () => {
    try {
      await fetch(`http://localhost:8080/api/cart/items/${item.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      onCartUpdate?.(); // Re-fetch cart in parent
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  const handleUpdateCartItem = async (num) => {
    const newQuantity = item.quantity + num;
    if (newQuantity <= 0) return;

    try {
      await fetch(`http://localhost:8080/api/cart/items/${item.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });
      onCartUpdate?.(); // Re-fetch cart in parent
    } catch (error) {
      console.error("Failed to update cart item:", error);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 p-4 bg-white rounded-lg shadow-sm border">
      {/* Product Image */}
      <div className="w-24 h-24 lg:w-32 lg:h-32 flex-shrink-0">
        <img
          className="w-full h-full object-cover object-center rounded-md"
          src={item?.product.imageUrl}
          alt={item?.product.title}
        />
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <div className="space-y-1">
          <h3 className="text-base font-medium text-gray-900 truncate">
            {item?.product?.title}
          </h3>
          <p className="text-sm text-gray-500">
            Size: {item?.size}, {item?.product?.color}
          </p>
          <p className="text-sm text-gray-500">
            Seller: {item?.product?.brand}
          </p>
        </div>

        {/* Price Info */}
        <div className="flex items-center gap-2 mt-2">
          <p className="text-sm text-gray-400 line-through">
            ₹{item?.product.price}
          </p>
          <p className="text-lg font-semibold text-gray-900">
            ₹{item?.product.discountedPrice}
          </p>
          {item?.product.discountPersent > 0 && (
            <span className="text-sm font-medium text-green-600">
              {item?.product.discountPersent}% off
            </span>
          )}
        </div>

        {/* Quantity Controls */}
        {showButton && (
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleUpdateCartItem(-1)}
                disabled={item?.quantity <= 1}
                className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Decrease quantity"
              >
                <MinusIcon className="h-5 w-5 text-gray-600" />
              </button>
              
              <span className="w-8 text-center font-medium">
                {item?.quantity}
              </span>
              
              <button
                onClick={() => handleUpdateCartItem(1)}
                className="p-1 rounded-full hover:bg-gray-100"
                aria-label="Increase quantity"
              >
                <PlusIcon className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            <button
              onClick={handleRemoveItemFromCart}
              className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
            >
              <TrashIcon className="h-4 w-4" />
              <span>Remove</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartItem;
