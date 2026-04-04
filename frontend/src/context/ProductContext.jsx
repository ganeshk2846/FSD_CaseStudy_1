import { createContext, useContext, useEffect, useState } from "react";
import API from "../api/axios";

const ProductContext = createContext(null);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    API.get("/products", { signal: controller.signal })
      .then(res => setProducts(res.data))
      .catch(err => {
        if (err.name === "CanceledError") return;
        console.error(err);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();

  }, []); // ✅ empty array — runs only once on mount

  return (
    <ProductContext.Provider value={{ products, loading }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);