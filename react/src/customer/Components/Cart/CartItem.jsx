import React from "react";
import { Button, IconButton } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

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
      onCartUpdate(); // Re-fetch cart in parent
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
      onCartUpdate(); // Re-fetch cart in parent
    } catch (error) {
      console.error("Failed to update cart item:", error);
    }
  };

  return (
    <div className="p-5 shadow-lg border rounded-md">
      <div className="flex items-center">
        <div className="w-[5rem] h-[5rem] lg:w-[9rem] lg:h-[9rem]">
          <img
            className="w-full h-full object-cover object-top"
            src={item?.product.imageUrl}
            alt={item?.product.title}
          />
        </div>
        <div className="ml-5 space-y-1">
          <p className="font-semibold">{item?.product?.title}</p>
          <p className="opacity-70">Size: {item?.size}, White</p>
          <p className="opacity-70 mt-2">Seller: {item?.product?.brand}</p>
          <div className="flex space-x-2 items-center pt-3">
            <p className="opacity-50 line-through">₹{item?.product.price}</p>
            <p className="font-semibold text-lg">₹{item?.product.discountedPrice}</p>
            <p className="text-green-600 font-semibold">
              {item?.product.discountPersent}% off
            </p>
          </div>
        </div>
      </div>

      {showButton && (
        <div className="lg:flex items-center lg:space-x-10 pt-4">
          <div className="flex items-center space-x-2">
            <IconButton
              onClick={() => handleUpdateCartItem(-1)}
              disabled={item?.quantity <= 1}
              color="primary"
            >
              <RemoveCircleOutlineIcon />
            </IconButton>

            <span className="py-1 px-7 border rounded-sm">{item?.quantity}</span>

            <IconButton
              onClick={() => handleUpdateCartItem(1)}
              color="primary"
            >
              <AddCircleOutlineIcon />
            </IconButton>
          </div>

          <div className="flex text-sm lg:text-base mt-5 lg:mt-0">
            <Button onClick={handleRemoveItemFromCart} variant="text">
              Remove
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartItem;
