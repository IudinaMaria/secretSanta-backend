const Message = require('../models/Message');

async function getMessages(req, res) {
  try {
    const { exchangeId, participantIndex } = req.query;

    if (!exchangeId || participantIndex === undefined) {
      return res
        .status(400)
        .json({ message: 'exchangeId и participantIndex обязательны' });
    }

    const messages = await Message.find({
      exchangeId,
      participantIndex: Number(participantIndex)
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function addParticipantMessage(req, res) {
  try {
    const { exchangeId, participantIndex, text } = req.body;

    console.log('POST /api/chat body =', req.body);

    if (!exchangeId || participantIndex === undefined || !text) {
      return res
        .status(400)
        .json({ message: 'exchangeId и participantIndex обязательны' });
    }

    const message = await Message.create({
      exchangeId,
      participantIndex: Number(participantIndex),
      from: 'participant',
      text
    });

    res.status(201).json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function addSantaReply(req, res) {
  try {
    const { exchangeId, participantIndex, text } = req.body;

    if (!exchangeId || participantIndex === undefined || !text) {
      return res
        .status(400)
        .json({ message: 'exchangeId и participantIndex обязательны' });
    }

    const message = await Message.create({
      exchangeId,
      participantIndex: Number(participantIndex),
      from: 'santa',
      text
    });

    res.status(201).json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
  getMessages,
  addParticipantMessage,
  addSantaReply
};
