const express = require('express');
const router = express.Router();
const controlador = require('../controllers/controlador');
const isAuth = require('../middleware/is-auth');

router.get('/contador', isAuth, controlador.getContador);
router.get('/inicio', isAuth, controlador.getInicio);
router.get('/fidelidad', isAuth, controlador.getFidelidad);
router.post('/fidelidad', isAuth, controlador.postFidelidad);

module.exports = router;
