const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');

// Levels routes (ensure these come first)
router.get('/levels', gameController.getLevels);
router.get('/levels/:id', gameController.getLevelById);

// Basic routes
router.get('/questions', gameController.getQuestions);
router.post('/check-answer', gameController.checkAnswer);
router.get('/progress', gameController.getProgress);

// Tutorial routes
router.get('/tutorials', gameController.getTutorials);
router.get('/tutorials/:id', gameController.getTutorialById);
router.post('/try-query', gameController.tryQuery);

module.exports = router;