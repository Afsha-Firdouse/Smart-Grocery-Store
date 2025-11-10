import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./configs/db.js";
import "dotenv/config";
import userRouter from "./routes/userRoute.js";
import sellerRouter from "./routes/sellerRoute.js";
import connectCloudinary from "./configs/cloudinary.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import addressRouter from "./routes/addressRoute.js";
import orderRouter from "./routes/orderRoute.js";
import razorpay from "./configs/razorpay.js";

const app = express();
const port = process.env.PORT || 4000;

// ✅ Database & Cloudinary
await connectDB();
await connectCloudinary();

// ✅ CORS (MUST come before routes)
app.use(
  cors({
    origin: [
      "https://smart-grocery-store-frontend.vercel.app",
      "http://localhost:5173"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
  })
);

app.use(express.json());
app.use(cookieParser());

// ✅ Simple route for testing
app.get("/", (req, res) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://smart-grocery-store-frontend.vercel.app"
  );
  res.send("✅ Smart Grocery Store API is Working!");
});

// ✅ Routers
app.use("/api/user", userRouter);
app.use("/api/seller", sellerRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/address", addressRouter);
app.use("/api/order", orderRouter);

// ✅ Razorpay key endpoint
app.get("/api/getkey", (req, res) => {
  res.json({ key: process.env.RAZORPAY_KEY_ID });
});

app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});

export default app;
