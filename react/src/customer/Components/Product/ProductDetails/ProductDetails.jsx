// Redux-free version of ProductDetails
// Will replace Redux with localStorage and dummy data usage
// Not yet wired to backend – logic simplified for interviews

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RadioGroup } from "@headlessui/react";
import { Box, Button, Grid, LinearProgress, Rating } from "@mui/material";
import HomeProductCard from "../../Home/HomeProductCard";
import ProductReviewCard from "./ProductReviewCard";
import { gounsPage1 } from "../../../../Data/Gouns/gouns";

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
    // Simulated fetch from backend or local data
    const fetchProduct = async () => {
      const demoProduct = gounsPage1.find((p) => String(p.id) === productId);
      setProduct(demoProduct);
      setActiveImage({ src: demoProduct?.imageUrl });
    };
    fetchProduct();

    // Simulated fetch reviews
    const dummyReviews = [
      { name: "Ajay", comment: "Nice Product", rating: 5 },
      { name: "Reena", comment: "Loved the fit", rating: 4 },
    ];
    setReviews(dummyReviews);
  }, [productId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const cartItem = { productId, size: selectedSize.name };
    console.log("Add to Cart:", cartItem);
    localStorage.setItem("cart", JSON.stringify(cartItem));
    navigate("/cart");
  };

  return (
    <div className="p-5">
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
                {["S", "M", "L"].map((size) => (
                  <RadioGroup.Option
                    key={size}
                    value={{ name: size }}
                    className={({ active }) =>
                      classNames(
                        "border rounded px-3 py-1 cursor-pointer",
                        active ? "ring-2 ring-indigo-500" : ""
                      )
                    }
                  >
                    {size}
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

      <div className="mt-10">
        <h3 className="text-lg font-semibold">Recent Reviews</h3>
        {reviews.map((rev, i) => (
          <ProductReviewCard key={i} item={rev} />
        ))}
      </div>

      <div className="mt-10">
        <h3 className="text-lg font-semibold">Similar Products</h3>
        <div className="flex gap-4 flex-wrap mt-4">
          {gounsPage1.slice(0, 4).map((item) => (
            <HomeProductCard key={item.id} product={item} />
          ))}
        </div>
      </div>
    </div>
  );
}