const express = require("express");
const app = express();
const PORT = 3000;

const {
  obtenerJoyas,
  obtenerJoyasPorFiltros,
  prepararHATEOAS,
} = require("../queries/queriesJoyas");

app.use((req, res, next) => {
  console.log(`📥 Ruta consultada: ${req.method} ${req.url}`);
  next();
});

app.use(express.json());

app.get("/inventario/filtros", async (req, res) => {
  try {
    const queryStrings = req.query;
    const inventario = await obtenerJoyasPorFiltros(queryStrings);
    res.json(inventario);
  } catch (error) {
    console.error("❌ Error al obtener joyas filtradas:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

app.get("/inventario", async (req, res) => {
  try {
    const queryStrings = req.query;
    const inventario = await obtenerJoyas(queryStrings);
    const HATEOAS = prepararHATEOAS(inventario);
    res.json(HATEOAS);
  } catch (error) {
    console.error("❌ Error al obtener inventario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

app.use((req, res) => {
  res.status(404).send("❌ Esta ruta no existe");
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});
