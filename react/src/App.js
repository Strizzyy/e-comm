import { Route, Routes } from "react-router-dom";
import "./App.css";
import Navigation from "./customer/Components/Navbar/Navigation";
import CustomerRoutes from "./Routers/CustomerRoutes";
import AdminPannel from "./Admin/AdminPannel";
import NotFound from "./Pages/Notfound";
import { useEffect, useState } from "react";

function App() {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedJwt = localStorage.getItem("jwt");
    const storedUser = localStorage.getItem("user");

    if (storedJwt && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setRole(parsedUser.role);
      } catch (e) {
        console.error("Failed to parse user data from localStorage");
      }
    }
  }, []);

  return (
    <div>
      <Routes>
        <Route path="/*" element={<CustomerRoutes />} />
        {role === "ROLE_ADMIN" && (
          <Route path="/admin/*" element={<AdminPannel />} />
        )}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
