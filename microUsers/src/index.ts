import express from "express";
import cors from "cors";
import "dotenv/config";
import morgan from "morgan";

import { connectToDB } from "./db/config.js";
import { userRouter } from "./routes/users.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 3002;

// Establish connection to DB.
await connectToDB();

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

app.use("/v1/users", userRouter);
// Handle errors in controllers
app.use(errorHandler);

app.listen(PORT, () => console.log(`Escuchando microservicio de Users en el puerto ${PORT} 🤠`));
