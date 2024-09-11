const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

app.post('/api/binance', async (req, res) => {
  try {
    const { data } = await axios.post('https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search', req.body);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

app.listen(3000, () => {
  console.log('Servidor corriendo en el puerto 3000');
});
