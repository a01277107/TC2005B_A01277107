const express = require('express');
const router = express.Router();
const controller = require('../controllers/productos');
const isAuth = require('../middleware/is-auth');

router.get('/menu', isAuth, controller.getMenu);
router.get('/admin', isAuth, controller.getAdmin);
router.post('/admin/add', isAuth, controller.postAddProducto);
router.post('/admin/delete', isAuth, controller.postDeleteProducto);
router.get('/productos/:producto_id', isAuth, controller.getProducto);

module.exports = router;
