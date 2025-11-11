import mongoose from "mongoose";

const PedidoSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
  email: { type: String, required: true }, // 👈 NUEVO CAMPO
  items: [
    {
      bebida: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bebida",
        required: true,
      },
      nombre: String,
      precio: Number,
      cantidad: { type: Number, required: true, min: 1 },
    },
  ],
  total: { type: Number, required: true },
  estado: {
    type: String,
    enum: ["pendiente", "confirmado", "enviado", "entregado", "cancelado"],
    default: "pendiente",
  },
  direccionEntrega: { type: String, required: true },
  telefono: String,
  notas: String,
  fecha: { type: Date, default: Date.now },

  fechaEntrega: { type: Date, required: true },
  horaEntrega: { type: String, required: true },
});

export default mongoose.model("Pedido", PedidoSchema, "pedidos");
