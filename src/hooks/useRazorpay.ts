'use client';

import { useEffect, useState, useCallback } from 'react';

/**
 * WYSHKIT 2026: Lazy load Razorpay SDK only when payment slot expands
 * Section 3 Pattern 4: Progressive Disclosure
 * Section 10 Performance Budgets: Third-party scripts = 0 on product grid page
 */
export function useRazorpay() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkRazorpayLoaded = useCallback(() => {
    if (typeof window !== 'undefined' && (window as any).Razorpay) {
      setIsLoaded(true);
      setIsLoading(false);
      return true;
    }
    return false;
  }, []);

  const loadRazorpay = useCallback(() => {
    if (typeof window === 'undefined') return;

    // Already loaded
    if (checkRazorpayLoaded()) {
      return;
    }

    // Already loading
    if (isLoading) return;

    setIsLoading(true);
    setError(null);

    // Check if script already exists in DOM
    const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]') as HTMLScriptElement;
    if (existingScript) {
      // Script exists, check if it's loaded
      if (checkRazorpayLoaded()) {
        return;
      }
      // Wait for it to load
      existingScript.addEventListener('load', () => {
        checkRazorpayLoaded();
      });
      existingScript.addEventListener('error', () => {
        setError('Failed to load Razorpay SDK');
        setIsLoading(false);
      });
      return;
    }

    // Create and load script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      // Small delay to ensure Razorpay is available
      setTimeout(() => {
        if (checkRazorpayLoaded()) {
          setIsLoading(false);
        } else {
          setError('Razorpay SDK loaded but not available');
          setIsLoading(false);
        }
      }, 100);
    };
    script.onerror = () => {
      setError('Failed to load Razorpay SDK');
      setIsLoading(false);
    };
    document.body.appendChild(script);
  }, [isLoading, checkRazorpayLoaded]);

  // Check on mount if already loaded
  useEffect(() => {
    checkRazorpayLoaded();
  }, [checkRazorpayLoaded]);

  return {
    isLoaded,
    isLoading,
    error,
    loadRazorpay,
  };
}
