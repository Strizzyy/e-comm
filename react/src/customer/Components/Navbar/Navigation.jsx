import { Fragment, useEffect, useState } from "react";
import { Dialog, Popover, Tab, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  XMarkIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { navigation } from "../../../config/navigationMenu";
import AuthModal from "../Auth/AuthModal";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
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

  const handleOpen = () => setOpenAuthModal(true);
  const handleClose = () => setOpenAuthModal(false);

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  const handleMyOrderClick = () => {
    user?.role === "ROLE_ADMIN" ? navigate("/admin") : navigate("/account/order");
  };

  return (
    <div className="bg-white">
      {/* Top announcement bar */}
      <div className="bg-primary-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-10 items-center justify-center">
            <p className="text-sm font-medium text-white">
              Get free delivery on orders over $100
            </p>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <header className="relative bg-white shadow-sm">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Mobile menu button */}
            <div className="flex lg:hidden">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setOpen(true)}
              >
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            {/* Desktop navigation */}
            <div className="hidden lg:ml-6 lg:flex lg:space-x-8">
              {/* Main navigation links */}
              <Link
                to="/"
                className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium"
              >
                Home
              </Link>

              {/* Category dropdowns */}
              {navigation.categories.map((category) => (
                <Popover key={category.name} className="relative">
                  {({ open }) => (
                    <>
                      <Popover.Button
                        className={classNames(
                          open ? "text-primary-600" : "text-gray-700 hover:text-gray-900",
                          "group inline-flex items-center rounded-md text-sm font-medium focus:outline-none px-3 py-2"
                        )}
                      >
                        <span>{category.name}</span>
                      </Popover.Button>

                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                      >
                        <Popover.Panel className="absolute left-1/2 z-10 mt-3 w-screen max-w-md -translate-x-1/2 transform px-2 sm:px-0">
                          <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                            <div className="relative grid gap-6 bg-white p-7">
                              {category.sections.map((section) => (
                                <div key={section.name}>
                                  <h3 className="text-base font-semibold text-gray-900">
                                    {section.name}
                                  </h3>
                                  <ul className="mt-4 space-y-2">
                                    {section.items.map((item) => (
                                      <li key={item.name}>
                                        <button
                                          onClick={() => navigate(`/${category.id}/${section.id}/${item.id}`)}
                                          className="text-sm text-gray-600 hover:text-primary-600"
                                        >
                                          {item.name}
                                        </button>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          </div>
                        </Popover.Panel>
                      </Transition>
                    </>
                  )}
                </Popover>
              ))}
            </div>

            {/* Right side buttons */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <button
                onClick={() => navigate("/products/search")}
                className="btn-secondary p-2"
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>

              {/* Cart */}
              <button
                onClick={() => navigate("/cart")}
                className="btn-secondary p-2 relative"
              >
                <ShoppingBagIcon className="h-5 w-5" />
                {cart.totalItem > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.totalItem}
                  </span>
                )}
              </button>

              {/* User menu */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => navigate(user.role === "ROLE_ADMIN" ? "/admin" : "/account/order")}
                    className="btn-secondary p-2"
                  >
                    <UserCircleIcon className="h-5 w-5" />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      <button
                        onClick={handleMyOrderClick}
                        className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {user.role === "ROLE_ADMIN" ? "Admin Dashboard" : "My Orders"}
                      </button>
                      <button
                        onClick={handleLogout}
                        className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button onClick={handleOpen} className="btn-primary">
                  Sign in
                </button>
              )}
            </div>
          </div>
        </nav>

        {/* Mobile menu */}
        <Transition.Root show={open} as={Fragment}>
          <Dialog as="div" className="relative z-40 lg:hidden" onClose={setOpen}>
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-white pb-12 shadow-xl">
                  <div className="flex px-4 pt-5 pb-2">
                    <button
                      type="button"
                      className="-m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
                      onClick={() => setOpen(false)}
                    >
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>

                  {/* Quick links for mobile */}
                  <div className="space-y-6 px-4 py-6">
                    <div className="flow-root">
                      <Link
                        to="/"
                        onClick={() => setOpen(false)}
                        className="-m-2 block p-2 font-medium text-gray-900"
                      >
                        Home
                      </Link>
                    </div>
                  </div>

                  {/* Categories */}
                  <div className="space-y-6 border-t border-gray-200 py-6 px-4">
                    {navigation.categories.map((category) => (
                      <div key={category.name}>
                        <h3 className="font-medium text-gray-900">{category.name}</h3>
                        <div className="mt-2 space-y-2">
                          {category.sections.map((section) => (
                            <div key={section.name}>
                              <h4 className="text-sm font-medium text-gray-900">
                                {section.name}
                              </h4>
                              <ul className="mt-2 space-y-2">
                                {section.items.map((item) => (
                                  <li key={item.name}>
                                    <button
                                      onClick={() => {
                                        navigate(`/${category.id}/${section.id}/${item.id}`);
                                        setOpen(false);
                                      }}
                                      className="text-sm text-gray-600 hover:text-primary-600"
                                    >
                                      {item.name}
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>
      </header>

      <AuthModal handleClose={handleClose} open={openAuthModal} />
    </div>
  );
}