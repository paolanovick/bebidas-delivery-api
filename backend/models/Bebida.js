import mongoose from "mongoose";

const bebidaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String },
  precio: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  imagen: { type: String },
  categoria: {
    type: String,
    // Si querés, podés limitar a estas (opcional)
    enum: [
      "Vinos",
      "Cervezas",
      "Espumantes",
      "Whisky",
      "Blancas",
      "Licores",
      "Aperitivos",
      "Espirituosas",
      "Mayoristas",
      "Ofertas",
      "Regalos",
      "Gift Cards",
      "Wine Club",
      "Experiencias",
      "", // permite "Sin categoría"
      undefined, // por si hay viejas
    ],
    default: "",
  },
  creadoEn: { type: Date, default: Date.now },
});

export default mongoose.model("Bebida", bebidaSchema);
