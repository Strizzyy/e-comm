import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Card,
  CardHeader,
  Chip,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Select } from "@mui/material";

const OrdersTable = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ status: "", sort: "" });
  const [orders, setOrders] = useState([]);
  const [anchorElArray, setAnchorElArray] = useState([]);

  const jwt = localStorage.getItem("jwt");

  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/admin/orders", {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatusMenuClick = (event, index) => {
    const newAnchorElArray = [...anchorElArray];
    newAnchorElArray[index] = event.currentTarget;
    setAnchorElArray(newAnchorElArray);
  };

  const handleUpdateStatusMenuClose = (index) => {
    const newAnchorElArray = [...anchorElArray];
    newAnchorElArray[index] = null;
    setAnchorElArray(newAnchorElArray);
  };

  const handleConfirmedOrder = async (orderId, index) => {
    handleUpdateStatusMenuClose(index);
    await fetch(`http://localhost:8080/api/admin/orders/${orderId}/confirm`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${jwt}` },
    });
    fetchOrders();
  };

  const handleShippedOrder = async (orderId, index) => {
    handleUpdateStatusMenuClose(index);
    await fetch(`http://localhost:8080/api/admin/orders/${orderId}/ship`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${jwt}` },
    });
    fetchOrders();
  };

  const handleDeliveredOrder = async (orderId) => {
    await fetch(`http://localhost:8080/api/admin/orders/${orderId}/deliver`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${jwt}` },
    });
    fetchOrders();
  };

  const handleDeleteOrder = async (orderId) => {
    await fetch(`http://localhost:8080/api/admin/orders/${orderId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${jwt}` },
    });
    fetchOrders();
  };

  return (
    <Box>
      <Card className="mt-2">
        <CardHeader
          title="All Orders"
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
                <TableCell>Price</TableCell>
                <TableCell>Id</TableCell>
                <TableCell sx={{ textAlign: "center" }}>Status</TableCell>
                <TableCell sx={{ textAlign: "center" }}>Update</TableCell>
                <TableCell sx={{ textAlign: "center" }}>Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders?.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <AvatarGroup max={4} sx={{ justifyContent: "start" }}>
                      {item.orderItems.map((orderItem, i) => (
                        <Avatar
                          key={i}
                          alt={orderItem.product.title}
                          src={orderItem.product.imageUrl}
                        />
                      ))}
                    </AvatarGroup>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <Typography sx={{ fontWeight: 500, fontSize: "0.875rem !important" }}>
                        {item.orderItems.map((order, i) => (
                          <span key={i}> {order.product.title},</span>
                        ))}
                      </Typography>
                      <Typography variant="caption">
                        {item.orderItems.map((order, i) => (
                          <span key={i} className="opacity-60"> {order.product.brand},</span>
                        ))}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{item.totalPrice}</TableCell>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>
                    <Chip
                      label={item.orderStatus}
                      size="small"
                      color={
                        item.orderStatus === "PENDING"
                          ? "info"
                          : item.orderStatus === "DELIVERED"
                          ? "success"
                          : "secondary"
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <Button
                        onClick={(e) => handleUpdateStatusMenuClick(e, index)}
                      >
                        Status
                      </Button>
                      <Menu
                        anchorEl={anchorElArray[index]}
                        open={Boolean(anchorElArray[index])}
                        onClose={() => handleUpdateStatusMenuClose(index)}
                      >
                        <MenuItem
                          onClick={() => handleConfirmedOrder(item.id, index)}
                          disabled={
                            item.orderStatus === "DELIVERED" ||
                            item.orderStatus === "SHIPPED" ||
                            item.orderStatus === "CONFIRMED"
                          }
                        >
                          CONFIRMED ORDER
                        </MenuItem>
                        <MenuItem
                          onClick={() => handleShippedOrder(item.id, index)}
                          disabled={
                            item.orderStatus === "DELIVERED" ||
                            item.orderStatus === "SHIPPED"
                          }
                        >
                          SHIPPED ORDER
                        </MenuItem>
                        <MenuItem
                          onClick={() => handleDeliveredOrder(item.id)}
                        >
                          DELIVERED ORDER
                        </MenuItem>
                      </Menu>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleDeleteOrder(item.id)}
                      variant="text"
                    >
                      delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
};

export default OrdersTable;
