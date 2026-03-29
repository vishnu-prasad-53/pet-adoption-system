import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import petRoutes from "./routes/petRoutes.js";
import adoptionRoutes from "./routes/adoptionRoutes.js"

dotenv.config();
 
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/pets", petRoutes);
app.use("/api/adoptions", adoptionRoutes);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));