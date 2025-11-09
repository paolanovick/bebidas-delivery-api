import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import conectarDB from "./backend/config/db.js";

import bebidasRoutes from "./backend/routes/bebidasRoutes.js";
import usuariosRoutes from "./backend/routes/usuariosRoutes.js";
import pedidosRoutes from "./backend/routes/pedidosRoutes.js";
import horariosRoutes from "./backend/routes/horariosRoutes.js";
import geoRouter from "./backend/routes/geo.js";

dotenv.config();
conectarDB();

const app = express();
app.use(
  cors({
    origin: function (origin, callback) {
      // Permitir requests sin origin (Postman, apps móviles)
      if (!origin) return callback(null, true);

      // Permitir localhost para desarrollo
      if (origin.includes("localhost")) return callback(null, true);

      // Permitir cualquier subdominio de vercel.app
      if (origin.endsWith(".vercel.app")) return callback(null, true);

      // Bloquear otros orígenes
      callback(new Error("No permitido por CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);



app.use(express.json());

// Rutas API
app.use("/api/bebidas", bebidasRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/pedidos", pedidosRoutes);
app.use("/api/horarios", horariosRoutes);
app.use("/api/geo", geoRouter);

app.get("/api", (req, res) => {
  res.json({ mensaje: "API funcionando correctamente" });
});

// ✅ Para desarrollo local
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  });
}

// ✅ Exportar para Vercel
export default app;
