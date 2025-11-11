import Pedido from "../models/Pedido.js";
import Bebida from "../models/Bebida.js";

// Crear pedido (sin necesidad de usuario logueado)
export const crearPedido = async (req, res) => {
  try {
    const {
      items,
      direccionEntrega,
      telefono,
      notas,
      fechaEntrega,
      horaEntrega,
      emailCliente, // ✅ AHORA LO TOMAMOS DE LA REQUEST
    } = req.body;

    const usuarioId = req.usuario?.id || null; // ✅ Si no está logueado queda en null

    if (!items || items.length === 0) {
      return res
        .status(400)
        .json({ mensaje: "Debes agregar bebidas al pedido" });
    }

    if (!emailCliente) {
      return res.status(400).json({ mensaje: "El email es obligatorio" });
    }

    if (!fechaEntrega || !horaEntrega) {
      return res
        .status(400)
        .json({ mensaje: "Debes seleccionar fecha y hora de entrega" });
    }

    let total = 0;
    const itemsValidados = [];

    for (const item of items) {
      const bebida = await Bebida.findById(item.bebida);

      if (!bebida)
        return res.status(404).json({ mensaje: "Bebida no encontrada" });

      if (bebida.stock < item.cantidad) {
        return res
          .status(400)
          .json({ mensaje: `Stock insuficiente para ${bebida.nombre}` });
      }

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
      usuario: usuarioId,
      emailCliente, // ✅ GUARDADO EN LA BD
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

    res
      .status(201)
      .json({ mensaje: "Pedido creado exitosamente", pedido: nuevoPedido });
  } catch (error) {
    console.error("Error al crear pedido:", error);
    res.status(500).json({ mensaje: "Error al crear pedido" });
  }
};
