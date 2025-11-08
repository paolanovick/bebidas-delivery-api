import express from "express";
import {
  crearPedido,
  obtenerMisPedidos,
  listarTodosPedidos,
  actualizarEstadoPedido,
  eliminarPedido,
  eliminarTodosPedidos,
  eliminarHistorialUsuario,
} from "../backend/controllers/pedidosController.js";
import { verificarToken } from "../backend/middleware/auth.js"; // ← Importar verificarToken
import esAdmin from "../backend/middleware/esAdmin.js";

const router = express.Router();

// Rutas para usuarios autenticados
router.post("/", verificarToken, crearPedido);
router.get("/mis-pedidos", verificarToken, obtenerMisPedidos);
router.delete("/:id", verificarToken, eliminarPedido);
router.delete("/", verificarToken, eliminarTodosPedidos);

// Rutas solo para administradores
router.get("/", verificarToken, esAdmin, listarTodosPedidos);
router.put("/:id/estado", verificarToken, esAdmin, actualizarEstadoPedido);
router.delete(
  "/historial/:usuarioId",
  verificarToken,
  esAdmin,
  eliminarHistorialUsuario
);

export default router;
