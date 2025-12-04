const mongoose = require('mongoose');

const ParticipantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, default: '' },
  receiverIndex: { type: Number, default: null },
  photoUrl: { type: String, default: '' } // ссылка на фото участника
});

const ExchangeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    date: { type: Date },
    drawType: { type: String, enum: ['now', 'scheduled'], default: 'now' },
    byMail: { type: Boolean, default: false },
    budgetCurrency: { type: String, default: 'USD' },
    budgetAmount: { type: Number, default: 0 },
    organizerEmail: { type: String, default: '' },
    howHeard: { type: String, default: '' },
    message: { type: String, default: '' },
    status: { type: String, enum: ['pending', 'drawn'], default: 'pending' },
    participants: [ParticipantSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Exchange', ExchangeSchema);
