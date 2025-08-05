const { pool } = require("../config/configJoyas");
const format = require("pg-format");

const obtenerJoyas = async ({ limits = 10, order_by = "id_ASC", page = 0 }) => {
  try {
    const [campo, direccion] = order_by.split("_");

   
    const direccionValida = direccion.toUpperCase() === "ASC" || direccion.toUpperCase() === "DESC"
      ? direccion.toUpperCase()
      : "ASC";

    const offset = (page - 1) * limits;

    const formattedQuery = format(
      "SELECT * FROM inventario ORDER BY %I %s LIMIT %L OFFSET %L",
      campo,
      direccionValida,
      limits,
      offset
    );

    const { rows: inventario } = await pool.query(formattedQuery);
    return inventario;
  } catch (error) {
    console.error("Error en obtenerJoyas:", error);
    throw error;
  }
};

const obtenerJoyasPorFiltros = async ({ precio_min, precio_max, categoria, metal }) => {
  try {
    let filtros = [];
    const values = [];
    const agregarFiltro = (campo, comparador, valor) => {
      values.push(valor);
      const { length } = filtros;
      filtros.push(`${campo} ${comparador} $${length + 1}`);
    };
    if (precio_max) agregarFiltro("precio", "<=", precio_max);
    if (precio_min) agregarFiltro("precio", ">=", precio_min);
    if (categoria) agregarFiltro("categoria", "=", categoria);
    if (metal) agregarFiltro("metal", "=", metal);
    let consulta = "SELECT * FROM inventario";
    if (filtros.length > 0) {
      filtros = filtros.join(" AND ");
      consulta += ` WHERE ${filtros}`;
    }
    const { rows: inventario } = await pool.query(consulta, values);
    return inventario;
  } catch (error) {
    console.error("Error en obtenerJoyasPorFiltros:", error);
    throw error;
  }
};

const prepararHATEOAS = (inventario) => {
  try {
    const results = inventario
      .map((j) => {
        return {
          name: j.nombre,
          href: `/inventario/nombre/${j.id}`,
        };
      })
      .slice(0, 4);
    const total = inventario.length;
    const HATEOAS = {
      total,
      results,
    };
    return HATEOAS;
  } catch (error) {
    console.error("Error en prepararHATEOAS:", error);
    throw error;
  }
};

module.exports = {
  obtenerJoyas,
  obtenerJoyasPorFiltros,
  prepararHATEOAS,
};
