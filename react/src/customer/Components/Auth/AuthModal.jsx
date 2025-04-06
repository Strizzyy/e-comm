import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import RegisterUserForm from "./Register";
import LoginUserForm from "./Login";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export default function AuthModal({ handleClose, open }) {
  const location = useLocation();

  useEffect(() => {
    const user = localStorage.getItem("jwt"); // Or "user" if you're storing full object
    if (user) handleClose();
  }, []);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      size="large"
    >
      <Box className="rounded-md" sx={style}>
        {location.pathname === "/login" ? (
          <LoginUserForm />
        ) : (
          <RegisterUserForm />
        )}
      </Box>
    </Modal>
  );
}
