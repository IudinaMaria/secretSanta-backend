const express = require('express');
const router = express.Router();
const {
  createExchange,
  getExchange,
  drawExchange
} = require('../controllers/exchangeController');
const authAdmin = require('../middleware/adminAuth');

// Создавать и перегенерировать жеребьёвку может только админ
router.post('/', authAdmin, createExchange);
router.post('/:id/draw', authAdmin, drawExchange);

// Получать инфо об обмене — можно всем (участникам по ссылке)
router.get('/:id', getExchange);

module.exports = router;
