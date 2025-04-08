import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddressCard from "../adreess/AdreessCard";
import { CheckIcon } from '@heroicons/react/24/outline';

export default function AddDeliveryAddressForm({ handleNext }) {
  const navigate = useNavigate();
  const jwt = localStorage.getItem("jwt");
  const user = JSON.parse(localStorage.getItem("user"));
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    mobile: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.streetAddress) newErrors.streetAddress = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.zipCode) newErrors.zipCode = 'ZIP code is required';
    if (!formData.mobile) newErrors.mobile = 'Phone number is required';
    else if (!/^\d{10}$/.test(formData.mobile)) newErrors.mobile = 'Invalid phone number';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const res = await fetch("http://localhost:8080/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to place order");

      const result = await res.json();
      handleNext();
      navigate("/checkout?step=3");
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Order failed");
    }
  };

  const handleCreateOrder = async (address) => {
    try {
      const res = await fetch("http://localhost:8080/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify(address),
      });

      if (!res.ok) throw new Error("Order failed");

      const result = await res.json();
      handleNext();
      navigate("/checkout?step=3");
    } catch (error) {
      console.error(error);
      alert("Failed to place order");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Saved Addresses */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Saved Addresses</h2>
        <div className="space-y-4 max-h-[600px] overflow-y-auto">
          {user?.addresses?.map((item) => (
            <div
              key={item.id}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedAddress?.id === item.id
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-gray-200 hover:border-indigo-300'
              }`}
              onClick={() => setSelectedAddress(item)}
            >
              <AddressCard address={item} />
              {selectedAddress?.id === item.id && (
                <button
                  onClick={() => handleCreateOrder(item)}
                  className="mt-4 w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Deliver Here
                  <CheckIcon className="ml-2 h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* New Address Form */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Add New Address</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                  errors.firstName ? 'border-red-300' : ''
                }`}
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                  errors.lastName ? 'border-red-300' : ''
                }`}
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="streetAddress" className="block text-sm font-medium text-gray-700">
              Street Address
            </label>
            <textarea
              id="streetAddress"
              name="streetAddress"
              rows={3}
              value={formData.streetAddress}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                errors.streetAddress ? 'border-red-300' : ''
              }`}
            />
            {errors.streetAddress && (
              <p className="mt-1 text-sm text-red-600">{errors.streetAddress}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                  errors.city ? 'border-red-300' : ''
                }`}
              />
              {errors.city && (
                <p className="mt-1 text-sm text-red-600">{errors.city}</p>
              )}
            </div>

            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                State
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                  errors.state ? 'border-red-300' : ''
                }`}
              />
              {errors.state && (
                <p className="mt-1 text-sm text-red-600">{errors.state}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                ZIP Code
              </label>
              <input
                type="text"
                id="zipCode"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                  errors.zipCode ? 'border-red-300' : ''
                }`}
              />
              {errors.zipCode && (
                <p className="mt-1 text-sm text-red-600">{errors.zipCode}</p>
              )}
            </div>

            <div>
              <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                id="mobile"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                  errors.mobile ? 'border-red-300' : ''
                }`}
              />
              {errors.mobile && (
                <p className="mt-1 text-sm text-red-600">{errors.mobile}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Deliver Here
            <CheckIcon className="ml-2 h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
