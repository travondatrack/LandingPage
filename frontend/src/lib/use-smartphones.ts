"use client";

import { useEffect, useState } from "react";
import { fetchSmartphones, type ProductLoadState } from "@/lib/products";

export function useSmartphones() {
  const [state, setState] = useState<ProductLoadState>({ status: "loading", products: [] });

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      try {
        setState({ status: "loading", products: [] });
        const products = await fetchSmartphones(controller.signal);

        if (products.length === 0) {
          setState({ status: "empty", products: [] });
          return;
        }

        setState({ status: "success", products });
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setState({
          status: "error",
          products: [],
          message: error instanceof Error ? error.message : "Unable to load smartphone products."
        });
      }
    }

    void loadProducts();

    return () => controller.abort();
  }, []);

  return state;
}
