import {
  Grid,
  TextField,
  Button,
  Snackbar,
  Alert,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function RegisterUserForm({ handleNext }) {
  const navigate = useNavigate();
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [snackBarSeverity, setSnackBarSeverity] = useState("success");

  const handleClose = () => setOpenSnackBar(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const userData = {
      firstName: data.get("firstName"),
      lastName: data.get("lastName"),
      email: data.get("email"),
      password: data.get("password"),
      role: data.get("role"),
    };

    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem("jwt", result.jwt);
        localStorage.setItem("user", JSON.stringify(result.user));
        setSnackBarMessage("Registration Successful!");
        setSnackBarSeverity("success");
        setOpenSnackBar(true);
        navigate("/");
      } else {
        throw new Error(result.message || "Registration failed");
      }
    } catch (error) {
      console.error("Register error:", error);
      setSnackBarMessage(error.message);
      setSnackBarSeverity("error");
      setOpenSnackBar(true);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="firstName"
              name="firstName"
              label="First Name"
              fullWidth
              autoComplete="given-name"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="lastName"
              name="lastName"
              label="Last Name"
              fullWidth
              autoComplete="given-name"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              id="email"
              name="email"
              label="Email"
              fullWidth
              autoComplete="email"
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                name="role"
                required
                label="Role"
              >
                <MenuItem value={"ROLE_ADMIN"}>Admin</MenuItem>
                <MenuItem value={"ROLE_CUSTOMER"}>Customer</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              required
              id="password"
              name="password"
              label="Password"
              fullWidth
              type="password"
              autoComplete="new-password"
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              className="bg-[#9155FD] w-full"
              type="submit"
              variant="contained"
              size="large"
              sx={{ padding: ".8rem 0" }}
            >
              Register
            </Button>
          </Grid>
        </Grid>
      </form>

      <div className="flex justify-center flex-col items-center">
        <div className="py-3 flex items-center">
          <p className="m-0 p-0">Already have an account?</p>
          <Button onClick={() => navigate("/login")} className="ml-5" size="small">
            Login
          </Button>
        </div>
      </div>

      <Snackbar open={openSnackBar} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={snackBarSeverity} sx={{ width: "100%" }}>
          {snackBarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
