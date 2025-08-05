const express = require("express");
const {
  obtenerJoyas,
  obtenerJoyasPorFiltros,
} = require("../controllers/controllersJoyas");

const router = express.Router();

router.get("/inventario", obtenerJoyas);
router.get("/inventario/filtros", obtenerJoyasPorFiltros);

module.exports = router;
