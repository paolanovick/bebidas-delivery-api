// controllers/bebidasController.js
import Bebida from "../models/Bebida.js";

// Obtener todas las bebidas
export const getBebidas = async (req, res) => {
  try {
    const bebidas = await Bebida.find();
    res.json(bebidas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener bebidas" });
  }
};

// Agregar una bebida
export const agregarBebida = async (req, res) => {
  try {
    const { nombre, descripcion, precio, stock, imagen, categoria } = req.body;

    const nuevaBebida = new Bebida({
      nombre,
      descripcion,
      precio,
      stock,
      imagen,
      categoria, // ✅ Agregada aquí
    });

    await nuevaBebida.save();
    res.json(nuevaBebida);
  } catch (error) {
    res.status(500).json({ error: "Error al agregar bebida" });
  }
};


// Editar bebida
export const editarBebida = async (req, res) => {
  const { id } = req.params;
  try {
    const bebidaActualizada = await Bebida.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true } // ✅ importante
    );
    if (!bebidaActualizada) {
      return res.status(404).json({ mensaje: "Bebida no encontrada" });
    }
    res.json(bebidaActualizada);
  } catch (error) {
    console.error(error);
    res.status(400).json({ mensaje: "Error al actualizar bebida" });
  }
};


// Eliminar bebida
export const eliminarBebida = async (req, res) => {
  const { id } = req.params;
  try {
    const bebidaEliminada = await Bebida.findByIdAndDelete(id);
    if (!bebidaEliminada) {
      return res.status(404).json({ mensaje: "Bebida no encontrada" });
    }
    res.json({ mensaje: "Bebida eliminada" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ mensaje: "Error al eliminar bebida" });
  }
};
