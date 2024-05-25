import express from "express";
import cors from "cors";
import "dotenv/config";
import morgan from "morgan";

import { connectToDB } from "./db/config.js";
import { inventoryRouter } from "./routes/inventories.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 3003;

// Establish connection to DB.
await connectToDB();

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

app.use("/v1/inventories", inventoryRouter);
// Handle errors in controllers
app.use(errorHandler);

app.listen(PORT, () => console.log(`Escuchando microservicio de Inventories en el puerto ${PORT} 👽`));
