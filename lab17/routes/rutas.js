const express = require('express');
const router = express.Router();
const controlador = require('../controllers/controlador');

router.get('/', controlador.getIndex);
router.post('/login', controlador.postLogin);
router.get('/logout', controlador.getLogout);
router.get('/contador', controlador.getContador);
router.get('/inicio', controlador.getInicio);
router.get('/fidelidad', controlador.getFidelidad);
router.post('/fidelidad', controlador.postFidelidad);

module.exports = router;
