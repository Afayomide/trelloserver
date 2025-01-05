const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
import pool from "./db";
const indexRouter = require("./routes/index");

const port = 4000;
const corsOption = {
  origin: ["http://localhost:5173", "https://audet.vercel.app"],
  credentials: true,
};

app.use(cors(corsOption));
app.use(bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.raw());
app.use(bodyParser.text());
app.use("/", indexRouter);
app.use(express.json());

pool.query(`
    CREATE TABLE IF NOT EXISTS task_history (
      id SERIAL PRIMARY KEY,
  task_id INT NOT NULL,
  action VARCHAR(50) NOT NULL,
  column_id VARCHAR(50),
  position INT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

async function connectToPostgres() {
  const retryAttempts = 3;
  for (let attempt = 1; attempt <= retryAttempts; attempt++) {
    try {
      console.log("Connecting to PostgreSQL...");
      await pool.connect();
      console.log("Connected to PostgreSQL");
      return;
    } catch (error: any) {
      console.error("Failed to connect to PostgreSQL:", error.message);
      throw new Error("Failed to connect to PostgreSQL");
    }
  }
}

connectToPostgres()
  .then(() => {
    console.log("connection succesful");
  })
  .catch((error) => {
    console.error("Fatal error:", error.message);
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
