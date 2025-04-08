import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AddDeliveryAddressForm from "./AddAddress";
import OrderSummary from "./OrderSummary";
import { ChevronRightIcon } from '@heroicons/react/24/outline';

const steps = [
  { id: 'login', name: 'Login' },
  { id: 'address', name: 'Delivery Address' },
  { id: 'summary', name: 'Order Summary' },
  { id: 'payment', name: 'Payment' },
];

export default function Checkout() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const step = parseInt(queryParams.get('step') || '2');
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(`/checkout?step=${step - 1}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Stepper */}
      <nav aria-label="Progress">
        <ol role="list" className="flex items-center">
          {steps.map((stepItem, index) => {
            const isCurrent = index + 1 === step;
            const isCompleted = index + 1 < step;
            const isUpcoming = index + 1 > step;

            return (
              <li key={stepItem.id} className="relative">
                {index !== steps.length - 1 && (
                  <div
                    className={`absolute top-4 left-4 -ml-px mt-0.5 h-0.5 w-8 ${
                      isCompleted ? 'bg-indigo-600' : 'bg-gray-300'
                    }`}
                    aria-hidden="true"
                  />
                )}
                <div className="group relative flex items-start">
                  <span className="flex h-9 items-center">
                    <span
                      className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full ${
                        isCompleted
                          ? 'bg-indigo-600'
                          : isCurrent
                          ? 'border-2 border-indigo-600 bg-white'
                          : 'border-2 border-gray-300 bg-white'
                      }`}
                    >
                      {isCompleted ? (
                        <span className="h-2.5 w-2.5 rounded-full bg-white" />
                      ) : isCurrent ? (
                        <span className="h-2.5 w-2.5 rounded-full bg-indigo-600" />
                      ) : (
                        <span className="h-2.5 w-2.5 rounded-full bg-transparent" />
                      )}
                    </span>
                  </span>
                  <span className="ml-4 flex min-w-0 flex-col">
                    <span
                      className={`text-sm font-medium ${
                        isCurrent ? 'text-indigo-600' : 'text-gray-500'
                      }`}
                    >
                      {stepItem.name}
                    </span>
                  </span>
                </div>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Content */}
      <div className="mt-8">
        {step === 2 ? (
          <AddDeliveryAddressForm handleNext={() => navigate("/checkout?step=3")} />
        ) : (
          <OrderSummary />
        )}
      </div>
    </div>
  );
}
