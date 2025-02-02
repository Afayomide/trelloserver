import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
require("dotenv").config();
import { PrismaClient } from "@prisma/client"; // Import PrismaClient

import conversationRoutes from "./routes/conversationRoutes";
import messageRoutes from "./routes/messageRoutes";
import userRoutes from "./routes/userRoutes"

const app = express();
const prisma = new PrismaClient(); // Instantiate PrismaClient

const port = 4000;

const corsOption = {
  origin: ["http://localhost:3000", "https://trello-rehla.vercel.app"],
  credentials: true,
};

app.use(cors(corsOption));
app.use(bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.raw());
app.use(bodyParser.text());

app.use("/conversations", conversationRoutes);
app.use("/messages", messageRoutes);
app.use("/users", userRoutes);


async function connectToPostgres() {
  try {
    console.log("Connecting to PostgreSQL...");
    await prisma.$connect(); 
    console.log("Connected to PostgreSQL");
  } catch (error: any) {
    console.error("Failed to connect to PostgreSQL:", error.message);
    process.exit(2); 
  }
}

connectToPostgres().then(() => {
  console.log("Connection successful");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
