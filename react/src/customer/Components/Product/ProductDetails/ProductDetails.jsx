// Redux-free version of ProductDetails
// Will replace Redux with localStorage and dummy data usage
// Not yet wired to backend – logic simplified for interviews

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RadioGroup } from "@headlessui/react";
import { Box, Button, Grid, LinearProgress, Rating } from "@mui/material";
import HomeProductCard from "../../Home/HomeProductCard";
import ProductReviewCard from "./ProductReviewCard";
import api from "../../../../config/api"; // Import the api instance

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ProductDetails() {
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [activeImage, setActiveImage] = useState(null);
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();
  const { productId } = useParams();

  useEffect(() => {
    // Fetch product from backend
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/api/products/id/${productId}`);
        setProduct(data);
        setActiveImage({ src: data?.imageUrl });
      } catch (error) {
        console.error("Error fetching product:", error);
        // Handle error, e.g., show a message or redirect
      }
    };
    fetchProduct();

    // Simulated fetch reviews (replace with actual API call if available)
    const dummyReviews = [
      { user: { firstName: "Ajay" }, comment: "Nice Product", rating: 5 },
      { user: { firstName: "Reena" }, comment: "Loved the fit", rating: 4 },
    ];
    setReviews(dummyReviews);
  }, [productId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ensure selectedSize is not null before accessing its properties
    if (selectedSize) {
      const cartItem = { productId, size: selectedSize.name };
      console.log("Add to Cart:", cartItem);
      localStorage.setItem("cart", JSON.stringify(cartItem));
      navigate("/cart");
    } else {
      console.warn("No size selected.");
    }
  };

  return (
    <div className="p-5">
      {product ? ( // Render only if product data is available
        <div className="grid lg:grid-cols-2 gap-10">
          <div>
            <img
              src={activeImage?.src || product?.imageUrl}
              alt="product"
              className="w-full h-[25rem] object-cover"
            />
            <div className="flex gap-2 mt-4">
              {[product?.imageUrl].map((img, i) => (
                <img
                  key={i}
                  src={img}
                  className="w-20 h-20 border cursor-pointer"
                  onClick={() => setActiveImage({ src: img })}
                />
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold">{product?.title}</h2>
            <p className="text-gray-600">Brand: {product?.brand}</p>

            <div className="flex gap-4 mt-4">
              <p className="font-bold text-lg">₹{product?.discountedPrice}</p>
              <p className="line-through text-gray-400">₹{product?.price}</p>
            </div>

            <form className="mt-6" onSubmit={handleSubmit}>
              <h4 className="text-md mb-2">Select Size</h4>
              <RadioGroup value={selectedSize} onChange={setSelectedSize}>
                <div className="flex gap-3">
                  {/* Assuming product has a 'sizes' property which is an array of size objects with a 'name' property */}
                  {product?.sizes?.map((size) => (
                    <RadioGroup.Option
                      key={size.name}
                      value={size}
                      className={({ active }) =>
                        classNames(
                          "border rounded px-3 py-1 cursor-pointer",
                          active ? "ring-2 ring-indigo-500" : ""
                        )
                      }
                    >
                      {size.name}
                    </RadioGroup.Option>
                  ))}
                </div>
              </RadioGroup>

              <Button
                variant="contained"
                type="submit"
                sx={{ marginTop: "1rem" }}
                disabled={!selectedSize}
              >
                Add To Cart
              </Button>
            </form>

            <div className="mt-10">
              <h3 className="text-lg font-semibold">Description</h3>
              <p className="text-sm text-gray-700 mt-2">{product?.description}</p>
            </div>
          </div>
        </div>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <LinearProgress sx={{ width: '50%' }} />
        </Box>
      )}


      <div className="mt-10">
        <h3 className="text-lg font-semibold">Recent Reviews</h3>
        {reviews.map((rev, i) => (
          <ProductReviewCard key={i} item={rev} />
        ))}
      </div>

      {/* Removed Similar Products section as it was using dummy data */}
    </div>
  );
}