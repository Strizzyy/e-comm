import {
  Button,
  Grid,
  Rating,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const RateProduct = () => {
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [rating, setRating] = useState(0);
  const [product, setProduct] = useState(null);

  const isLargeScreen = useMediaQuery("(min-width:1200px)");
  const { productId } = useParams();
  const navigate = useNavigate();

  const handleRateProduct = (_, value) => {
    setRating(value);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("/api/reviews", {
        productId,
        title: formData.title,
        description: formData.description,
        rating,
      });

      alert("Review submitted successfully!");
      navigate(`/product/${productId}`);
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review.");
    }
  };

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`/api/products/${productId}`);
      setProduct(response.data);
    } catch (error) {
      console.error("Failed to load product", error);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  if (!product) return <p className="p-10">Loading product details...</p>;

  return (
    <div className="px-5 lg:px-20">
      <h1 className="text-xl p-5 shadow-lg mb-8 font-bold">
        Rate & Review Product
      </h1>
      <Grid container sx={{ justifyContent: "space-between" }}>
        <Grid
          item
          xs={12}
          lg={5.8}
          className="flex lg:items-center shadow-lg border rounded-md p-5"
        >
          <div>
            <img
              className="w-[5rem] lg:w-[15rem]"
              src={product.imageUrl}
              alt=""
            />
          </div>
          <div className="ml-3 lg:ml-5 space-y-2 lg:space-y-4">
            <p className="lg:text-lg">{product.title}</p>
            <p className="opacity-50 font-semibold">{product.brand}</p>
            <p>₹{product.price}</p>
            <p>Size: {product.size || "Free"}</p>
            {product.color && <p>Color: {product.color}</p>}
            <div className="flex items-center space-x-3">
              <Rating name="read-only" value={product.rating || 4.6} readOnly />
              <p className="opacity-60 text-sm">
                {product.ratingCount || "N/A"} Ratings
              </p>
            </div>
            <div>
              <p className="space-y-2 font-semibold">
                <FiberManualRecordIcon
                  sx={{ width: "15px", height: "15px" }}
                  className="text-green-600  mr-2"
                />
                <span>Delivered On Mar 03</span>
              </p>
              <p className="text-xs">Your Item Has Been Delivered</p>
            </div>
          </div>
        </Grid>

        <Grid item xs={12} lg={6}>
          <div className={`${!isLargeScreen ? "py-10" : ""} space-y-5`}>
            <div className="shadow-md border rounded-md p-5">
              <Typography className="font-semibold" component="legend">
                Rate This Product
              </Typography>
              <Rating
                name="simple-controlled"
                value={rating}
                onChange={handleRateProduct}
              />
            </div>
            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-5 shadow-md border rounded-md"
            >
              <TextField
                label="Title"
                variant="outlined"
                fullWidth
                margin="normal"
                value={formData.title}
                onChange={handleChange}
                name="title"
              />
              <TextField
                label="Description"
                variant="outlined"
                fullWidth
                margin="normal"
                multiline
                rows={4}
                value={formData.description}
                onChange={handleChange}
                name="description"
              />
              <Button type="submit" variant="contained" color="primary">
                Submit Review
              </Button>
            </form>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default RateProduct;
