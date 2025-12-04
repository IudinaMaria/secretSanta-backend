const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const authAdmin = require('../middleware/adminAuth');
const {
  loginAdmin,
  listExchanges,
  getExchangeDetails,
  deleteExchange
} = require('../controllers/adminController');
const Exchange = require('../models/Exchange');

// настройка multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(
      null,
      Date.now() + '-' + Math.round(Math.random() * 1e9) + ext
    );
  }
});

const upload = multer({ storage });

router.post('/login', loginAdmin);
router.get('/exchanges', authAdmin, listExchanges);
router.get('/exchanges/:id', authAdmin, getExchangeDetails);
router.delete('/exchanges/:id', authAdmin, deleteExchange);

// Загрузка фото участника: POST /api/admin/exchanges/:id/participants/:index/photo
router.post(
  '/exchanges/:id/participants/:index/photo',
  authAdmin,
  upload.single('photo'),
  async (req, res) => {
    try {
      const exchangeId = req.params.id;
      const idx = Number(req.params.index);
      const file = req.file;

      if (!file) {
        return res.status(400).json({ message: 'Файл не передан' });
      }

      const exchange = await Exchange.findById(exchangeId);
      if (!exchange) {
        return res
          .status(404)
          .json({ message: 'Exchange not found' });
      }

      if (idx < 0 || idx >= exchange.participants.length) {
        return res
          .status(400)
          .json({ message: 'Неверный индекс участника' });
      }

      const photoUrl = `${req.protocol}://${req.get(
        'host'
      )}/uploads/${file.filename}`;

      exchange.participants[idx].photoUrl = photoUrl;
      await exchange.save();

      res.json(exchange.participants[idx]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

module.exports = router;
