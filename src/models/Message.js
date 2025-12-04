const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  exchangeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exchange',
    required: true
  },
  participantIndex: { type: Number, required: true }, // с кем чат
  from: { type: String, enum: ['participant', 'santa'], required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', MessageSchema);
