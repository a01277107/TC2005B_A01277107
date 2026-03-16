const express = require('express');
const router = express.Router();
const controller = require('../controllers/productos');

router.get('/menu', controller.getMenu);
router.get('/admin', controller.getAdmin);
router.post('/admin/add', controller.postAddProducto);
router.post('/admin/delete', controller.postDeleteProducto);
router.get('/productos/:producto_id', controller.getProducto);

module.exports = router;
