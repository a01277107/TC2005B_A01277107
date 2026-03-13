const express = require('express');
const router = express.Router();
const controlador = require('../controllers/controlador');

router.get('/', controlador.getIndex);
router.post('/login', controlador.postLogin);
router.get('/logout', controlador.getLogout);
router.get('/contador', controlador.getContador);

module.exports = router;