import React, { useEffect, useState } from "react";
import CartItem from "./CartItem";
import { useNavigate } from "react-router-dom";
import { ArrowRightIcon } from '@heroicons/react/24/outline';

const Cart = () => {
  const navigate = useNavigate();
  const jwt = localStorage.getItem("jwt");

  const [cartItems, setCartItems] = useState([]);
  const [cartSummary, setCartSummary] = useState({
    totalItem: 0,
    totalPrice: 0,
    discounte: 0,
    totalDiscountedPrice: 0,
  });

  const fetchCart = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/cart", {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      const data = await res.json();
      setCartItems(data.cartItems || []);
      setCartSummary(data.cart || {});
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
          <p className="text-gray-500 mb-8">Looks like you haven't added any items to your cart yet.</p>
          <button
            onClick={() => navigate("/products")}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
      
      <div className="lg:grid grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <CartItem 
              key={item.id} 
              item={item} 
              showButton={true} 
              onCartUpdate={fetchCart}
            />
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:sticky lg:top-8 h-fit">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal ({cartSummary.totalItem} items)</span>
                <span className="font-medium">₹{cartSummary.totalPrice}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Discount</span>
                <span className="text-green-600 font-medium">-₹{cartSummary.discounte}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery Charges</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total Amount</span>
                  <span className="text-green-600">₹{cartSummary.totalDiscountedPrice}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate("/checkout?step=2")}
              className="mt-6 w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Proceed to Checkout
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
