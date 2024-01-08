import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import * as dotenv from "dotenv";
import authRouter from "./routes/authRouter.js";
import loanRouter from "./routes/loanRouter.js";

const app = express();
app.use(cors());
dotenv.config();
const PORT = 5000;

app.use(express.json());

const CONNECTION_URL = process.env.CONNECTION_URL;

// Connect to MongoDB
mongoose
  .connect(CONNECTION_URL)
  .then(() => console.log("Connected to database"))
  .catch((err) => console.error(err));

// middlwares
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/loans", loanRouter);

app.listen(PORT, () => {
  console.log(`App is listening to port ${PORT}`);
});
