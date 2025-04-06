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
import TextField from "@mui/material/TextField";

import { filters, singleFilter, sortOptions } from "./FilterData";
import ProductCard from "../ProductCard/ProductCard";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Backdrop, CircularProgress } from "@mui/material";
import menShirt from "../../../../Data/Men/men_shirt.json";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Product() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const param = useParams();
  const [isLoaderOpen, setIsLoaderOpen] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleLoderClose = () => {
    setIsLoaderOpen(false);
  };

  const decodedQueryString = decodeURIComponent(location.search);
  const searchParams = new URLSearchParams(decodedQueryString);
  const colorValue = searchParams.get("color")?.split(",") || [];
  const sizeValue = searchParams.get("size")?.split(",") || [];
  const price = searchParams.get("price");
  const disccount = Number(searchParams.get("disccout")) || 0;
  const sortValue = searchParams.get("sort");
  const pageNumber = Number(searchParams.get("page")) || 1;
  const stock = searchParams.get("stock");

  const handleSortChange = (value) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("sort", value);
    const query = searchParams.toString();
    navigate({ search: `?${query}` });
  };

  const handlePaginationChange = (event, value) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("page", value);
    const query = searchParams.toString();
    navigate({ search: `?${query}` });
  };

  const applyFilters = () => {
    setIsLoaderOpen(true);
    const [minPrice, maxPrice] = price ? price.split("-").map(Number) : [0, 10000];
    let products = menShirt;

    if (param.lavelThree) {
      products = products.filter((p) => p.category === param.lavelThree);
    }

    if (colorValue.length > 0) {
      products = products.filter((p) => colorValue.includes(p.color));
    }

    if (sizeValue.length > 0) {
      products = products.filter((p) => sizeValue.includes(p.size));
    }

    products = products.filter(
      (p) => p.discount >= disccount && p.price >= minPrice && p.price <= maxPrice
    );

    if (sortValue === "price_low") {
      products = [...products].sort((a, b) => a.price - b.price);
    } else if (sortValue === "price_high") {
      products = [...products].sort((a, b) => b.price - a.price);
    }

    if (searchTerm) {
      products = products.filter((p) =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(products);
    setTimeout(() => {
      setIsLoaderOpen(false);
    }, 500);
  };

  useEffect(() => {
    applyFilters();
  }, [param.lavelThree, location.search, searchTerm]);

  const handleFilter = (value, sectionId) => {
    const searchParams = new URLSearchParams(location.search);
    let filterValues = searchParams.get(sectionId)?.split(",") || [];

    if (filterValues.includes(value)) {
      filterValues = filterValues.filter((item) => item !== value);
    } else {
      filterValues.push(value);
    }

    if (filterValues.length > 0) {
      searchParams.set(sectionId, filterValues.join(","));
    } else {
      searchParams.delete(sectionId);
    }

    const query = searchParams.toString();
    navigate({ search: `?${query}` });
  };

  const handleRadioFilterChange = (e, sectionId) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set(sectionId, e.target.value);
    const query = searchParams.toString();
    navigate({ search: `?${query}` });
  };

  return (
    <div className="bg-white -z-20 ">
      <main className="mx-auto px-4 lg:px-14 ">
        <div className="flex items-baseline justify-between border-b border-gray-200 pb-6">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Product</h1>
        </div>

        <section aria-labelledby="products-heading" className="pb-24 pt-6">
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-5">
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
                                checked={searchParams.get(section.id)?.split(",").includes(option.value)}
                                onChange={() => handleFilter(option.value, section.id)}
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
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

            <div className="lg:col-span-4 w-full">
              <TextField
                id="outlined-basic"
                label="Search products..."
                variant="outlined"
                className="mb-5"
                fullWidth
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="flex flex-wrap justify-center bg-white border py-5 rounded-md">
                {filteredProducts.slice((pageNumber - 1) * 10, pageNumber * 10).map((item) => (
                  <ProductCard key={item.id} product={item} />
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <section className="w-full px-[3.6rem]">
        <div className="mx-auto px-4 py-5 flex justify-center shadow-lg border rounded-md">
          <Pagination
            count={Math.ceil(filteredProducts.length / 10)}
            color="primary"
            onChange={handlePaginationChange}
          />
        </div>
      </section>

      <section>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isLoaderOpen}
          onClick={handleLoderClose}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </section>
    </div>
  );
}