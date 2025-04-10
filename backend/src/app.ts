import express from "express";
import cors from "cors";
import { errorHandler } from "middleware/errorhandler";
import studentRouter from "./routes/student.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/students", studentRouter);

app.use(errorHandler);

export default app;
