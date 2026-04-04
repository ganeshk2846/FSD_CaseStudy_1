import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [userId, setUserId] = useState(() => localStorage.getItem("userId"));

  const [cart, setCart] = useState(() => {
    const uid = localStorage.getItem("userId");
    if (!uid) return [];
    const stored = localStorage.getItem(`cart_${uid}`);
    return stored ? JSON.parse(stored) : [];
  });

  // ✅ When userId changes (login/logout), reload correct cart from localStorage
  useEffect(() => {
    const uid = localStorage.getItem("userId");
    setUserId(uid);

    if (!uid) {
      setCart([]); // logged out → empty cart
    } else {
      const stored = localStorage.getItem(`cart_${uid}`);
      setCart(stored ? JSON.parse(stored) : []);
    }
  }, []);  // runs once on mount

  // ✅ Persist cart whenever it changes
  useEffect(() => {
    if (userId) {
      localStorage.setItem(`cart_${userId}`, JSON.stringify(cart));
    }
  }, [cart, userId]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      if (existing) {
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const decreaseQty = (id) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item._id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  const clearCart = () => {
    setCart([]);
    const uid = localStorage.getItem("userId");
    if (uid) localStorage.removeItem(`cart_${uid}`);
  };

  // ✅ Call this on login to load the new user's cart
  const loadCartForUser = (uid) => {
    setUserId(uid);
    if (!uid) {
      setCart([]);
    } else {
      const stored = localStorage.getItem(`cart_${uid}`);
      setCart(stored ? JSON.parse(stored) : []);
    }
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        decreaseQty,
        removeFromCart,
        clearCart,
        loadCartForUser,  // ✅ expose this
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);