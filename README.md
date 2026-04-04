# 🛒 DigiMart ECommerce

A full-stack ecommerce web application built with **React**, **Node.js**, **Express**, and **MongoDB**. Features include product browsing, cart management, order placement, Razorpay payment integration, and a full admin panel.

---

## 🚀 Live Features

### 👤 User
- Register, Login, Forgot Password (OTP via Gmail)
- Browse products by category
- Search products
- Product image scroll on hover
- Add to Cart / Remove / Update quantity (per-user persistent cart)
- Checkout with shipping address
- Cash on Delivery & Online Payment (Razorpay)
- Order history with cancel option
- Profile management (edit name, change password)

### 🛠️ Admin
- Dashboard with stats (products, users, low stock alerts)
- Product CRUD (add, edit, delete with image preview)
- Order management (filter by status, update status, expand details)
- User management (promote to admin, delete)

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router v6, Context API |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose) |
| Auth | JWT, bcryptjs |
| Payments | Razorpay |
| Email | Nodemailer (Gmail SMTP) |
| Dev Tools | Vite, Nodemon |

---

## 📁 Project Structure

```
DigiMart/
├── Backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   ├── adminController.js
│   │   └── paymentController.js
│   ├── db_models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   └── Order.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── routes/
│   │   ├── authRoute.js
│   │   ├── productRoute.js
│   │   ├── orderRoute.js
│   │   ├── adminRoute.js
│   │   └── paymentRoute.js
│   ├── utils/
│   │   └── sendEmail.js
│   ├── .env
│   └── server.js
│
└── frontend/
    └── src/
        ├── api/
        │   └── axios.js
        ├── components/
        │   ├── admin/
        │   │   └── AdminLayout.jsx
        │   ├── Navbar.jsx
        │   ├── ProductCard.jsx
        │   ├── SearchBar.jsx
        │   └── CategoryStrip.jsx
        ├── context/
        │   ├── CartContext.jsx
        │   ├── ProductContext.jsx
        │   └── CategoryContext.jsx
        ├── pages/
        │   ├── admin/
        │   │   ├── AdminDashboard.jsx
        │   │   ├── AdminProducts.jsx
        │   │   ├── AdminOrders.jsx
        │   │   └── AdminUsers.jsx
        │   ├── HomePage.jsx
        │   ├── ProductDetails.jsx
        │   ├── Cart.jsx
        │   ├── Checkout.jsx
        │   ├── OrderSuccess.jsx
        │   ├── OrderHistory.jsx
        │   ├── Profile.jsx
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   ├── ForgotPassword.jsx
        │   ├── SearchResults.jsx
        │   └── CategoryPage.jsx
        ├── routes/
        │   ├── ProtectedRoute.jsx
        │   └── AdminRoute.jsx
        ├── styles/
        │   └── ...
        ├── utils/
        │   └── logout.js
        ├── App.jsx
        └── main.jsx
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- Razorpay account (free test mode)
- Gmail account with App Password

---

### 1. Clone the repository

```bash
git clone https://github.com/your-username/digimart-ecommerce.git
cd digimart-ecommerce
```

---

### 2. Backend Setup

```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend/` folder:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ecommerceDB
JWT_SECRET=your_jwt_secret_key

EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password

RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxx
```

Start the backend:

```bash
npm start
```

Server runs at `http://localhost:5000`

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

---

### 4. Seed Products (optional)

If you want to load sample products, run in MongoDB shell:

```js
use ecommerceDB
// paste your product seed data here
```

Or import via MongoDB Compass using a JSON file.

---

## 🔑 Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Backend server port (default 5000) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT tokens |
| `EMAIL_USER` | Gmail address for sending OTPs |
| `EMAIL_PASS` | Gmail App Password (not your login password) |
| `RAZORPAY_KEY_ID` | Razorpay test/live key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay test/live key secret |

---

## 💳 Razorpay Test Credentials

Use these in test mode — no real money is charged:

```
Card Number : 4111 1111 1111 1111
Expiry      : Any future date
CVV         : Any 3 digits
OTP         : 1234
```

---

## 📧 Gmail App Password Setup

1. Go to [myaccount.google.com/security](https://myaccount.google.com/security)
2. Enable **2-Step Verification**
3. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
4. Create an app password → copy the 16-character code
5. Paste it as `EMAIL_PASS` in `.env` (no spaces)

---

## 🛣️ API Routes

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/signup` | Register user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/forgot-password` | Send OTP |
| POST | `/api/auth/verify-otp` | Verify OTP |
| POST | `/api/auth/reset-password` | Reset password |
| GET | `/api/auth/profile` | Get profile |
| PUT | `/api/auth/profile` | Update name |
| PUT | `/api/auth/change-password` | Change password |

### Products
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/products` | All products |
| GET | `/api/products/:id` | Single product |
| GET | `/api/products/search?query=` | Search |
| GET | `/api/products/categories` | All categories |
| GET | `/api/products/category/:name` | By category |

### Orders
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/orders` | Place order (COD) |
| GET | `/api/orders/my-orders` | User's orders |
| GET | `/api/orders/:id` | Order details |
| PUT | `/api/orders/:id/cancel` | Cancel order |

### Payments
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/payment/create-order` | Create Razorpay order |
| POST | `/api/payment/verify` | Verify payment |
| POST | `/api/payment/failed` | Mark payment failed |

### Admin
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/dashboard` | Dashboard stats |
| GET/POST | `/api/admin/products` | List / Add product |
| PUT/DELETE | `/api/admin/products/:id` | Edit / Delete product |
| GET | `/api/admin/orders/all` | All orders |
| PUT | `/api/admin/orders/:id/status` | Update order status |
| GET | `/api/admin/users` | All users |
| PUT | `/api/admin/users/:id/role` | Change user role |
| DELETE | `/api/admin/users/:id` | Delete user |

---

## 🔐 Default Admin Setup

To make a user admin, run in MongoDB shell:

```js
use ecommerceDB
db.users.updateOne(
  { email: "your_email@gmail.com" },
  { $set: { role: "admin" } }
)
```