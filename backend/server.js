const express = require("express");
const cors = require("cors");
require("dotenv").config();
const notificationRoutes = require("./routes/notificationRoutes");


// 1️⃣ DB connect 
const connectDB = require("./config/db");
connectDB();

const app = express();
app.use(express.json());

// 2️⃣ Global middlewares
app.use(cors());
app.use(express.json());

// 3️⃣ Root / health check route
app.get("/", (req, res) => {
  res.send("Backend server is running ");
});

// 4️⃣ Routes
app.use("/api/test", require("./routes/testRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/notifications", notificationRoutes);
app.use("/api/expenses", require("./routes/expenseRoutes"));



// 5️⃣ Other test APIs
app.get("/api/users", (req, res) => {
  res.json({
    success: true,
    message: "Users API working"
  });
});

// 6️⃣ Server listen (LAST)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
