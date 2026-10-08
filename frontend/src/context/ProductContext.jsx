import { createContext, useContext, useEffect, useState } from "react";
import { fetchDummyProducts } from "../services/dummyProducts";

const ProductContext = createContext(null);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    fetchDummyProducts()
      .then((items) => setProducts(items))
      .catch((err) => {
        if (err.name === "CanceledError") return;
        console.error(err);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  return (
    <ProductContext.Provider value={{ products, loading }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);