import { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import {
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Fragment } from "react";
import { useParams } from "react-router-dom";

const initialSizes = [
  { name: "S", quantity: 0 },
  { name: "M", quantity: 0 },
  { name: "L", quantity: 0 },
];

const UpdateProductForm = () => {
  const [productData, setProductData] = useState({
    imageUrl: "",
    brand: "",
    title: "",
    color: "",
    discountedPrice: "",
    price: "",
    discountPersent: "",
    size: initialSizes,
    quantity: "",
    topLavelCategory: "",
    secondLavelCategory: "",
    thirdLavelCategory: "",
    description: "",
  });

  const { productId } = useParams();
  const jwt = localStorage.getItem("jwt");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSizeChange = (e, index) => {
    let { name, value } = e.target;
    name = name === "size_quantity" ? "quantity" : name;

    const sizes = [...productData.size];
    sizes[index][name] = value;
    setProductData((prev) => ({
      ...prev,
      size: sizes,
    }));
  };

  const fetchProductById = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/products/${productId}`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      const data = await res.json();
      setProductData((prev) => ({
        ...prev,
        ...data,
        size: data.size || initialSizes,
      }));
    } catch (err) {
      console.error("Failed to fetch product:", err);
    }
  };

  useEffect(() => {
    fetchProductById();
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:8080/api/admin/products/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify(productData),
      });

      if (!res.ok) throw new Error("Failed to update product");

      const updated = await res.json();
      console.log("Updated product:", updated);
      alert("Product updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update product");
    }
  };

  return (
    <Fragment className="createProductContainer">
      <Typography variant="h3" sx={{ textAlign: "center" }} className="py-10 text-center">
        Update Product
      </Typography>
      <form onSubmit={handleSubmit} className="createProductContainer min-h-screen">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField fullWidth label="Image URL" name="imageUrl" value={productData.imageUrl} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Brand" name="brand" value={productData.brand} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Title" name="title" value={productData.title} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Color" name="color" value={productData.color} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Quantity" name="quantity" value={productData.quantity} onChange={handleChange} type="number" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Price" name="price" value={productData.price} onChange={handleChange} type="number" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Discounted Price" name="discountedPrice" value={productData.discountedPrice} onChange={handleChange} type="number" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Discount Percentage" name="discountPersent" value={productData.discountPersent} onChange={handleChange} type="number" />
          </Grid>
          <Grid item xs={6} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Top Level Category</InputLabel>
              <Select name="topLavelCategory" value={productData.topLavelCategory} onChange={handleChange}>
                <MenuItem value="Men">Men</MenuItem>
                <MenuItem value="Women">Women</MenuItem>
                <MenuItem value="Kids">Kids</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Second Level Category</InputLabel>
              <Select name="secondLavelCategory" value={productData.secondLavelCategory} onChange={handleChange}>
                <MenuItem value="Clothing">Clothing</MenuItem>
                <MenuItem value="Accessories">Accessories</MenuItem>
                <MenuItem value="Brands">Brands</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Third Level Category</InputLabel>
              <Select name="thirdLavelCategory" value={productData.thirdLavelCategory} onChange={handleChange}>
                <MenuItem value="Tops">Tops</MenuItem>
                <MenuItem value="Dresses">Dresses</MenuItem>
                <MenuItem value="T-Shirts">T-Shirts</MenuItem>
                <MenuItem value="Saree">Saree</MenuItem>
                <MenuItem value="Lengha Choli">Lengha Choli</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Description" multiline name="description" rows={3} value={productData.description} onChange={handleChange} />
          </Grid>

          {/* Sizes (Optional: Uncomment if needed)
          {productData.size.map((size, index) => (
            <Grid container item spacing={3} key={index}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Size Name"
                  name="name"
                  value={size.name}
                  onChange={(event) => handleSizeChange(event, index)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Quantity"
                  name="size_quantity"
                  type="number"
                  onChange={(event) => handleSizeChange(event, index)}
                  fullWidth
                />
              </Grid>
            </Grid>
          ))} */}

          <Grid item xs={12}>
            <Button variant="contained" sx={{ p: 1.8 }} size="large" type="submit">
              Update Product
            </Button>
          </Grid>
        </Grid>
      </form>
    </Fragment>
  );
};

export default UpdateProductForm;
