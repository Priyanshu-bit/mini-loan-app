import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRouter from "./routes/authRouter.js";
import loanRouter from "./routes/loanRouter.js";

const app = express();
app.use(cors());
const PORT = 5000;

app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://admin:YGvMDqz8yFGWkdpl@cluster0.qcl8va4.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => console.log("Connected to database"))
  .catch((err) => console.error(err));

// middlwares
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/loans", loanRouter);

app.listen(PORT, () => {
  console.log(`App is listening to port ${PORT}`);
});
