import express from "express";
const router = express.Router();

console.log("✅ geo.js cargado");

router.get("/buscar", async (req, res) => {
  console.log("🔍 /buscar ejecutándose");
  console.log("Query:", req.query);

  try {
    const q = req.query.q;
    if (!q) {
      console.log("Sin query");
      return res.json([]);
    }

    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
      q
    )} Tandil Buenos Aires Argentina`;
    console.log("Llamando a:", url);

    const response = await fetch(url, {
      headers: {
        "User-Agent": "bebidas-app",
      },
    });

    const data = await response.json();
    console.log("Datos recibidos:", data.length);
    res.json(data);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;
