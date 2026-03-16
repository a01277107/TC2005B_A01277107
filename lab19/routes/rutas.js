const express = require('express');
const router = express.Router();
const controlador = require('../controllers/controlador');
const isAuth = require('../middleware/is-auth');
const can = require('../middleware/can');

router.get('/contador', isAuth, controlador.getContador);
router.get('/inicio', isAuth, controlador.getInicio);
router.get('/fidelidad', isAuth, can('ver_fidelidad'), controlador.getFidelidad);
router.post('/fidelidad', isAuth, can('ver_fidelidad'), controlador.postFidelidad);

module.exports = router;
