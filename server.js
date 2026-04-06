require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const authRoutes = require("./server/routes/auth");

const app = express();

app.use(express.json());
app.use("/api/auth", authRoutes);

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