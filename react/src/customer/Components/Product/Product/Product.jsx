import { Fragment, useEffect, useState } from "react";
import { Dialog, Disclosure, Menu, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  FunnelIcon,
  MinusIcon,
  PlusIcon,
  Squares2X2Icon,
} from "@heroicons/react/20/solid";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Pagination from "@mui/material/Pagination";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Backdrop, CircularProgress } from "@mui/material";

import { filters, singleFilter, sortOptions } from "./FilterData";
import ProductCard from "../ProductCard/ProductCard";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Product() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoaderOpen, setIsLoaderOpen] = useState(false);

  const navigate = useNavigate();
  const param = useParams();
  const location = useLocation();

  const decodedQueryString = decodeURIComponent(location.search);
  const searchParams = new URLSearchParams(decodedQueryString);
  const colorValue = searchParams.get("color");
  const sizeValue = searchParams.get("size");
  const price = searchParams.get("price");
  const disccount = searchParams.get("disccout");
  const sortValue = searchParams.get("sort");
  const pageNumber = searchParams.get("page") || 1;
  const stock = searchParams.get("stock");

  const handleLoderClose = () => setIsLoaderOpen(false);

  const handleSortChange = (value) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("sort", value);
    navigate({ search: `?${searchParams.toString()}` });
  };

  const handlePaginationChange = (event, value) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("page", value);
    navigate({ search: `?${searchParams.toString()}` });
  };

  const handleFilter = (value, sectionId) => {
    const searchParams = new URLSearchParams(location.search);
    let filterValues = searchParams.getAll(sectionId);

    if (filterValues.length > 0 && filterValues[0].split(",").includes(value)) {
      filterValues = filterValues[0].split(",").filter((item) => item !== value);
      if (filterValues.length === 0) {
        searchParams.delete(sectionId);
      }
    } else {
      filterValues.push(value);
    }

    if (filterValues.length > 0)
      searchParams.set(sectionId, filterValues.join(","));

    navigate({ search: `?${searchParams.toString()}` });
  };

  const handleRadioFilterChange = (e, sectionId) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set(sectionId, e.target.value);
    navigate({ search: `?${searchParams.toString()}` });
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoaderOpen(true);
      const [minPrice, maxPrice] =
        price === null ? [0, 0] : price.split("-").map(Number);

      const queryParams = new URLSearchParams({
        category: param.lavelThree || "",
        colors: colorValue || "",
        sizes: sizeValue || "",
        minPrice: minPrice || 0,
        maxPrice: maxPrice || 10000,
        minDiscount: disccount || 0,
        sort: sortValue || "price_low",
        pageNumber: pageNumber - 1,
        pageSize: 10,
        stock: stock || "",
      });

      try {
        const res = await fetch(`http://localhost:8080/api/products?${queryParams}`);
        const data = await res.json();
        setProducts(data.content || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setIsLoaderOpen(false);
      }
    };

    fetchProducts();
  }, [
    param.lavelThree,
    colorValue,
    sizeValue,
    price,
    disccount,
    sortValue,
    pageNumber,
    stock,
  ]);

  return (
    <div className="bg-white -z-20 ">
      <main className="mx-auto px-4 lg:px-14">
        {/* Header */}
        <div className="flex items-baseline justify-between border-b border-gray-200 pb-6">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Product</h1>
          <div className="flex items-center">
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                  Sort
                  <ChevronDownIcon
                    className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    {sortOptions.map((option) => (
                      <Menu.Item key={option.name}>
                        {({ active }) => (
                          <p
                            onClick={() => handleSortChange(option.query)}
                            className={classNames(
                              option.current ? "font-medium text-gray-900" : "text-gray-500",
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm cursor-pointer"
                            )}
                          >
                            {option.name}
                          </p>
                        )}
                      </Menu.Item>
                    ))}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>

            <button
              type="button"
              className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
              onClick={() => setMobileFiltersOpen(true)}
            >
              <FunnelIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <section className="pb-24 pt-6">
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-5">
            {/* Filters Sidebar */}
            <form className="hidden lg:block border rounded-md p-5">
              {filters.map((section) => (
                <Disclosure as="div" key={section.id} className="border-b border-gray-200 py-6">
                  {({ open }) => (
                    <>
                      <h3 className="-my-3 flow-root">
                        <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                          <span className="font-medium text-gray-900">{section.name}</span>
                          <span className="ml-6 flex items-center">
                            {open ? (
                              <MinusIcon className="h-5 w-5" aria-hidden="true" />
                            ) : (
                              <PlusIcon className="h-5 w-5" aria-hidden="true" />
                            )}
                          </span>
                        </Disclosure.Button>
                      </h3>
                      <Disclosure.Panel className="pt-6">
                        <div className="space-y-4">
                          {section.options.map((option, optionIdx) => (
                            <div key={option.value} className="flex items-center">
                              <input
                                id={`filter-${section.id}-${optionIdx}`}
                                name={`${section.id}[]`}
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                onChange={() => handleFilter(option.value, section.id)}
                              />
                              <label htmlFor={`filter-${section.id}-${optionIdx}`} className="ml-3 text-sm text-gray-600">
                                {option.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              ))}
              {singleFilter.map((section) => (
                <Disclosure as="div" key={section.id} className="border-b border-gray-200 py-6">
                  {({ open }) => (
                    <>
                      <h3 className="-my-3 flow-root">
                        <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                          <span className="font-medium text-gray-900">{section.name}</span>
                          <span className="ml-6 flex items-center">
                            {open ? (
                              <MinusIcon className="h-5 w-5" aria-hidden="true" />
                            ) : (
                              <PlusIcon className="h-5 w-5" aria-hidden="true" />
                            )}
                          </span>
                        </Disclosure.Button>
                      </h3>
                      <Disclosure.Panel className="pt-6">
                        <FormControl>
                          <RadioGroup name="radio-buttons-group">
                            {section.options.map((option) => (
                              <FormControlLabel
                                key={option.value}
                                value={option.value}
                                control={<Radio />}
                                label={option.label}
                                onChange={(e) => handleRadioFilterChange(e, section.id)}
                              />
                            ))}
                          </RadioGroup>
                        </FormControl>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              ))}
            </form>

            {/* Product List */}
            <div className="lg:col-span-4 w-full">
              <div className="flex flex-wrap justify-center bg-white border py-5 rounded-md">
                {products.map((item) => (
                  <ProductCard key={item.id} product={item} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Pagination */}
        <section className="w-full px-[3.6rem]">
          <div className="mx-auto px-4 py-5 flex justify-center shadow-lg border rounded-md">
            <Pagination count={totalPages} color="primary" onChange={handlePaginationChange} />
          </div>
        </section>

        {/* Loader */}
        <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isLoaderOpen} onClick={handleLoderClose}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </main>
    </div>
  );
}
