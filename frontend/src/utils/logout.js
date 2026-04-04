export const logout = (navigate, loadCartForUser) => {
  const userId = localStorage.getItem("userId");
  if (userId) localStorage.removeItem(`cart_${userId}`);

  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("userId");

  // ✅ Wipe cart from React state immediately
  loadCartForUser(null);

  navigate("/login", { replace: true });
};