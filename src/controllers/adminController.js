const jwt = require('jsonwebtoken');
const Exchange = require('../models/Exchange');
const Message = require('../models/Message');

async function loginAdmin(req, res) {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ message: 'password required' });
    }
    if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign(
      { role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function listExchanges(req, res) {
  try {
    const exchanges = await Exchange.find().sort({ createdAt: -1 });
    res.json(exchanges);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function getExchangeDetails(req, res) {
  try {
    const exchangeId = req.params.id;
    const exchange = await Exchange.findById(exchangeId);
    if (!exchange) {
      return res.status(404).json({ message: 'Exchange not found' });
    }

    const messages = await Message.find({ exchangeId }).sort({ createdAt: 1 });

    res.json({ exchange, messages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function deleteExchange(req, res) {
  try {
    const id = req.params.id;
    const exchange = await Exchange.findById(id);
    if (!exchange) {
      return res.status(404).json({ message: 'Exchange not found' });
    }

    // удаляем все сообщения этого обмена
    await Message.deleteMany({ exchangeId: id });
    await exchange.deleteOne();

    res.json({ message: 'Exchange deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
  loginAdmin,
  listExchanges,
  getExchangeDetails,
  deleteExchange
};
