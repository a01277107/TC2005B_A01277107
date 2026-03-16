const express = require('express');
const router = express.Router();
const controller = require('../controllers/productos');
const isAuth = require('../middleware/is-auth');
const can = require('../middleware/can');

router.get('/menu', isAuth, can('ver_menu'), controller.getMenu);
router.get('/admin', isAuth, can('ver_admin'), controller.getAdmin);
router.post('/admin/add', isAuth, can('crear_producto'), controller.postAddProducto);
router.post('/admin/delete', isAuth, can('eliminar_producto'), controller.postDeleteProducto);
router.post('/admin/users/roles', isAuth, can('gestionar_usuarios'), controller.postUpdateUserRoles);
router.get('/productos/:producto_id', isAuth, can('ver_menu'), controller.getProducto);

module.exports = router;
