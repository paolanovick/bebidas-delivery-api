import Usuario from "../models/Usuario.js";
import Pedido from "../models/Pedido.js";
import bcrypt from "bcryptjs";
import { generarJWT } from "../helpers/generarJWT.js";


// Registro de usuario
export const registrarUsuario = async (req, res) => {
  const { nombre, email, contrasena } = req.body;

  try {
    const existe = await Usuario.findOne({ email });
    if (existe) return res.status(400).json({ mensaje: "Email ya registrado" });

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(contrasena, salt);

    const nuevoUsuario = new Usuario({ nombre, email, contrasena: hash });
    await nuevoUsuario.save();

    res.json({ mensaje: "Usuario registrado correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al registrar usuario", error });
  }
};

// Login de usuario/admin
export const loginUsuario = async (req, res) => {
  try {
    const { email, contrasena } = req.body;

    if (!email || !contrasena) {
      return res
        .status(400)
        .json({ mensaje: "Todos los campos son obligatorios" });
    }

    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      return res
        .status(401)
        .json({ mensaje: "Email o contraseña incorrectos" });
    }

    const passwordCorrecta = await usuario.comprobarPassword(contrasena);

    if (!passwordCorrecta) {
      return res
        .status(401)
        .json({ mensaje: "Email o contraseña incorrectos" });
    }

    res.json({
      token: generarJWT(usuario._id),
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};


// Obtener usuarios con pedidos (solo admin)
export const getUsuariosConPedidos = async (req, res) => {
  try {
    if (req.usuario.rol !== "admin") {
      return res.status(403).json({ mensaje: "No autorizado" });
    }

    const usuarios = await Usuario.find().select("-contrasena");

    const usuariosConPedidos = await Promise.all(
      usuarios.map(async (usuario) => {
        const pedidos = await Pedido.find({ usuario: usuario._id })
          .populate("items.bebida", "nombre")
          .sort({ fecha: -1 });

        return {
          _id: usuario._id,
          nombre: usuario.nombre,
          email: usuario.email,
          rol: usuario.rol,
          pedidos,
        };
      })
    );

    res.json(usuariosConPedidos);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener usuarios" });
  }
};

// Eliminar historial de pedidos de un usuario (solo admin)
export const eliminarHistorialUsuario = async (req, res) => {
  try {
    if (req.usuario.rol !== "admin")
      return res.status(403).json({ mensaje: "No autorizado" });

    const { usuarioId } = req.params;
    await Pedido.deleteMany({ usuario: usuarioId });

    res.json({ mensaje: "Historial de pedidos eliminado" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar historial" });
  }
};
