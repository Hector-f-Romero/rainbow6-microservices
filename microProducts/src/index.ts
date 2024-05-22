import express from "express";
import cors from "cors";
import "dotenv/config";
import morgan from "morgan";

import { connectToDB } from "./db/config.js";
import { productRouter } from "./routes/products.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 3001;

// Establish connection to DB.
await connectToDB();

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

app.use("/v1/products", productRouter);
// Handle errors in controllers
app.use(errorHandler);

app.listen(PORT, () => console.log(`Escuchando microservicio de Products en el puerto ${PORT} 🥶`));
