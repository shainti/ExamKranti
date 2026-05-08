const express = require("express");
const cors = require("cors");
require("dotenv").config();

const router = require("./src/routes/exams.route");

const app = express();

// middleware
app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://ExamKranti.vercel.app",
    ],
    credentials: true,
  })
);

// home route
app.get("/", (req, res) => {
  res.send("API Running...");
});

// routes
app.use("/exams", router);

module.exports = app;