import React, { useState } from "react";
import { productdata } from "../../../data";
import ProductCard from "../ProductCard/ProductCard";
import { FunnelIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';

const ProductPage = () => {
  const [sortOption, setSortOption] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);

  const sortOptions = [
    { name: 'Featured', value: 'featured' },
    { name: 'Price: Low to High', value: 'price-asc' },
    { name: 'Price: High to Low', value: 'price-desc' },
    { name: 'Newest First', value: 'newest' },
    { name: 'Best Rated', value: 'rating' },
  ];

  const handleSortChange = (value) => {
    setSortOption(value);
    // TODO: Implement sorting logic
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-2xl font-bold text-gray-900">All Products</h1>
        
        {/* Sort Menu */}
        <Menu as="div" className="relative">
          <Menu.Button className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900">
            Sort
            <ChevronDownIcon className="h-4 w-4" />
          </Menu.Button>
          <Transition
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1">
                {sortOptions.map((option) => (
                  <Menu.Item key={option.value}>
                    {({ active }) => (
                      <button
                        onClick={() => handleSortChange(option.value)}
                        className={`${
                          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                        } block w-full px-4 py-2 text-left text-sm ${
                          sortOption === option.value ? 'font-medium' : ''
                        }`}
                      >
                        {option.name}
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="lg:w-64">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 lg:hidden mb-4"
          >
            <FunnelIcon className="h-5 w-5" />
            Filters
          </button>
          
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block bg-white p-4 rounded-lg shadow-sm`}>
            {/* TODO: Add filter components */}
            <h3 className="text-lg font-medium text-gray-900 mb-4">Filters</h3>
            <div className="space-y-4">
              {/* Price Range Filter */}
              <div>
                <h4 className="text-sm font-medium text-gray-900">Price Range</h4>
                <div className="mt-2 space-y-2">
                  {/* TODO: Add price range slider */}
                </div>
              </div>
              
              {/* Category Filter */}
              <div>
                <h4 className="text-sm font-medium text-gray-900">Categories</h4>
                <div className="mt-2 space-y-2">
                  {/* TODO: Add category checkboxes */}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {productdata.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
