import {
  Avatar,
  Box,
  Button,
  Card,
  CardHeader,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ProductsTable = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [filterValue, setFilterValue] = useState({
    availability: "",
    category: "",
    sort: "",
  });
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const jwt = localStorage.getItem("jwt");

  // Query from URL
  const searchParams = new URLSearchParams(location.search);
  const availability = searchParams.get("availability");
  const category = searchParams.get("category");
  const sort = searchParams.get("sort");
  const page = searchParams.get("page");

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/admin/products/filter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          category: category || "",
          colors: [],
          sizes: [],
          minPrice: 0,
          maxPrice: 100000,
          minDiscount: 0,
          sort: sort || "price_low",
          pageNumber: page || 0,
          pageSize: 10,
          stock: availability,
        }),
      });

      const data = await res.json();
      setProducts(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [availability, category, sort, page]);

  const handleFilterChange = (e, sectionId) => {
    setFilterValue((prev) => ({ ...prev, [sectionId]: e.target.value }));
    searchParams.set(sectionId, e.target.value);
    const query = searchParams.toString();
    navigate({ search: `?${query}` });
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await fetch(`http://localhost:8080/api/admin/products/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      fetchProducts(); // Refresh list
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  const handlePaginationChange = (event, value) => {
    searchParams.set("page", value - 1);
    const query = searchParams.toString();
    navigate({ search: `?${query}` });
  };

  return (
    <Box width={"100%"}>
      <Card className="mt-2">
        <CardHeader
          title="All Products"
          sx={{
            pt: 2,
            alignItems: "center",
            "& .MuiCardHeader-action": { mt: 0.6 },
          }}
        />
        <TableContainer>
          <Table sx={{ minWidth: 800 }} aria-label="table in dashboard">
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>
                <TableCell>Title</TableCell>
                <TableCell sx={{ textAlign: "center" }}>Category</TableCell>
                <TableCell sx={{ textAlign: "center" }}>Price</TableCell>
                <TableCell sx={{ textAlign: "center" }}>Quantity</TableCell>
                <TableCell sx={{ textAlign: "center" }}>Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Avatar alt={item.title} src={item.imageUrl} />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <Typography
                        sx={{ fontWeight: 500, fontSize: "0.875rem !important" }}
                      >
                        {item.title}
                      </Typography>
                      <Typography variant="caption">{item.brand}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {item.category?.name}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {item.discountedPrice}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {item.quantity}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <Button
                      variant="text"
                      onClick={() => handleDeleteProduct(item.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Card className="mt-2 border">
        <div className="mx-auto px-4 py-5 flex justify-center shadow-lg rounded-md">
          <Pagination
            count={totalPages}
            color="primary"
            onChange={handlePaginationChange}
          />
        </div>
      </Card>
    </Box>
  );
};

export default ProductsTable;
