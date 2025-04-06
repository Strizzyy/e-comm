import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import CartItem from "../Cart/CartItem";
import AddressCard from "../adreess/AdreessCard";

const OrderSummary = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const orderId = searchParams.get("order_id");
  const jwt = localStorage.getItem("jwt");

  const [orderData, setOrderData] = useState(null);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch order");

      const result = await res.json();
      setOrderData(result);
    } catch (error) {
      console.error("Error fetching order:", error);
    }
  };

  const handleCreatePayment = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({ orderId: orderData?.id }),
      });

      if (!res.ok) throw new Error("Payment creation failed");

      const result = await res.json();
      console.log("Payment initiated:", result);
      // You can navigate to payment confirmation page or show Razorpay modal here
      alert("Payment initiated successfully!");
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Payment failed");
    }
  };

  useEffect(() => {
    if (orderId) fetchOrder();
  }, [orderId]);

  return (
    <div className="space-y-5">
      <div className="p-5 shadow-lg rounded-md border">
        {orderData?.shippingAddress && (
          <AddressCard address={orderData.shippingAddress} />
        )}
      </div>

      <div className="lg:grid grid-cols-3 relative justify-between">
        <div className="lg:col-span-2">
          <div className="space-y-3">
            {orderData?.orderItems?.map((item) => (
              <CartItem key={item.id} item={item} showButton={false} />
            ))}
          </div>
        </div>

        <div className="sticky top-0 h-[100vh] mt-5 lg:mt-0 ml-5">
          <div className="border p-5 bg-white shadow-lg rounded-md">
            <p className="font-bold opacity-60 pb-4">PRICE DETAILS</p>
            <hr />
            <div className="space-y-3 font-semibold">
              <div className="flex justify-between pt-3 text-black">
                <span>Price ({orderData?.totalItem} item)</span>
                <span>₹{orderData?.totalPrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount</span>
                <span className="text-green-700">-₹{orderData?.discounte}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charges</span>
                <span className="text-green-700">Free</span>
              </div>
              <hr />
              <div className="flex justify-between font-bold text-lg">
                <span>Total Amount</span>
                <span className="text-green-700">₹{orderData?.totalDiscountedPrice}</span>
              </div>
            </div>

            <Button
              onClick={handleCreatePayment}
              variant="contained"
              type="submit"
              sx={{ padding: ".8rem 2rem", marginTop: "2rem", width: "100%" }}
            >
              Payment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
