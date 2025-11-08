import express from "express";
import { verificarToken } from "../backend/middleware/auth.js";
import {
  obtenerConfiguracion,
  actualizarConfiguracion,
  obtenerSlotsDisponibles,
} from "../backend/controllers/horariosController.js";

const router = express.Router();

router.get("/configuracion", obtenerConfiguracion);
router.put("/configuracion", verificarToken, actualizarConfiguracion);

// ✅ NUEVA RUTA CORRECTA
router.get("/slots-disponibles", obtenerSlotsDisponibles);

export default router;
