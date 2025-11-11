import Pedido from "../models/Pedido.js";
import Bebida from "../models/Bebida.js";

// Crear pedido (YA NO REQUIERE LOGIN)
export const crearPedido = async (req, res) => {
  try {
    const {
      items,
      direccionEntrega,
      telefono,
      notas,
      fechaEntrega,
      horaEntrega,
      emailCliente, // 👈 LO TOMAMOS DEL BODY
    } = req.body;

    // Validaciones
    if (!items || items.length === 0) {
      return res.status(400).json({
        mensaje: "Debes agregar al menos una bebida al pedido",
      });
    }

    if (!emailCliente) {
      return res.status(400).json({ mensaje: "El email es obligatorio" });
    }

    if (!fechaEntrega || !horaEntrega) {
      return res.status(400).json({
        mensaje: "Debes seleccionar fecha y hora de entrega",
      });
    }

    // Validar stock y calcular total
    let total = 0;
    const itemsValidados = [];

    for (const item of items) {
      const bebida = await Bebida.findById(item.bebida);

      if (!bebida) {
        return res.status(404).json({
          mensaje: `Bebida no encontrada`,
        });
      }

      if (bebida.stock < item.cantidad) {
        return res.status(400).json({
          mensaje: `Stock insuficiente para ${bebida.nombre}`,
        });
      }

      // Actualizar stock
      bebida.stock -= item.cantidad;
      await bebida.save();

      total += bebida.precio * item.cantidad;

      itemsValidados.push({
        bebida: bebida._id,
        nombre: bebida.nombre,
        precio: bebida.precio,
        cantidad: item.cantidad,
      });
    }

    const nuevoPedido = new Pedido({
      // usuario SE VUELVE OPCIONAL → NO LO ENVIAMOS
      emailCliente, // 👈 ESTE ES EL QUE IDENTIFICA EL USUARIO
      items: itemsValidados,
      total,
      direccionEntrega,
      telefono,
      notas,
      fechaEntrega: new Date(fechaEntrega),
      horaEntrega,
    });

    await nuevoPedido.save();
    await nuevoPedido.populate("items.bebida", "nombre imagen");

    res.status(201).json({
      mensaje: "Pedido creado exitosamente",
      pedido: nuevoPedido,
    });
  } catch (error) {
    console.error("Error al crear pedido:", error);
    res.status(500).json({
      mensaje: "Error al crear pedido",
      error: error.message,
    });
  }
};

// Obtener pedidos por EMAIL (YA NO NECESITA LOGIN)
export const obtenerMisPedidos = async (req, res) => {
  try {
    const { emailCliente } = req.params; // 👈 VIENE EN LA URL

    const pedidos = await Pedido.find({ emailCliente })
      .populate("items.bebida", "nombre imagen precio")
      .sort({ fecha: -1 });

    res.json(pedidos);
  } catch (error) {
    console.error("Error al obtener pedidos:", error);
    res.status(500).json({ mensaje: "Error al obtener pedidos" });
  }
};

// Obtener TODOS los pedidos (solo admin)
export const listarTodosPedidos = async (req, res) => {
  try {
    if (req.usuario.rol !== "admin") {
      return res.status(403).json({ mensaje: "No autorizado" });
    }

    const pedidos = await Pedido.find()
      .populate("usuario", "nombre email")
      .populate("items.bebida", "nombre precio imagen")
      .sort({ fecha: -1 });

    res.json(pedidos);
  } catch (error) {
    console.error("Error al listar pedidos:", error);
    res.status(500).json({ mensaje: "Error al listar pedidos" });
  }
};

// Actualizar estado del pedido (solo admin)
export const actualizarEstadoPedido = async (req, res) => {
  try {
    if (req.usuario.rol !== "admin") {
      return res.status(403).json({ mensaje: "No autorizado" });
    }

    const { id } = req.params;
    const { estado } = req.body;

    const pedido = await Pedido.findByIdAndUpdate(
      id,
      { estado },
      { new: true }
    );

    if (!pedido) {
      return res.status(404).json({ mensaje: "Pedido no encontrado" });
    }

    res.json({ mensaje: "Estado actualizado", pedido });
  } catch (error) {
    console.error("Error al actualizar pedido:", error);
    res.status(500).json({ mensaje: "Error al actualizar pedido" });
  }
};

// Eliminar un pedido específico (se mantiene igual: solo admin o dueño si tiene usuario)
export const eliminarPedido = async (req, res) => {
  try {
    const { id } = req.params;
    const pedido = await Pedido.findById(id);

    if (!pedido) {
      return res.status(404).json({ mensaje: "Pedido no encontrado" });
    }

    await Pedido.findByIdAndDelete(id);
    res.json({ mensaje: "Pedido eliminado exitosamente" });
  } catch (error) {
    console.error("Error al eliminar pedido:", error);
    res.status(500).json({ mensaje: "Error al eliminar el pedido" });
  }
};

// Eliminar historial del usuario (solo admin, sin cambio)
export const eliminarHistorialUsuario = async (req, res) => {
  try {
    if (req.usuario.rol !== "admin") {
      return res.status(403).json({ mensaje: "No autorizado" });
    }

    const { usuarioId } = req.params;
    const resultado = await Pedido.deleteMany({ usuario: usuarioId });

    res.json({
      mensaje: "Historial eliminado exitosamente",
      cantidad: resultado.deletedCount,
    });
  } catch (error) {
    console.error("Error al eliminar historial:", error);
    res.status(500).json({ mensaje: "Error al eliminar el historial" });
  }
};
