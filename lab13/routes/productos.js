const express = require("express");
const router = express.Router();
const productosController = require("../controllers/productos_controller");

// Mostrar menú
router.get("/menu", productosController.getMenu);

// Mostrar panel admin
router.get("/admin", productosController.getAdmin);

// Agregar producto
router.post("/admin/add", productosController.postAdd);

// Eliminar producto
router.post("/admin/delete", productosController.postDelete);

module.exports = router;
