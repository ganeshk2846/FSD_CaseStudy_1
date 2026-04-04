import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProductDetails from "./pages/ProductDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import SearchResults from "./pages/SearchResults";
import Cart from "./pages/Cart";
import ProtectedRoute from "./routes/ProtectedRoute";
import { CategoryProvider } from "./context/CategoryContext";
import CategoryPage from "./pages/CategoryPage";
import ForgotPassword from "./pages/ForgotPassword";
import AdminRoute from "./routes/AdminRoute";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminUsers from "./pages/admin/AdminUsers";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import OrderHistory from "./pages/OrderHistory";
import AdminOrders from "./pages/admin/AdminOrders";
import Profile from "./pages/Profile";

function App() {
  return (
    <CategoryProvider>
      <Routes>

        {/* ---------- PUBLIC ROUTES ---------- */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* ---------- PROTECTED ROUTES ---------- */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <HomePage />
              </>
            </ProtectedRoute>
          }
        />

        <Route
          path="/product/:id"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <ProductDetails />
              </>
            </ProtectedRoute>
          }
        />

        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <SearchResults />
              </>
            </ProtectedRoute>
          }
        />

        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <Cart />
              </>
            </ProtectedRoute>
          }
        />

        <Route
          path="/category/:category"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <CategoryPage />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={<ProtectedRoute>
            <>
              <Navbar />
              <Checkout />
            </>
          </ProtectedRoute>} />
        <Route
          path="/order-success/:id"
          element={<ProtectedRoute>
            <>
              <Navbar />
              <OrderSuccess />
            </>
          </ProtectedRoute>} />
        <Route
          path="/my-orders"
          element={<ProtectedRoute>
            <>
              <Navbar />
              <OrderHistory />
            </>
          </ProtectedRoute>} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <Profile />
              </>
            </ProtectedRoute>
          }
        />

        {/* ---------- ADMIN ROUTES ---------- */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="users" element={<AdminUsers />} />

          <Route path="orders" element={<AdminOrders />} />
        </Route>

      </Routes>
    </CategoryProvider>
  );
}

export default App;
