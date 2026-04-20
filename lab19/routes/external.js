const express = require('express');
const router = express.Router();
const axios = require('axios');

const API_KEY = '3f8a9b7c2d4e5f6a7b8c9d0e1f2a3b4c';
const CIUDAD = 'Queretaro';

router.get('/clima', async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather`,
      {
        params: {
          q: CIUDAD,
          appid: API_KEY,
          units: 'metric',
          lang: 'es'
        }
      }
    );

    const { name, main, weather, wind } = response.data;

    res.json({
      ciudad: name,
      temperatura: main.temp,
      sensacion: main.feels_like,
      humedad: main.humidity,
      descripcion: weather[0].description,
      viento: wind.speed
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'No se pudo obtener el clima.' });
  }
});

module.exports = router;