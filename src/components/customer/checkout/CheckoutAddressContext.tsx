'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface CheckoutAddressContextType {
  deliveryInstructions: string;
  setDeliveryInstructions: (value: string) => void;
}

const CheckoutAddressContext = createContext<CheckoutAddressContextType | null>(null);

export function useCheckoutAddress() {
  return useContext(CheckoutAddressContext);
}

export function CheckoutAddressProvider({ children }: { children: ReactNode }) {
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  return (
    <CheckoutAddressContext.Provider value={{ deliveryInstructions, setDeliveryInstructions }}>
      {children}
    </CheckoutAddressContext.Provider>
  );
}
