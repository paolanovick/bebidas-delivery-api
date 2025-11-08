import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { conectarDB } from "./config/db.js";
import bebidasRoutes from "./routes/bebidasRoutes.js";
import usuariosRoutes from "./routes/usuariosRoutes.js";
import pedidosRoutes from "./routes/pedidosRoutes.js";
import horariosRoutes from "./routes/horariosRoutes.js";
import geoRouter from "./routes/geo.js";

dotenv.config();
conectarDB();

const app = express();

// CORS
app.use(cors());
app.use(express.json());

// Rutas backend
app.use("/api/bebidas", bebidasRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/pedidos", pedidosRoutes);
app.use("/api/horarios", horariosRoutes);
app.use("/api/geo", geoRouter);

app.get("/", (req, res) => {
  res.send("API de Bebidas Delivery funcionando 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
