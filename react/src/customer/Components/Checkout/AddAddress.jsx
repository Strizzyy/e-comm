import * as React from "react";
import {
  Grid,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AddressCard from "../adreess/AdreessCard";

export default function AddDeliveryAddressForm({ handleNext }) {
  const navigate = useNavigate();
  const jwt = localStorage.getItem("jwt");
  const user = JSON.parse(localStorage.getItem("user"));
  const [selectedAddress, setSelectedAddress] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const address = {
      firstName: data.get("firstName"),
      lastName: data.get("lastName"),
      streetAddress: data.get("address"),
      city: data.get("city"),
      state: data.get("state"),
      zipCode: data.get("zip"),
      mobile: data.get("phoneNumber"),
    };

    try {
      const res = await fetch("http://localhost:8080/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify(address),
      });

      if (!res.ok) {
        throw new Error("Failed to place order");
      }

      const result = await res.json();
      console.log("Order placed:", result);
      handleNext();
      navigate("/checkout?step=3");
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Order failed");
    }
  };

  const handleCreateOrder = async (address) => {
    try {
      const res = await fetch("http://localhost:8080/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify(address),
      });

      if (!res.ok) throw new Error("Order failed");

      const result = await res.json();
      console.log("Order placed with saved address:", result);
      handleNext();
      navigate("/checkout?step=3");
    } catch (error) {
      console.error(error);
      alert("Failed to place order");
    }
  };

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} lg={5}>
        <Box className="border rounded-md shadow-md h-[30.5rem] overflow-y-scroll">
          {user?.addresses?.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedAddress(item)}
              className="p-5 py-7 border-b cursor-pointer"
            >
              <AddressCard address={item} />
              {selectedAddress?.id === item.id && (
                <Button
                  sx={{ mt: 2 }}
                  size="large"
                  variant="contained"
                  color="primary"
                  onClick={() => handleCreateOrder(item)}
                >
                  Deliver Here
                </Button>
              )}
            </div>
          ))}
        </Box>
      </Grid>

      <Grid item xs={12} lg={7}>
        <Box className="border rounded-md shadow-md p-5">
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="firstName"
                  name="firstName"
                  label="First Name"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="lastName"
                  name="lastName"
                  label="Last Name"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  id="address"
                  name="address"
                  label="Address"
                  fullWidth
                  multiline
                  rows={4}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField required id="city" name="city" label="City" fullWidth />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField required id="state" name="state" label="State" fullWidth />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="zip"
                  name="zip"
                  label="Zip / Postal code"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="phoneNumber"
                  name="phoneNumber"
                  label="Phone Number"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  sx={{ padding: ".9rem 1.5rem" }}
                  size="large"
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  Deliver Here
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Grid>
    </Grid>
  );
}
