const express = require('express');
const router = express.Router();
const {
  getMessages,
  addParticipantMessage,
  addSantaReply
} = require('../controllers/chatController');
const authAdmin = require('../middleware/adminAuth');

// GET /api/chat?exchangeId=...&participantIndex=0
router.get('/', getMessages);

// POST /api/chat
router.post('/', addParticipantMessage);

// POST /api/chat/reply  (только админ)
router.post('/reply', authAdmin, addSantaReply);

module.exports = router;
