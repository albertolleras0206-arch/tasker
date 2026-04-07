require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const authRoutes = require("./server/routes/auth");
const authMiddleware = require("./server/middleware/authMiddleware");
const taskRoutes = require("./server/routes/taskRoutes");

const app = express();

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

const PORT = 5000;

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  })
  .catch(err => console.log(err));

app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user
  });
});