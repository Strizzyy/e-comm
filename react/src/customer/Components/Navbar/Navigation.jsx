import { Fragment, useEffect, useState } from "react";
import { Dialog, Popover, Tab, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Avatar, Button, Menu, MenuItem } from "@mui/material";
import { deepPurple } from "@mui/material/colors";
import { navigation } from "../../../config/navigationMenu";
import AuthModal from "../Auth/AuthModal";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const openUserMenu = Boolean(anchorEl);

  const jwt = localStorage.getItem("jwt");

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }

    const fetchCart = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/cart", {
          headers: { Authorization: `Bearer ${jwt}` },
        });
        const data = await res.json();
        setCart(data.cart || {});
      } catch (error) {
        console.error("Cart fetch error:", error);
      }
    };

    if (jwt) {
      fetchCart();
    }
  }, [jwt]);

  useEffect(() => {
    if (user) handleClose();
    if (["/login", "/register"].includes(location.pathname)) {
      navigate(-1);
    }
  }, [user]);

  const handleUserClick = (event) => setAnchorEl(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorEl(null);
  const handleOpen = () => setOpenAuthModal(true);
  const handleClose = () => setOpenAuthModal(false);

  const handleLogout = () => {
    handleCloseUserMenu();
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  const handleMyOrderClick = () => {
    handleCloseUserMenu();
    user?.role === "ROLE_ADMIN" ? navigate("/admin") : navigate("/account/order");
  };

  return (
    <div className="bg-white pb-10">
      <header className="relative bg-white">
        <p className="flex h-10 items-center justify-center bg-indigo-600 px-4 text-sm font-medium text-white sm:px-6 lg:px-8">
          Get free delivery on orders over $100
        </p>
        <nav className="mx-auto">
          <div className="border-b border-gray-200">
            <div className="flex h-16 items-center px-11">
              <button
                type="button"
                className="rounded-md bg-white p-2 text-gray-400 lg:hidden"
                onClick={() => setOpen(true)}
              >
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </button>

              <div className="ml-4 flex lg:ml-0">
                <Link to="/">
                  <img
                    src="https://res.cloudinary.com/ddkso1wxi/image/upload/v1675919455/Logo/Copy_of_e-comm_Academy_nblljp.png"
                    alt="Logo"
                    className="h-8 w-8 mr-2"
                  />
                </Link>
              </div>

              <Popover.Group className="hidden lg:ml-8 lg:block lg:self-stretch z-10">
                <div className="flex h-full space-x-8">
                  {navigation.categories.map((category) => (
                    <Popover key={category.name} className="flex">
                      {({ open, close }) => (
                        <>
                          <Popover.Button
                            className={classNames(
                              open
                                ? "border-indigo-600 text-indigo-600"
                                : "border-transparent text-gray-700 hover:text-gray-800",
                              "relative z-10 -mb-px flex items-center border-b-2 pt-px text-sm font-medium"
                            )}
                          >
                            {category.name}
                          </Popover.Button>
                          <Transition
                            as={Fragment}
                            enter="transition ease-out duration-200"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition ease-in duration-150"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <Popover.Panel className="absolute inset-x-0 top-full text-sm text-gray-500">
                              <div className="relative bg-white shadow">
                                <div className="mx-auto max-w-7xl px-8">
                                  <div className="grid grid-cols-2 gap-x-8 gap-y-10 py-16">
                                    {category.sections.map((section) => (
                                      <div key={section.name}>
                                        <p className="font-medium text-gray-900">{section.name}</p>
                                        <ul className="mt-6 space-y-6">
                                          {section.items.map((item) => (
                                            <li key={item.name} className="flex">
                                              <p
                                                onClick={() => navigate(`/${category.id}/${section.id}/${item.id}`)}
                                                className="cursor-pointer hover:text-gray-800"
                                              >
                                                {item.name}
                                              </p>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </Popover.Panel>
                          </Transition>
                        </>
                      )}
                    </Popover>
                  ))}
                </div>
              </Popover.Group>

              <div className="ml-auto flex items-center">
                {user ? (
                  <>
                    <Avatar
                      onClick={handleUserClick}
                      sx={{ bgcolor: deepPurple[500], cursor: "pointer" }}
                    >
                      {user.firstName[0].toUpperCase()}
                    </Avatar>
                    <Menu
                      anchorEl={anchorEl}
                      open={openUserMenu}
                      onClose={handleCloseUserMenu}
                    >
                      <MenuItem onClick={handleMyOrderClick}>
                        {user.role === "ROLE_ADMIN" ? "Admin Dashboard" : "My Orders"}
                      </MenuItem>
                      <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </Menu>
                  </>
                ) : (
                  <Button onClick={handleOpen} className="text-sm font-medium">
                    Signin
                  </Button>
                )}

                <div className="flex items-center lg:ml-6">
                  <p
                    onClick={() => navigate("/products/search")}
                    className="p-2 text-gray-400 hover:text-gray-500 cursor-pointer"
                  >
                    <MagnifyingGlassIcon className="h-6 w-6" aria-hidden="true" />
                  </p>
                </div>

                <div className="ml-4 flow-root lg:ml-6">
                  <Button onClick={() => navigate("/cart")} className="group -m-2 flex items-center p-2">
                    <ShoppingBagIcon className="h-6 w-6 text-gray-400 group-hover:text-gray-500" />
                    <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
                      {cart.totalItem || 0}
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
      <AuthModal handleClose={handleClose} open={openAuthModal} />
    </div>
  );
}