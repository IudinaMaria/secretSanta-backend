const Exchange = require('../models/Exchange');
const { generatePairs } = require('../utils/secretSanta');

async function createExchange(req, res) {
  try {
    const {
      title,
      date,
      drawType,
      byMail,
      budgetCurrency,
      budgetAmount,
      organizerEmail,
      howHeard,
      message,
      participants
    } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'title обязателен' });
    }
    if (!participants || !Array.isArray(participants) || participants.length < 2) {
      return res
        .status(400)
        .json({ message: 'Нужно минимум 2 участника' });
    }

    const exchange = new Exchange({
      title,
      date: date ? new Date(date) : null,
      drawType: drawType || 'now',
      byMail: !!byMail,
      budgetCurrency: budgetCurrency || 'USD',
      budgetAmount: budgetAmount || 0,
      organizerEmail: organizerEmail || '',
      howHeard: howHeard || '',
      message: message || '',
      participants: participants.map((p) => ({
        name: p.name,
        email: p.email || ''
      })),
      status: 'pending'
    });

    // если надо жеребить сразу
    if (exchange.drawType === 'now') {
      const pairs = generatePairs(exchange.participants.length);
      exchange.participants.forEach((p, idx) => {
        p.receiverIndex = pairs[idx];
      });
      exchange.status = 'drawn';
    }

    await exchange.save();

    res.status(201).json(exchange);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function getExchange(req, res) {
  try {
    const exchange = await Exchange.findById(req.params.id);
    if (!exchange) {
      return res.status(404).json({ message: 'Exchange not found' });
    }
    res.json(exchange);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// на будущее, если захочешь жеребьёвку запускать позже
async function drawExchange(req, res) {
  try {
    const exchange = await Exchange.findById(req.params.id);
    if (!exchange) {
      return res.status(404).json({ message: 'Exchange not found' });
    }

    const count = exchange.participants.length;
    if (count < 2) {
      return res.status(400).json({ message: 'Нужно минимум 2 участника' });
    }

    const pairs = generatePairs(count);
    exchange.participants.forEach((p, idx) => {
      p.receiverIndex = pairs[idx];
    });
    exchange.status = 'drawn';

    await exchange.save();
    res.json(exchange);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
  createExchange,
  getExchange,
  drawExchange
};
