import React, { useState } from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import {
  HomeIcon,
  ShoppingBagIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  CalendarIcon,
  PlusCircleIcon,
  UserCircleIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline';
import Dashboard from "./Views/Admin";
import CreateProductForm from "./componets/createProduct/CreateProductFrom";
import ProductsTable from "./componets/Products/ProductsTable";
import OrdersTable from "./componets/Orders/OrdersTable";
import Customers from "./componets/customers/customers";
import UpdateProductForm from "./componets/updateProduct/UpdateProduct";

const menu = [
  { name: "Dashboard", path: "/admin", icon: HomeIcon },
  { name: "Products", path: "/admin/products", icon: ShoppingBagIcon },
  { name: "Customers", path: "/admin/customers", icon: UserGroupIcon },
  { name: "Orders", path: "/admin/orders", icon: ClipboardDocumentListIcon },
  { name: "Total Earnings", path: "/admin/earnings", icon: CurrencyDollarIcon },
  { name: "Weekly Overview", path: "/admin/weekly", icon: ChartBarIcon },
  { name: "Monthly Overview", path: "/admin/monthly", icon: CalendarIcon },
  { name: "Add Product", path: "/admin/product/create", icon: PlusCircleIcon },
];

const bottomMenu = [
  { name: "Account", path: "/admin/account", icon: UserCircleIcon },
  { name: "Help", path: "/admin/help", icon: QuestionMarkCircleIcon },
];

export default function AdminPannel() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200 ease-in-out`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-4 border-b">
            <h1 className="text-xl font-bold text-indigo-600">Admin Panel</h1>
          </div>

          {/* Main Menu */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {menu.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                    isActive(item.path)
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </button>
              );
            })}
          </nav>

          {/* Bottom Menu */}
          <div className="px-4 py-4 border-t">
            {bottomMenu.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                    isActive(item.path)
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-200 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {/* Top Navigation */}
        <header className="bg-white shadow">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              <div className="flex items-center space-x-4">
                <button className="p-2 rounded-full text-gray-500 hover:text-gray-600 hover:bg-gray-100">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                </button>
                <div className="relative">
                  <button className="flex items-center space-x-2 p-2 rounded-full text-gray-500 hover:text-gray-600 hover:bg-gray-100">
                    <img
                      className="w-8 h-8 rounded-full"
                      src="https://via.placeholder.com/32"
                      alt="User"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/product/create" element={<CreateProductForm />} />
            <Route path="/product/update/:productId" element={<UpdateProductForm />} />
            <Route path="/products" element={<ProductsTable />} />
            <Route path="/orders" element={<OrdersTable />} />
            <Route path="/customers" element={<Customers />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
