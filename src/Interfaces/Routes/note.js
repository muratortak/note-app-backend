const express = require('express');
const router = express.Router();
const auth = require('../Controllers/middleware/auth');
const NoteController = require('../Controllers/NoteController');

router.get('/notes', auth, NoteController.getAllNotes);

router.post('/updateNote', auth, NoteController.updateNote);

router.post('/addNote', auth, NoteController.addNote);

router.get('/deleteNote/:noteID', auth, NoteController.deleteNote);

module.exports = router;