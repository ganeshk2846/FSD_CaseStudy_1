import { createContext, useContext, useEffect, useState } from "react";
import API from "../api/axios";

const CategoryContext = createContext(null);

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    API.get("/products/categories")
      .then(res => setCategories(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <CategoryContext.Provider value={{ categories, loading }}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategories = () => useContext(CategoryContext);