import React, { useEffect, useState } from "react";
import CartItem from "./CartItem";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

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

  return (
    <div className="">
      {cartItems.length > 0 && (
        <div className="lg:grid grid-cols-3 lg:px-16 relative">
          <div className="lg:col-span-2 lg:px-5 bg-white">
            <div className="space-y-3">
              {cartItems.map((item) => (
                <CartItem key={item.id} item={item} showButton={true} />
              ))}
            </div>
          </div>

          <div className="px-5 sticky top-0 h-[100vh] mt-5 lg:mt-0">
            <div className="border p-5 bg-white shadow-lg rounded-md">
              <p className="font-bold opacity-60 pb-4">PRICE DETAILS</p>
              <hr />

              <div className="space-y-3 font-semibold">
                <div className="flex justify-between pt-3 text-black">
                  <span>Price ({cartSummary.totalItem} item)</span>
                  <span>₹{cartSummary.totalPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount</span>
                  <span className="text-green-700">-₹{cartSummary.discounte}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span className="text-green-700">Free</span>
                </div>
                <hr />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total Amount</span>
                  <span className="text-green-700">₹{cartSummary.totalDiscountedPrice}</span>
                </div>
              </div>

              <Button
                onClick={() => navigate("/checkout?step=2")}
                variant="contained"
                type="submit"
                sx={{ padding: ".8rem 2rem", marginTop: "2rem", width: "100%" }}
              >
                Check Out
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
