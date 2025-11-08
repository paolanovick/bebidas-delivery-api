import express from "express";
import {
  registrarUsuario,
  loginUsuario,
  getUsuariosConPedidos,
  eliminarHistorialUsuario,
} from "../controllers/usuariosController.js";
import { verificarToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/registro", registrarUsuario);
router.post("/login", loginUsuario);
router.get("/con-pedidos", verificarToken, getUsuariosConPedidos);
router.delete(
  "/:usuarioId/historial",
  verificarToken,
  eliminarHistorialUsuario
);

export default router;
